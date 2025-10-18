'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  images: Array<{ url: string; alt: string }>;
  farmerId: {
    _id: string;
    name: string;
    rating: { average: number; count: number };
    location: { city: string; state: string };
  };
  averageRating: number;
  totalReviews: number;
  organic: boolean;
  availability: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Image
          src={product.images[0]?.url || '/images/placeholder-product.jpg'}
          alt={product.images[0]?.alt || product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {product.organic && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
            Organic
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white text-green-600 px-2 py-1 rounded text-sm font-bold">
          ₹{product.price}/{product.unit}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {renderStars(product.averageRating)}
            <span className="text-sm text-gray-600 ml-1">
              ({product.totalReviews})
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {product.quantity} {product.unit} available
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {product.farmerId.location.city}, {product.farmerId.location.state}
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/marketplace/products/${product._id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
          >
            View Details
          </Link>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.availability !== 'available'}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
