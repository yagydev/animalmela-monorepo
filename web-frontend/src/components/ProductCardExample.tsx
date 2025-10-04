'use client';

import React from 'react';
import { ProductCard, useCart, useFavorites } from './ProductCard';

// Example usage of ProductCard component
export function ProductCardExample() {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Sample product data
  const sampleProduct = {
    _id: '1',
    title: 'Fresh Organic Wheat',
    description: 'Premium quality organic wheat grown without pesticides. Perfect for making bread and other baked goods.',
    price: 2500,
    unit: 'quintal',
    quantity: 10,
    category: 'crops',
    images: ['/api/placeholder/300/200?text=Wheat'],
    sellerId: {
      name: 'Rajesh Kumar',
      _id: 'seller1'
    },
    location: {
      state: 'Punjab',
      district: 'Ludhiana'
    },
    rating: 4.5,
    totalRatings: 23,
    negotiable: true,
    minimumOrder: 1
  };

  const handleAddToCart = async (listingId: string, quantity: number = 1) => {
    try {
      await addToCart(listingId, quantity);
      console.log('Added to cart successfully');
    } catch (error: any) {
      console.error('Failed to add to cart:', error.message);
    }
  };

  const handleToggleFavorite = async (listingId: string) => {
    try {
      await toggleFavorite(listingId);
      console.log('Favorite toggled successfully');
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error.message);
    }
  };

  const handleViewDetails = (listingId: string) => {
    console.log('View details for:', listingId);
    // Navigate to product details page
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ProductCard Examples</h1>
      
      <div className="space-y-12">
        {/* Default Variant */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Default Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              listing={sampleProduct}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              isInCart={isInCart(sampleProduct._id)}
              isFavorite={isFavorite(sampleProduct._id)}
              variant="default"
            />
          </div>
        </section>

        {/* Compact Variant */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Compact Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProductCard
              listing={sampleProduct}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isInCart={isInCart(sampleProduct._id)}
              isFavorite={isFavorite(sampleProduct._id)}
              variant="compact"
            />
            <ProductCard
              listing={{
                ...sampleProduct,
                _id: '2',
                title: 'Organic Rice',
                price: 3000,
                images: ['/api/placeholder/300/200?text=Rice']
              }}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isInCart={isInCart('2')}
              isFavorite={isFavorite('2')}
              variant="compact"
            />
          </div>
        </section>

        {/* Detailed Variant */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detailed Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductCard
              listing={sampleProduct}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              isInCart={isInCart(sampleProduct._id)}
              isFavorite={isFavorite(sampleProduct._id)}
              variant="detailed"
            />
          </div>
        </section>

        {/* Without Actions */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Without Actions (Read-only)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              listing={sampleProduct}
              showActions={false}
              variant="default"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// Usage in different contexts
export function ProductGrid({ products, onProductClick }: { products: any[], onProductClick?: (product: any) => void }) {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = async (listingId: string, quantity: number = 1) => {
    try {
      await addToCart(listingId, quantity);
    } catch (error: any) {
      console.error('Failed to add to cart:', error.message);
    }
  };

  const handleToggleFavorite = async (listingId: string) => {
    try {
      await toggleFavorite(listingId);
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error.message);
    }
  };

  const handleViewDetails = (listingId: string) => {
    const product = products.find(p => p._id === listingId);
    if (onProductClick && product) {
      onProductClick(product);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          listing={product}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
          isInCart={isInCart(product._id)}
          isFavorite={isFavorite(product._id)}
          variant="default"
        />
      ))}
    </div>
  );
}

// Compact product list for sidebars or small spaces
export function ProductList({ products }: { products: any[] }) {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = async (listingId: string, quantity: number = 1) => {
    try {
      await addToCart(listingId, quantity);
    } catch (error: any) {
      console.error('Failed to add to cart:', error.message);
    }
  };

  const handleToggleFavorite = async (listingId: string) => {
    try {
      await toggleFavorite(listingId);
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error.message);
    }
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          listing={product}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          isInCart={isInCart(product._id)}
          isFavorite={isFavorite(product._id)}
          variant="compact"
        />
      ))}
    </div>
  );
}
