import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
 * Upload image file to Supabase Storage Bucket 'product-images' (or convert to Base64 fallback)
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

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

  // Fallback to DataURL/Base64 persistent string so image displays immediately & stays in state
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
