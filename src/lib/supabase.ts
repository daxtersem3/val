import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

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
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      discount_percent: product.discountPercent,
      images: product.images,
      description: product.description,
      sizes: product.sizes,
      badge: product.badge,
      featured: product.featured,
      in_stock: product.inStock
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save error:', err);
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
 * Upload image file to Supabase Storage Bucket 'product-images' with auto-compression
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (supabase) {
    try {
      // 1. Compress image in browser before uploading
      const compressedBlob = await compressImage(file);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', error);
      } else if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (e) {
      console.error('Supabase image upload exception:', e);
    }
  }

  // Fallback to DataURL/Base64 persistent string
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
