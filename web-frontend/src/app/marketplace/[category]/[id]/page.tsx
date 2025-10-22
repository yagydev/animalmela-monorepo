'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon,
  UserIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface Listing {
  _id: string;
  name: string;
  description: string;
  category: 'equipment' | 'livestock' | 'product';
  condition: 'new' | 'used';
  price: number;
  images: string[];
  location: string;
  sellerId: string;
  sellerName?: string;
  sellerPhone?: string;
  createdAt: string;
  featured: boolean;
  tags: string[];
  quantity?: number;
  unit?: string;
  specifications?: Record<string, any>;
}

interface Seller {
  _id: string;
  name: string;
  phone: string;
  location: string;
  rating: number;
  profileImage?: string;
}

interface ListingData {
  listing: Listing & { sellerId: Seller };
  relatedListings: Listing[];
}

const categoryInfo = {
  equipment: {
    name: 'Agricultural Equipment',
    icon: '🚜',
    color: 'blue'
  },
  livestock: {
    name: 'Livestock & Cattle',
    icon: '🐄',
    color: 'green'
  },
  product: {
    name: 'Agricultural Produce',
    icon: '🌾',
    color: 'yellow'
  }
};

export default function ListingDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const id = params.id as string;
  
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch listing details
  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/marketplace/${category}/${id}`);
      const result = await response.json();

      if (result.success) {
        setListingData(result.data);
      } else {
        setError('Listing not found');
      }
    } catch (err) {
      setError('Failed to fetch listing');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [category, id]);

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePreviousImage = () => {
    if (listingData?.listing.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listingData.listing.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (listingData?.listing.images) {
      setCurrentImageIndex((prev) => 
        prev === listingData.listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listingData?.listing.name,
          text: listingData?.listing.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const handleContactSeller = () => {
    if (listingData?.listing.sellerPhone) {
      window.open(`tel:${listingData.listing.sellerPhone}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The listing you\'re looking for doesn\'t exist.'}</p>
          <Link
            href="/marketplace"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const { listing, relatedListings } = listingData;
  const seller = listing.sellerId as Seller;
  const categoryData = categoryInfo[listing.category];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/marketplace" className="text-green-600 hover:text-green-700">
              Marketplace
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href={`/marketplace/${category}`} 
              className="text-green-600 hover:text-green-700"
            >
              {categoryData.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{listing.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={listing.images[currentImageIndex] || '/images/placeholder.jpg'}
                alt={listing.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg"
                  >
                    <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                  </button>
                </>
              )}

              {listing.featured && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {listing.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${categoryData.color}-100 text-${categoryData.color}-800`}>
                  <span className="mr-1">{categoryData.icon}</span>
                  {categoryData.name}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full ${
                      isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <HeartIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600"
                  >
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  listing.condition === 'new' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {listing.condition.toUpperCase()}
                </span>
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {listing.location}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="text-4xl font-bold text-green-600 mb-6">
                ₹{listing.price.toLocaleString('en-IN')}
                {listing.quantity && listing.unit && (
                  <span className="text-lg text-gray-600 font-normal">
                    / {listing.quantity} {listing.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {listing.specifications && Object.keys(listing.specifications).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(listing.specifications).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-sm text-gray-900">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* Seller Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{seller.name}</h4>
                  <p className="text-sm text-gray-600">{seller.location}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-600">Rating: </span>
                    <div className="flex items-center ml-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(seller.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({seller.rating})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleContactSeller}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Contact Seller
              </button>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings && relatedListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More from this Seller</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedListings.map((relatedListing) => (
                <Link
                  key={relatedListing._id}
                  href={`/marketplace/${relatedListing.category}/${relatedListing._id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={relatedListing.images[0] || '/images/placeholder.jpg'}
                      alt={relatedListing.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                      {relatedListing.condition.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedListing.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {relatedListing.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        ₹{relatedListing.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {relatedListing.location}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
