'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionPage() {
  const products = [    {
      id: 'awrah-cover',
      name: 'Awrah Cover',
      description: 'Premium Islamic modest wear combining traditional values with modern streetwear aesthetics',
      price: 220,
      originalPrice: 250,
      image: '/pc4.jpg',
      slug: '/awrah-cover',
      available: true,
    },{
      id: 'toji-sweatpants',
      name: 'Toji Sweatpants',
      description: 'Premium streetwear comfort meets Islamic modesty. Ultimate sweatpants designed for brothers who value both style and faith',      price: 250,
      originalPrice: 320,
      image: '/34.jpeg',
      slug: '/toji-sweatpants',
      available: true,
      comingSoon: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Section */}      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Our Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium Moroccan streetwear & Islamic modest wear crafted by brothers, for brothers
          </p>
        </div>        {/* Products Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-6 mt-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-xl"
              >
              {/* Product Image */}
              <Link href={product.slug}>
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.comingSoon && (
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                      COMING SOON
                    </div>
                  )}
                  {product.originalPrice > product.price && !product.comingSoon && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SALE
                    </div>
                  )}
                </div>
              </Link>              {/* Product Info */}
              <div className="p-4 bg-white">
                <Link href={product.slug}>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gray-700 transition-colors">
                    {product.name}
                  </h3>
                </Link>                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* CTA Button */}
                {product.available ? (
                  <Link
                    href={product.slug}
                    className="block w-full bg-black text-white text-center py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                  >
                    View Product
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full bg-gray-200 text-gray-500 text-center py-2.5 rounded-lg font-bold text-sm cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}              </div>
            </div>
          ))}
          </div>
        </div>

        {/* More Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">More Premium Pieces Coming</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We're continuously expanding our collection with more exclusive designs. 
              Follow us on Instagram to stay updated on new drops and releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
