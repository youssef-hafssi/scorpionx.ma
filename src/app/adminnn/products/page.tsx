'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Save, RefreshCw, Edit2, X, Check, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image: string;
  created_at: string;
  updated_at: string;
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Predefined images available in public folder
  const availableImages = [
    '/pant1.png', '/pant2.png', '/pant3.png', '/pant4.png',
    '/zipup1.png', '/zipup2.png', '/zipup3.png', '/zipup4.png',
    '/pc1.jpg', '/pc2.jpg', '/pc3.jpg', '/pc4.jpg',
    '/32.jpeg', '/34.jpeg', '/36.jpeg', '/37.jpeg',
    '/sweat.jpg', '/hero.jpg', '/logo.png'
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Start editing a product
  const startEditing = (product: Product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      image: product.image,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  // Save product changes
  const saveProduct = async (productId: string) => {
    try {
      setSaving(productId);

      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          ...editForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, ...editForm } as Product
          : p
      ));

      setEditingProduct(null);
      setEditForm({});
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage product details and images</p>
        </div>
        <Button onClick={fetchProducts} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Products Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.image).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Missing Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => !p.image).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-gray-500">
              No products found. Please check your database setup.
            </CardContent>
          </Card>
        ) : (
          products.map((product) => {
            const isEditing = editingProduct === product.id;
            const isSaving = saving === product.id;

            return (
              <Card key={product.id} className={isEditing ? 'ring-2 ring-blue-500' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg truncate flex-1">
                      {isEditing ? (
                        <Input
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="text-lg font-semibold"
                        />
                      ) : (
                        product.name
                      )}
                    </CardTitle>
                    <div className="flex gap-1 ml-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEditing}
                            disabled={isSaving}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveProduct(product.id)}
                            disabled={isSaving}
                            className="text-green-600 hover:text-green-700"
                          >
                            {isSaving ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Product Image */}
                  <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    {(isEditing ? editForm.image : product.image) ? (
                      <Image
                        src={isEditing ? editForm.image || '' : product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/product-image.svg';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ImageIcon className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  {/* Image Selection (when editing) */}
                  {isEditing && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Image
                      </label>
                      <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                        {availableImages.map((img) => (
                          <button
                            key={img}
                            onClick={() => setEditForm({ ...editForm, image: img })}
                            className={`relative w-full aspect-square rounded border-2 overflow-hidden transition-all ${
                              editForm.image === img
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <Image
                              src={img}
                              alt={img}
                              fill
                              className="object-contain"
                            />
                          </button>
                        ))}
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Or enter custom URL:
                        </label>
                        <Input
                          value={editForm.image || ''}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          placeholder="/custom-image.png"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">Price:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-24 text-sm"
                      />
                    ) : (
                      <Badge variant="default">{product.price} DH</Badge>
                    )}
                  </div>

                  {/* Product ID */}
                  <div className="text-xs text-gray-400 mt-4">
                    ID: {product.id}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
