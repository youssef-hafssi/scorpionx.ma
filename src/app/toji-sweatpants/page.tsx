'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { calculateTojiPrice, getTojiPricePerItem } from '@/lib/pricing';

interface StockInfo {
  available: boolean;
  quantity: number;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export default function TojiSweatpantsPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [stockData, setStockData] = useState<Record<string, StockInfo>>({});
  const [stockLoading, setStockLoading] = useState(true); const [stockMessage, setStockMessage] = useState('In Stock. Ready to Ship.');
  const [selectedMainImage, setSelectedMainImage] = useState('/34.jpeg');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const productSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Hardcoded product data
  const productData: ProductData = {
    id: 'toji-sweatpants',
    name: 'Toji Sweatpants',
    description: `Made for Those who mix comfort, power & style

• Fit: Baggy / Comfortable
• Style: Suit Pants – inspired by Toji's look
• Use: Multi-purpose (Gym / Streetwear / Casual)
• Comfort: Soft fabric with natural stretch for all-day wear
• Waist: Elastic waistband with drawstring for adjustable fit
• Care: Machine wash cold – Do not bleach – Iron low
• Gender: Unisex

Premium streetwear comfort meets Islamic modesty. The ultimate sweatpants designed for brothers who value both style and faith. These versatile pants are perfect for the gym, casual outings, or everyday wear while maintaining a loose, modest fit that adheres to Islamic guidelines.`,
    price: 250,
    originalPrice: 320,
    image: '/34.jpeg'
  };

  // Product images for gallery
  const additionalImages = [
    '/32.jpeg',
    '/34.jpeg',
    '/36.jpeg',
    '/37.jpeg',
  ];

  const totalPrice = calculateTojiPrice(quantity);
  const pricePerItem = getTojiPricePerItem(quantity);

  // Fetch only stock data from database
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch('/api/product-stock?productId=toji-sweatpants');
        if (response.ok) {
          const data = await response.json();
          setStockData(data.stockInfo);
          setStockMessage(data.message);
        } else {
          console.error('Failed to fetch stock data');
        }
      } catch (error) {
        console.error('Error fetching stock:', error);
      } finally {
        setStockLoading(false);
      }
    };

    fetchStock();
  }, []); const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    // Check if selected size is available
    const sizeStock = stockData[selectedSize];
    if (!sizeStock || !sizeStock.available) {
      alert('Selected size is out of stock');
      return;
    }

    if (sizeStock.quantity < quantity) {
      alert(`Only ${sizeStock.quantity} items available in size ${selectedSize}`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        originalPrice: productData.originalPrice,
        image: productData.image,
        description: productData.description,
        sizes: productSizes,
        selectedSize
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const sizeStock = selectedSize ? stockData[selectedSize] : null;
    const maxQuantity = sizeStock ? sizeStock.quantity : 99;

    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
            <svg
              className="mx-2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li className="flex items-center">
            <a href="/collection" className="text-gray-500 hover:text-gray-700">Collection</a>
            <svg
              className="mx-2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li className="text-gray-700">{productData.name}</li>
        </ol>
      </nav>      {/* Product Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div 
            className="relative aspect-square overflow-hidden rounded-lg border cursor-zoom-in"
            onClick={() => selectedMainImage && setIsZoomOpen(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setMousePosition({ x, y });
            }}
          >
            <Image
              src={selectedMainImage}
              alt={productData.name}
              fill
              className={`object-cover transition-transform duration-200 ${isHovering ? 'scale-150' : 'scale-100'}`}
              style={isHovering ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` } : undefined}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {/* Additional images */}
            {additionalImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedMainImage(image)}
                className={`border-2 rounded-md overflow-hidden transition-colors ${selectedMainImage === image
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image}
                    alt={`${productData.name} - Additional Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>        {/* Product Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{productData.name}</h1>

          <div className="mt-3 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{totalPrice} DH</span>
            </div>
            {quantity > 1 && (
              <div className="text-sm text-green-600 font-medium">
                💰 Special bulk pricing applied!
              </div>
            )}            {/* Special Offer Table */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 SPECIAL OFFER:</h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className={`flex justify-between p-2 rounded ${quantity === 1 ? 'bg-blue-100 font-medium' : ''}`}>
                  <span>1 item:</span>
                  <span>250 DH</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${quantity === 2 ? 'bg-blue-100 font-medium' : ''}`}>
                  <span>2 items:</span>
                  <span>460 DH</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${quantity === 3 ? 'bg-blue-100 font-medium' : ''}`}>
                  <span>3 items:</span>
                  <span>670 DH</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {productSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const sizeStock = stockData[size];
                    const isUnavailable = !stockLoading && (!sizeStock || !sizeStock.available);

                    return (
                      <button
                        key={size}
                        onClick={() => !isUnavailable && setSelectedSize(size)}
                        disabled={isUnavailable}
                        className={`
                          min-w-[50px] h-[50px] text-sm font-medium border-2 transition-all relative
                          ${isSelected
                            ? 'bg-black text-white border-black'
                            : isUnavailable
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                              : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
                          }
                        `}
                        title={
                          isUnavailable
                            ? 'Out of stock'
                            : 'Available'
                        }
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Status */}
                <div className="flex items-center mt-3">
                  {stockLoading ? (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-gray-500 font-medium">Checking availability...</span>
                    </>
                  ) : (
                    <>
                      <div className={`w-2 h-2 rounded-full mr-2 ${stockMessage.includes('out of stock')
                        ? 'bg-red-500'
                        : 'bg-green-500'
                        }`}></div>
                      <span className={`text-sm font-medium ${stockMessage.includes('out of stock')
                        ? 'text-red-600'
                        : 'text-green-600'
                        }`}>
                        {stockMessage}
                      </span>
                    </>
                  )}
                </div>
              </div>



              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border-2 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="px-2 py-1 border-r-2 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-medium text-sm">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-2 py-1 border-l-2 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>                </div>              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full px-6 py-2 text-sm font-medium"
              >
                Add to Cart
              </Button>
            </div>


            {/* Product Information Sections */}
            <div className="mt-6 space-y-3">
              {/* Fast Shipping, Easy Returns, Built to Last */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 mb-1">Fast Shipping</h3>
                  <p className="text-xs text-gray-600">Quick delivery</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 mb-1">Easy Returns</h3>
                  <p className="text-xs text-gray-600">Hassle-free</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 mb-1">Built to Last</h3>
                  <p className="text-xs text-gray-600">Premium quality</p>
                </div>
              </div>              {/* Collapsible Sections */}
              <div className="space-y-2">
                {/* Product Info Section */}
                <ProductInfoSection description={productData.description} />

                {/* Size Guide Section */}
                <SizeGuideSection />

                {/* Shipping & Returns Section */}
                <ShippingReturnsSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomOpen && selectedMainImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close zoom"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows */}
          {additionalImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = additionalImages.indexOf(selectedMainImage);
                  const prevIndex = currentIndex === 0 ? additionalImages.length - 1 : currentIndex - 1;
                  setSelectedMainImage(additionalImages[prevIndex]);
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 p-2"
                aria-label="Previous image"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = additionalImages.indexOf(selectedMainImage);
                  const nextIndex = currentIndex === additionalImages.length - 1 ? 0 : currentIndex + 1;
                  setSelectedMainImage(additionalImages[nextIndex]);
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 p-2"
                aria-label="Next image"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Zoomed image */}
          <div 
            className="relative w-full h-full max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedMainImage}
              alt={productData.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Image counter */}
          {additionalImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {additionalImages.indexOf(selectedMainImage) + 1} / {additionalImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Product Info Collapsible Section
function ProductInfoSection({ description }: { description: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-gray-900 uppercase tracking-wide">PRODUCT INFO</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-4 text-sm text-gray-600">
            <div className="leading-relaxed whitespace-pre-line">{description}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Size Guide Collapsible Section
function SizeGuideSection() {
  const [isOpen, setIsOpen] = useState(false);

  const sizeGuideImages = [
    { size: 'Small', image: '/SMALL.png' },
    { size: 'Medium', image: '/MEDIUM.png' },
    { size: 'Large', image: '/LARGE.png' },
    { size: 'XL', image: '/XLARGE.png' }
  ];

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-gray-900 uppercase tracking-wide">SIZE GUIDE</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-6">All measurements are in cm unless noted otherwise.</p>

            {/* Size Guide Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sizeGuideImages.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b">
                    <h4 className="font-medium text-gray-900 text-center">{item.size}</h4>
                  </div>
                  <div className="p-4">
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={`Size guide for ${item.size}`}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="flex items-center justify-center h-full bg-gray-100 rounded">
                              <div class="text-center">
                                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p class="text-sm text-gray-500">${item.size} guide coming soon</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shipping & Returns Collapsible Section
function ShippingReturnsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-gray-900 uppercase tracking-wide">SHIPPING & RETURNS</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-4 space-y-4 text-sm text-gray-600">
            {/* Arabic Version First */}
            <div className="text-right" dir="rtl">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">الأسعار والدفع</h4>
                <ul className="space-y-1">
                  <li>• أثمنة المنتوجات شاملة التوصيل</li>
                  <li>• الدفع عند الاستلام</li>
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">معلومات التوصيل</h4>
                <ul className="space-y-1">
                  <li>• يتم التوصيل بالطلبية خلال 24-72 ساعة</li>
                  <li>• إذا تأخرت عليك الطلبية المرجو التواصل معنا في أقرب وقت</li>
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">تأكيد المقاسات</h4>
                <ul className="space-y-1">
                  <li>• نعمل أقصى قدر على تأكيد المقاسات</li>
                  <li>• لذا المرجو تأكيد المقاسات معنا لضمان وصولكم بالمقاس المناسب</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">الإرجاع والاستبدال</h4>
                <ul className="space-y-1">
                  <li>• إذا وجدت أي مشكلة في طلبتك خطأ في المقاس أو مشكلة في حالة المنتج يجب عليك التواصل معنا قبل 24 ساعة لتغيير الطلبية</li>
                  <li>• لا نتحمل مسؤولية تأخركم</li>
                  <li>• إذا كان المنتج معيب أو لم يناسبك لقياس خاطئ، يجب عليك دفع ثمن التوصيل لاستبدال الطلبية</li>
                </ul>
              </div>
            </div>

            {/* English Version */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pricing & Payment</h4>
                <ul className="space-y-1">
                  <li>• The prices of the products include delivery</li>
                  <li>• Payment is upon receipt</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                <ul className="space-y-1">
                  <li>• Delivery is done upon request within 24-72 hours</li>
                  <li>• If your order is delayed, please contact us as soon as possible</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Size Confirmation</h4>
                <ul className="space-y-1">
                  <li>• We do our best to confirm the sizes</li>
                  <li>• Please confirm the sizes with us to ensure your order arrives with the appropriate size</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Returns & Exchanges</h4>
                <ul className="space-y-1">
                  <li>• If you find any problem with your order regarding size or a problem with the product, you must contact us within 24 hours to change the order</li>
                  <li>• We do not bear responsibility for delays</li>
                  <li>• If the item is defective or does not fit properly due to incorrect sizing, you must pay the delivery cost to exchange the order</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
