'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  mobile?: string;
  createdAt?: string;
}

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type ToastState = { type: 'success' | 'error'; message: string } | null;

function SkeletonLine({ w = 'w-full' }: { w?: string }) {
  return <div className={`h-4 bg-gray-200 rounded ${w} animate-pulse`} />;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const [profile, setProfile] = useState<ProfileForm>({
    name: '', email: '', phone: '', location: '', bio: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileToast, setProfileToast] = useState<ToastState>(null);

  const [passwords, setPasswords] = useState<PasswordForm>({
    oldPassword: '', newPassword: '', confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordToast, setPasswordToast] = useState<ToastState>(null);

  useEffect(() => {
    async function fetchUser() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          setUnauthorized(true);
          return;
        }

        const data = await res.json();
        if (data.success) {
          const u: UserData = data.data.user;
          setUser(u);
          setProfile({
            name: u.name ?? '',
            email: u.email ?? '',
            phone: u.mobile ?? '',
            location: '',
            bio: '',
          });
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  function showToast(setter: (t: ToastState) => void, toast: ToastState) {
    setter(toast);
    setTimeout(() => setter(null), 3500);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    setSavingProfile(true);
    try {
      const res = await fetch('/api/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(setProfileToast, { type: 'success', message: 'Profile updated successfully.' });
      } else {
        showToast(setProfileToast, { type: 'error', message: data.message ?? 'Failed to save profile.' });
      }
    } catch {
      showToast(setProfileToast, { type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast(setPasswordToast, { type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      showToast(setPasswordToast, { type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setSavingPassword(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(setPasswordToast, { type: 'success', message: 'Password changed successfully.' });
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(setPasswordToast, { type: 'error', message: data.message ?? 'Failed to change password.' });
      }
    } catch {
      showToast(setPasswordToast, { type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-5 animate-pulse">
            <div className="h-16 w-16 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <SkeletonLine w="w-40" />
              <SkeletonLine w="w-56" />
              <SkeletonLine w="w-24" />
            </div>
          </div>
          {/* Form skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <SkeletonLine w="w-24" />
                <div className="h-9 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Sign in required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Link
            href="/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium capitalize">
              {user?.role ?? 'user'}
            </span>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Edit Profile</h2>

          {profileToast && (
            <div
              className={`mb-4 flex items-center gap-2 p-3 rounded-md text-sm ${
                profileToast.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {profileToast.type === 'success' ? (
                <CheckCircleIcon className="h-4 w-4 shrink-0" />
              ) : (
                <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
              )}
              {profileToast.message}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1.5"><UserIcon className="h-4 w-4" />Full Name</span>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1.5"><EnvelopeIcon className="h-4 w-4" />Email</span>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1.5"><PhoneIcon className="h-4 w-4" />Phone</span>
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1.5"><MapPinIcon className="h-4 w-4" />Location / State</span>
              </label>
              <select
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white"
              >
                <option value="">Select a state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none"
                placeholder="Tell buyers a bit about yourself and your farm..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-md font-medium text-sm transition-colors"
              >
                {savingProfile ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <LockClosedIcon className="h-5 w-5 text-gray-500" />
            Change Password
          </h2>

          {passwordToast && (
            <div
              className={`mb-4 flex items-center gap-2 p-3 rounded-md text-sm ${
                passwordToast.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {passwordToast.type === 'success' ? (
                <CheckCircleIcon className="h-4 w-4 shrink-0" />
              ) : (
                <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
              )}
              {passwordToast.message}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
              <input
                type="password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Repeat new password"
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-md font-medium text-sm transition-colors"
              >
                {savingPassword ? 'Saving…' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Member since</dt>
              <dd className="font-medium text-gray-900">{memberSince}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium text-gray-900 capitalize">{user?.role ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Account status</dt>
              <dd className="font-medium text-green-600">Active</dd>
            </div>
          </dl>
        </div>

      </div>
    </div>
  );
}
