'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

interface BundleProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  sizes: string[];
}

interface StockInfo {
  available: boolean;
  quantity: number;
  lowStock?: boolean;
}

interface FrequentlyBoughtTogetherProps {
  currentProductId: string;
}

const bundleProducts: Record<string, BundleProduct> = {
  'sweat': {
    id: 'sweat',
    name: 'SCORPIONX TRACK PANTS MIDNIGHT BLUE',
    image: '/pant2.png',
    price: 270,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'track-sweater': {
    id: 'track-sweater',
    name: 'SCORPIONX ZIPUP HOODIE MIDNIGHT BLUE',
    image: '/zipup4.png',
    price: 250,
    sizes: ['S', 'M', 'L', 'XL'],
  },
};

const BUNDLE_PRICE = 475;

export function FrequentlyBoughtTogether({ currentProductId }: FrequentlyBoughtTogetherProps) {
  const { addItem } = useCart();
  
  // Determine which products to show in the bundle
  const currentProduct = bundleProducts[currentProductId];
  const otherProductId = currentProductId === 'sweat' ? 'track-sweater' : 'sweat';
  const otherProduct = bundleProducts[otherProductId];
  
  // Stock state for both products
  const [stockData, setStockData] = useState<Record<string, Record<string, StockInfo>>>({});
  const [stockLoading, setStockLoading] = useState(true);
  
  // If current product is not part of the bundle, don't show
  if (!currentProduct || !otherProduct) {
    return null;
  }

  const [selectedProducts, setSelectedProducts] = useState({
    [currentProductId]: true,
    [otherProductId]: true,
  });
  
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    [currentProductId]: '',
    [otherProductId]: '',
  });

  // Fetch stock data for both products
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [currentStockRes, otherStockRes] = await Promise.all([
          fetch(`/api/product-stock?productId=${currentProductId}`),
          fetch(`/api/product-stock?productId=${otherProductId}`)
        ]);

        const currentStockData = currentStockRes.ok ? await currentStockRes.json() : { stockInfo: {} };
        const otherStockData = otherStockRes.ok ? await otherStockRes.json() : { stockInfo: {} };

        setStockData({
          [currentProductId]: currentStockData.stockInfo || {},
          [otherProductId]: otherStockData.stockInfo || {}
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setStockData({
          [currentProductId]: {},
          [otherProductId]: {}
        });
      } finally {
        setStockLoading(false);
      }
    };

    fetchStockData();
  }, [currentProductId, otherProductId]);

  // Check if a product has any stock
  const hasAnyStock = (productId: string): boolean => {
    const productStock = stockData[productId];
    if (!productStock || Object.keys(productStock).length === 0) return true; // Assume in stock if no data
    return Object.values(productStock).some(stock => stock.available);
  };

  // Get available sizes for a product
  const getAvailableSizes = (productId: string): string[] => {
    const productStock = stockData[productId];
    const product = bundleProducts[productId];
    if (!productStock || Object.keys(productStock).length === 0) return product?.sizes || [];
    return product?.sizes.filter(size => productStock[size]?.available) || [];
  };

  // Check if a specific size is available
  const isSizeAvailable = (productId: string, size: string): boolean => {
    const productStock = stockData[productId];
    if (!productStock || Object.keys(productStock).length === 0) return true; // Assume available if no data
    return productStock[size]?.available ?? false;
  };

  const handleProductToggle = (productId: string) => {
    // Don't allow deselecting the current product
    if (productId === currentProductId) return;
    
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size,
    }));
  };

  const getSelectedCount = () => {
    return Object.values(selectedProducts).filter(Boolean).length;
  };

  const getTotalPrice = () => {
    const count = getSelectedCount();
    if (count === 2) {
      return BUNDLE_PRICE;
    }
    // If only one product selected, return its individual price
    if (selectedProducts[currentProductId] && !selectedProducts[otherProductId]) {
      return currentProduct.price;
    }
    if (!selectedProducts[currentProductId] && selectedProducts[otherProductId]) {
      return otherProduct.price;
    }
    return 0;
  };

  const handleAddToCart = () => {
    const productsToAdd: { product: BundleProduct; size: string }[] = [];
    
    if (selectedProducts[currentProductId]) {
      if (!selectedSizes[currentProductId]) {
        alert(`Please select a size for ${currentProduct.name}`);
        return;
      }
      if (!isSizeAvailable(currentProductId, selectedSizes[currentProductId])) {
        alert(`Selected size is out of stock for ${currentProduct.name}`);
        return;
      }
      productsToAdd.push({ product: currentProduct, size: selectedSizes[currentProductId] });
    }
    
    if (selectedProducts[otherProductId]) {
      if (!selectedSizes[otherProductId]) {
        alert(`Please select a size for ${otherProduct.name}`);
        return;
      }
      if (!isSizeAvailable(otherProductId, selectedSizes[otherProductId])) {
        alert(`Selected size is out of stock for ${otherProduct.name}`);
        return;
      }
      productsToAdd.push({ product: otherProduct, size: selectedSizes[otherProductId] });
    }

    // Add products to cart
    productsToAdd.forEach(({ product, size }) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: '',
        sizes: product.sizes,
        selectedSize: size,
        isBundle: getSelectedCount() === 2,
      });
    });
  };

  const ProductImage = ({ image, name }: { image: string; name: string }) => {
    if (image) {
      return (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      );
    }
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  };

  const currentProductInStock = hasAnyStock(currentProductId);
  const otherProductInStock = hasAnyStock(otherProductId);

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">FREQUENTLY BOUGHT TOGETHER</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Images */}
        <div className="flex items-center gap-4">
          {/* Current Product Image - Always shown */}
          <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 transition-all duration-300 ${
            !selectedProducts[currentProductId] || !currentProductInStock ? 'opacity-40 grayscale' : ''
          }`}>
            <ProductImage image={currentProduct.image} name={currentProduct.name} />
            {!stockLoading && !currentProductInStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">OUT OF STOCK</span>
              </div>
            )}
          </div>
          
          {/* Plus Sign - Only show when other product is selected */}
          {selectedProducts[otherProductId] && (
            <span className="text-2xl font-bold text-gray-400 transition-opacity duration-300">+</span>
          )}
          
          {/* Other Product Image - Fade out and hide when deselected */}
          {selectedProducts[otherProductId] && (
            <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 transition-all duration-300 ${
              !otherProductInStock ? 'opacity-40 grayscale' : ''
            }`}>
              <ProductImage image={otherProduct.image} name={otherProduct.name} />
              {!stockLoading && !otherProductInStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">OUT OF STOCK</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price and Add to Cart */}
        <div className="flex flex-col justify-center gap-4 md:ml-auto">
          <div className="text-right">
            <span className="text-gray-600">Total price: </span>
            <span className="text-2xl font-bold text-orange-600">{getTotalPrice().toFixed(2)} dh</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={stockLoading || (!currentProductInStock && selectedProducts[currentProductId]) || (!otherProductInStock && selectedProducts[otherProductId])}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {stockLoading ? 'Checking stock...' : 'Add selected to cart'}
          </button>
        </div>
      </div>

      {/* Product Selection with Size */}
      <div className="mt-6 space-y-4">
        {/* Current Product */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedProducts[currentProductId]}
              onChange={() => handleProductToggle(currentProductId)}
              disabled
              className="w-5 h-5 text-blue-600 rounded border-gray-300"
            />
            <span className="font-medium">
              <span className="text-blue-600">This item: </span>
              {currentProduct.name}
              {!stockLoading && !currentProductInStock && (
                <span className="ml-2 text-red-600 text-sm">(Out of Stock)</span>
              )}
            </span>
          </label>
          <select
            value={selectedSizes[currentProductId]}
            onChange={(e) => handleSizeChange(currentProductId, e.target.value)}
            disabled={!currentProductInStock}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Size</option>
            {currentProduct.sizes.map(size => {
              const available = isSizeAvailable(currentProductId, size);
              return (
                <option key={size} value={size} disabled={!available}>
                  {size}{!available ? ' (Out of Stock)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Other Product */}
        <div className={`flex items-center gap-4 flex-wrap transition-all duration-300 ${
          !selectedProducts[otherProductId] ? 'opacity-50' : ''
        }`}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedProducts[otherProductId]}
              onChange={() => handleProductToggle(otherProductId)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300"
            />
            <span className={`font-medium ${!selectedProducts[otherProductId] ? 'line-through text-gray-400' : ''}`}>
              {otherProduct.name}
              {!stockLoading && !otherProductInStock && (
                <span className="ml-2 text-red-600 text-sm">(Out of Stock)</span>
              )}
            </span>
          </label>
          <select
            value={selectedSizes[otherProductId]}
            onChange={(e) => handleSizeChange(otherProductId, e.target.value)}
            disabled={!selectedProducts[otherProductId] || !otherProductInStock}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Size</option>
            {otherProduct.sizes.map(size => {
              const available = isSizeAvailable(otherProductId, size);
              return (
                <option key={size} value={size} disabled={!available}>
                  {size}{!available ? ' (Out of Stock)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Bundle Savings Message */}
        {getSelectedCount() === 2 && currentProductInStock && otherProductInStock && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">
              🎉 BIG PROMO!!! You save {(currentProduct.price + otherProduct.price - BUNDLE_PRICE).toFixed(2)} dh by buying both together!
            </p>
          </div>
        )}

        {/* Out of Stock Warning */}
        {!stockLoading && (!currentProductInStock || !otherProductInStock) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">
              ⚠️ Some items in this bundle are currently out of stock.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
