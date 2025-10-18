'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { 
  PencilIcon,
  UserCircleIcon,
  CameraIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  userType: 'pet_owner' | 'service_provider';
  verified: boolean;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
      } else {
        setError('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('Failed to fetch profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (data: { name: string; phone: string }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setProfile(responseData.user);
          setError(null);
        } else {
          throw new Error(responseData.error || 'Failed to update profile');
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      throw error;
    }
  };


  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(prev => prev ? { ...prev, avatarUrl: data.avatarUrl } : null);
        } else {
          setError(data.error || 'Failed to upload avatar');
        }
      } else {
        setError('Failed to upload avatar');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError('Failed to upload avatar');
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 py-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircleIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                  />
                </label>
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                  {profile?.verified ? (
                    <ShieldCheckIcon className="h-6 w-6 text-green-500" title="Verified Account" />
                  ) : (
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" title="Unverified Account" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    <span>{profile?.email}</span>
                  </div>
                  
                  {profile?.phone && (
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>Member since {new Date(profile?.createdAt || '').toLocaleDateString()}</span>
                  </div>
                </div>

                {/* User Type Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    profile?.userType === 'service_provider' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {profile?.userType === 'service_provider' ? 'Service Provider' : 'Pet Owner'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">4.8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">💬</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Booked grooming service for Max</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Received a new review</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Updated profile information</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Edit Modal */}
        {profile && (
          <ProfileEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={{
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              userType: profile.userType,
            }}
            onSave={handleSaveProfile}
          />
        )}
      </div>
    </div>
  );
}
