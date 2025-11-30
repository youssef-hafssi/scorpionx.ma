import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch product from database
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error('Error fetching product:', productError);
      return NextResponse.json(
        { error: 'Product not found', details: productError.message },
        { status: 404 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch stock information for this product
    const { data: stockData, error: stockError } = await supabase
      .from('product_stock')
      .select('*')
      .eq('product_id', productId)
      .order('size', { ascending: true });

    if (stockError) {
      console.error('Error fetching stock:', stockError);
    }

    // Format stock data by size
    const stockInfo: Record<string, { available: boolean; quantity: number }> = {};
    let totalStock = 0;
    let hasLowStock = false;

    if (stockData) {
      stockData.forEach((stock: any) => {
        const isAvailable = stock.quantity > 0;
        stockInfo[stock.size] = {
          available: isAvailable,
          quantity: stock.quantity
        };
        totalStock += stock.quantity;
        if (stock.quantity <= stock.low_stock_threshold && stock.quantity > 0) {
          hasLowStock = true;
        }
      });
    }

    // Determine stock message
    let stockMessage = 'In Stock. Ready to Ship.';
    if (totalStock === 0) {
      stockMessage = 'Out of Stock';
    } else if (hasLowStock) {
      stockMessage = 'Limited Stock Available';
    }

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
        image: product.image,
      },
      stockInfo,
      stockMessage,
      totalStock
    });

  } catch (error) {
    console.error('Unexpected error in products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
