import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const DEFAULT_SUPABASE_URL = 'https://kyyhkutyazkqcrbnqzba.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_DBqkeyIdUvwUOOuVtVePdQ_Qndhw9cX';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all products from Supabase (or fallback)
 */
export async function fetchProductsFromDB(): Promise<Product[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }

    if (data) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        discountPercent: item.discount_percent ? Number(item.discount_percent) : undefined,
        images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
        imageSubclasses: item.image_subclasses && typeof item.image_subclasses === 'object' ? item.image_subclasses : undefined,
        colorSizes: item.color_sizes && typeof item.color_sizes === 'object' ? item.color_sizes : undefined,
        description: item.description || '',
        sizes: Array.isArray(item.sizes) ? item.sizes : [],
        badge: item.badge || undefined,
        featured: item.featured ?? false,
        inStock: item.in_stock ?? true
      }));
    }
  } catch (err) {
    console.error('Supabase connection error:', err);
  }
  return null;
}

/**
 * Save / Insert product to Supabase
 */
export async function saveProductToDB(product: Product): Promise<boolean> {
  if (!supabase) return false;

  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice ?? null,
      discount_percent: product.discountPercent ?? null,
      images: product.images || [],
      image_subclasses: product.imageSubclasses || {},
      color_sizes: product.colorSizes || {},
      description: product.description || '',
      sizes: product.sizes || [],
      badge: product.badge ?? null,
      featured: product.featured ?? false,
      in_stock: product.inStock ?? true
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('[LP] Supabase upsert error:', error.message, error.details, error.hint);
      console.error('[LP] Payload que falhou:', JSON.stringify(payload, null, 2));
      return false;
    }
    console.log('[LP] Produto salvo no Supabase com sucesso:', product.id, '| imagens:', product.images?.length);
    return true;
  } catch (err) {
    console.error('[LP] Supabase save exception:', err);
    return false;
  }
}

/**
 * Delete product from Supabase
 */
export async function deleteProductFromDB(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete error:', err);
    return false;
  }
}

/**
 * Client-side lightweight image compressor (converts heavy phone photos to ~100-150KB WebP)
 */
async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          'image/webp',
          quality
        );
      } else {
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * Upload image file to Supabase Storage Bucket 'product-images' with auto-compression.
 * Throws descriptive errors when Storage upload fails instead of silently falling back.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (supabase) {
    try {
      // 1. Compress image in browser before uploading
      const compressedBlob = await compressImage(file);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
      const filePath = `products/${fileName}`;

      console.log(`[LP] Uploading image: ${file.name} (${(file.size / 1024).toFixed(1)}KB) → compressed WebP → ${filePath}`);

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true
        });

      if (error) {
        // Provide a descriptive error message based on the error type
        let userMessage = `Erro ao subir "${file.name}": `;
        const errMsg = error.message || '';
        const statusCode = (error as any)?.statusCode;

        if (statusCode === 403 || errMsg.includes('security') || errMsg.includes('policy') || errMsg.includes('not allowed')) {
          userMessage += 'Permissão negada. Verifique as políticas RLS do bucket "product-images" e se sua sessão está ativa.';
        } else if (statusCode === 413 || errMsg.includes('too large') || errMsg.includes('payload')) {
          userMessage += 'Arquivo muito grande. Tente uma imagem menor.';
        } else if (statusCode === 401 || errMsg.includes('JWT') || errMsg.includes('token') || errMsg.includes('expired')) {
          userMessage += 'Sessão expirada. Faça login novamente.';
        } else if (errMsg.includes('bucket') || errMsg.includes('not found')) {
          userMessage += 'Bucket "product-images" não encontrado. Verifique a configuração no Supabase.';
        } else {
          userMessage += errMsg || 'Erro desconhecido no Storage.';
        }

        console.error('[LP] Storage upload error:', error);
        throw new Error(userMessage);
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          console.log(`[LP] Upload successful: ${publicUrlData.publicUrl}`);
          return publicUrlData.publicUrl;
        }
        throw new Error(`Erro ao obter URL pública da imagem "${file.name}". Verifique se o bucket está configurado como público.`);
      }
    } catch (e: any) {
      // Re-throw our own errors, wrap unexpected ones
      if (e?.message?.startsWith('Erro')) {
        throw e;
      }
      console.error('[LP] Supabase image upload exception:', e);
      throw new Error(`Exceção ao subir "${file.name}": ${e?.message || 'erro desconhecido'}`);
    }
  }

  // Fallback to DataURL/Base64 persistent string (only when Supabase is not configured)
  console.warn('[LP] Supabase not configured, falling back to base64 for:', file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
