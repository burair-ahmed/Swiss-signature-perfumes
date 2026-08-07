import { Product } from '@/lib/types';

// Lightweight Sanity client configuration
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy_project_id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
};

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return null;
  }
  try {
    const url = `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.result as T;
  } catch {
    return null;
  }
}

/**
 * Execute mutations to Sanity CMS dataset when SANITY_API_TOKEN is provided.
 */
export async function sanityMutate(mutations: unknown[]): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !sanityConfig.token) {
    return false;
  }
  try {
    const url = `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/mutate/${sanityConfig.dataset}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sanityConfig.token}`,
      },
      body: JSON.stringify({ mutations }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Uploads/Creates product document in Sanity CMS
 */
export async function sanityCreateOrUpdateProduct(product: Product): Promise<boolean> {
  const sanityDoc = {
    _id: product.id,
    _type: 'product',
    name: product.name,
    slug: { _type: 'slug', current: product.slug },
    price: product.price,
    category: product.category,
    fragranceFamily: product.fragranceFamily,
    description: product.description,
    longDescription: product.longDescription,
    notes: product.notes,
    rating: product.rating,
    reviewCount: product.reviewCount,
    badge: product.badge,
    inStock: product.inStock,
  };

  const mutations = [{ createOrReplace: sanityDoc }];
  return await sanityMutate(mutations);
}

export async function sanityDeleteProduct(productId: string): Promise<boolean> {
  const mutations = [{ delete: { id: productId } }];
  return await sanityMutate(mutations);
}
