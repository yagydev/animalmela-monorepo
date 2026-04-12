'use client';

import React, { useState } from 'react';
import {
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'mr', label: 'Marathi' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
];

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  savedKey?: string;
  savedSet?: string | null;
}

function Toggle({ checked, onChange, label, description, savedKey, savedSet }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {savedSet === savedKey && (
            <span className="text-xs text-green-600 flex items-center gap-0.5">
              <CheckCircleIcon className="h-3.5 w-3.5" /> Saved
            </span>
          )}
        </div>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          checked ? 'bg-green-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

function DeleteModal({ onClose, onConfirm, deleting }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 shrink-0" />
          <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          This action is <strong>permanent and cannot be undone.</strong> All your data including listings,
          orders, and profile information will be deleted.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Are you absolutely sure you want to delete your account?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {deleting ? 'Deleting…' : 'Yes, Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsClient() {
  // Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketplace: true,
    events: true,
  });
  const [savedNotif, setSavedNotif] = useState<string | null>(null);

  function toggleNotif(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedNotif(key);
    setTimeout(() => setSavedNotif(null), 2000);
  }

  // Language & Region
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState('');
  const [langSaved, setLangSaved] = useState(false);

  function saveLanguage() {
    setLangSaved(true);
    setTimeout(() => setLangSaved(false), 2000);
  }

  // Privacy
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    allowMessages: true,
    showContact: false,
  });
  const [savedPrivacy, setSavedPrivacy] = useState<string | null>(null);

  function togglePrivacy(key: keyof typeof privacy) {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedPrivacy(key);
    setTimeout(() => setSavedPrivacy(null), 2000);
  }

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDeleteAccount() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setDeleting(true);
    setDeleteError(null);
    try {
      if (token) {
        await fetch('/api/me', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('token');
      }
      // Redirect after deletion
      window.location.href = '/';
    } catch {
      setDeleteError('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          deleting={deleting}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and privacy.</p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BellIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <Toggle
              label="Email notifications"
              description="Receive updates and alerts via email"
              checked={notifications.email}
              onChange={() => toggleNotif('email')}
              savedKey="email"
              savedSet={savedNotif}
            />
            <Toggle
              label="SMS alerts"
              description="Get important alerts via SMS"
              checked={notifications.sms}
              onChange={() => toggleNotif('sms')}
              savedKey="sms"
              savedSet={savedNotif}
            />
            <Toggle
              label="Marketplace updates"
              description="New listings, price changes, and restocks"
              checked={notifications.marketplace}
              onChange={() => toggleNotif('marketplace')}
              savedKey="marketplace"
              savedSet={savedNotif}
            />
            <Toggle
              label="Event reminders"
              description="Reminders for upcoming fairs and events"
              checked={notifications.events}
              onChange={() => toggleNotif('events')}
              savedKey="events"
              savedSet={savedNotif}
            />
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <GlobeAltIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Language &amp; Region</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region / State</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white"
              >
                <option value="">Select a state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={saveLanguage}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Save
              </button>
              {langSaved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4" /> Saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <Toggle
              label="Show profile publicly"
              description="Allow other users to view your profile page"
              checked={privacy.publicProfile}
              onChange={() => togglePrivacy('publicProfile')}
              savedKey="publicProfile"
              savedSet={savedPrivacy}
            />
            <Toggle
              label="Allow messages from buyers"
              description="Buyers can send you direct messages"
              checked={privacy.allowMessages}
              onChange={() => togglePrivacy('allowMessages')}
              savedKey="allowMessages"
              savedSet={savedPrivacy}
            />
            <Toggle
              label="Show contact number"
              description="Display your phone number on your public profile"
              checked={privacy.showContact}
              onChange={() => togglePrivacy('showContact')}
              savedKey="showContact"
              savedSet={savedPrivacy}
            />
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Linked Accounts</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-500">G</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Google</p>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled
                title="Coming soon"
              >
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">W</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled
                title="Coming soon"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account all your data is permanently removed and cannot be recovered.
          </p>
          {deleteError && (
            <p className="text-sm text-red-600 mb-3">{deleteError}</p>
          )}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}
