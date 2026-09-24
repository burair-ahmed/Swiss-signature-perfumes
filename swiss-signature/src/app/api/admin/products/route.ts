import { NextResponse } from 'next/server';
import { verifyAdminRole } from '@/lib/auth';
import { saveProduct, deleteProduct, getStoredProducts } from '@/lib/orders-store';
import { sanityCreateOrUpdateProduct, sanityDeleteProduct } from '@/sanity/client';
import { Product } from '@/lib/types';

// GET: Admin fetch products
export async function GET(request: Request) {
  const authResult = verifyAdminRole(request, ['admin', 'super_admin']);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const products = getStoredProducts();
  return NextResponse.json({ success: true, products });
}

// POST: Create or Edit product (ADMIN/SUPER ADMIN ONLY)
export async function POST(request: Request) {
  const authResult = verifyAdminRole(request, ['admin', 'super_admin']);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const { id, name, slug, tagline, price, image, category, fragranceFamily, volume, description, longDescription, notes, badge, inStock } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Product name, price, and category are required' }, { status: 400 });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productId = id || `swiss-${generatedSlug}-${Date.now()}`;

    const newProduct: Product = {
      id: productId,
      name,
      slug: generatedSlug,
      tagline: tagline || `${fragranceFamily || 'Luxury'} fragrance by Swiss Signature`,
      price: Number(price),
      image: image || '/products/noir-absolu.jpg',
      images: [image || '/products/noir-absolu.jpg'],
      category: category as Product['category'],
      fragranceFamily: fragranceFamily || 'Amber',
      volume: Array.isArray(volume) && volume.length > 0 ? volume : ['50ml'],
      description: description || 'Artisanal perfume handcrafted with Swiss perfection.',
      longDescription: longDescription || description || 'Luxury fragrance notes.',
      notes: notes || { top: ['Citrus'], heart: ['Floral'], base: ['Wood'] },
      rating: 5.0,
      reviewCount: 147,
      badge: badge || undefined,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
    };

    // Save locally to persistent store
    saveProduct(newProduct);

    // Sync to Sanity CMS if configured
    await sanityCreateOrUpdateProduct(newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product created/updated successfully in Sanity CMS & catalog',
      product: newProduct,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

// DELETE: Delete product (ADMIN/SUPER ADMIN ONLY)
export async function DELETE(request: Request) {
  const authResult = verifyAdminRole(request, ['admin', 'super_admin']);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const deleted = deleteProduct(productId);
    await sanityDeleteProduct(productId);

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
