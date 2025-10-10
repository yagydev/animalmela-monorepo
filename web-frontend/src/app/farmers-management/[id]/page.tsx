'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function FarmerDetailPage() {
  const params = useParams();
  const farmerId = params.id as string;
  
  // Mock data for testing
  const mockFarmers = [
    {
      _id: '68e17b5f583d548683a7262b',
      name: 'dfds',
      email: 'yagydev@gmail.com',
      mobile: '9560604508',
      location: {
        state: 'sdfsd',
        district: 'mathura',
        pincode: '281001',
        village: 'pura'
      },
      products: ['sdfsdf'],
      images: ['https://images.unsplash.com/photo-fcypfyraf?w=800&h=600&fit=crop'],
      createdAt: '2025-10-04T19:54:07.649Z',
      fullAddress: 'pura, mathura, sdfsd - 281001',
      rating: {
        average: 0,
        count: 0
      },
      isActive: true
    },
    {
      _id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      mobile: '9876543210',
      location: {
        state: 'Punjab',
        district: 'Ludhiana',
        pincode: '141001',
        village: 'Model Town'
      },
      products: ['Wheat', 'Rice', 'Corn', 'Mustard'],
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
      ],
      createdAt: '2023-01-15',
      bio: 'Experienced farmer with 15+ years in organic farming. Specializes in sustainable agriculture practices and high-quality crop production.',
      rating: {
        average: 4.5,
        count: 12
      },
      verified: true,
      memberSince: '2023-01-15',
      specialties: ['Organic Farming', 'Sustainable Agriculture', 'Crop Rotation'],
      certifications: ['Organic Certification', 'Good Agricultural Practices', 'ISO 22000'],
      socialLinks: {
        whatsapp: '9876543210',
        facebook: 'rajesh.farmer'
      }
    }
  ];
  
  const farmer = mockFarmers.find(f => f._id === farmerId);

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Farmer Not Found</h2>
          <p className="text-gray-600 mb-4">Farmer ID: {farmerId}</p>
          <Link
            href="/farmers-management"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Farmers Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/farmers-management"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Farmers Management
              </Link>
              <div className="h-6 w-px bg-gray-300 mr-4"></div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">🌾</span>
                <h1 className="text-2xl font-bold text-gray-900">{farmer.name}</h1>
                {(farmer.verified || farmer.isActive) && (
                  <span className="ml-2 text-green-600" title="Verified Farmer">✓</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Farmer Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                {farmer.images && farmer.images.length > 0 ? (
                  <img
                    src={farmer.images[0]}
                    alt={farmer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="h-24 w-24 text-green-600" />
                )}
              </div>
            </div>

            {/* Farmer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Farmer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg text-gray-900">{farmer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{farmer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                    <p className="text-gray-900">{farmer.mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-gray-900">{farmer.memberSince ? new Date(farmer.memberSince).toLocaleDateString() : farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">State</label>
                    <p className="text-gray-900">{farmer.location.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">District</label>
                    <p className="text-gray-900">{farmer.location.district}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Village</label>
                    <p className="text-gray-900">{farmer.location.village}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pincode</label>
                    <p className="text-gray-900">{farmer.location.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {(farmer.bio || farmer.fullAddress) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                {farmer.bio && <p className="text-gray-600 leading-relaxed">{farmer.bio}</p>}
                {farmer.fullAddress && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Full Address</label>
                    <p className="text-gray-900">{farmer.fullAddress}</p>
                  </div>
                )}
              </div>
            )}

            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
              <div className="flex flex-wrap gap-2">
                {farmer.products && farmer.products.length > 0 ? (
                  farmer.products.map((product: string, index: number) => (
                    <span
                      key={index}
                      className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full"
                    >
                      {product}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No products listed</p>
                )}
              </div>
            </div>

            {/* Specialties */}
            {farmer.specialties && farmer.specialties.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {farmer.specialties.map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {farmer.certifications && farmer.certifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
                <div className="space-y-3">
                  {farmer.certifications.map((certification: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-green-600 mr-3">✓</span>
                      <span className="text-gray-900">{certification}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{farmer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile</label>
                  <p className="text-gray-900">{farmer.mobile}</p>
                </div>
                {farmer.socialLinks?.whatsapp && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                    <p className="text-gray-900">{farmer.socialLinks.whatsapp}</p>
                  </div>
                )}
                {farmer.socialLinks?.facebook && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Facebook</label>
                    <p className="text-gray-900">{farmer.socialLinks.facebook}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Rating & Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating & Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {farmer.rating?.average || 0}/5.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Reviews</span>
                    <span className="text-sm text-gray-900">{farmer.rating?.count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Products</span>
                    <span className="text-sm text-gray-900">{farmer.products?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm text-gray-900">
                      {farmer.memberSince ? new Date(farmer.memberSince).toLocaleDateString() : farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      farmer.verified || farmer.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {farmer.verified || farmer.isActive ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Certifications</span>
                    <span className="text-sm text-gray-900">
                      {farmer.certifications?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Specialties</span>
                    <span className="text-sm text-gray-900">
                      {farmer.specialties?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}