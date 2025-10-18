'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Scheme {
  _id: string;
  name: string;
  description: string;
  category: string;
  benefits: string[];
  eligibility: {
    age?: { min: number; max: number };
    income?: { max: number };
    state?: string[];
    category?: string[];
  };
  applicationProcess: string[];
  documents: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  validityPeriod: {
    start: string;
    end: string;
  };
  status: string;
  createdAt: string;
}

interface SchemesResponse {
  success: boolean;
  schemes: Scheme[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSchemes: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function GovernmentSchemesPage() {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    state: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalSchemes: 0,
    hasNext: false,
    hasPrev: false
  });

  const categories = [
    'agriculture',
    'livestock',
    'irrigation',
    'seeds',
    'equipment',
    'subsidy',
    'loan',
    'insurance'
  ];

  const states = [
    'Maharashtra', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana',
    'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'West Bengal', 'Tamil Nadu',
    'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Odisha'
  ];

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.state) params.append('state', filters.state);
      params.append('page', filters.page.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/marketplace/schemes?${params}`);
      const data: SchemesResponse = await response.json();

      if (data.success) {
        setSchemes(data.schemes);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch schemes');
      }
    } catch (err) {
      setError('Error fetching schemes');
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      state: '',
      page: 1
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      agriculture: '🌾',
      livestock: '🐄',
      irrigation: '💧',
      seeds: '🌱',
      equipment: '🚜',
      subsidy: '💰',
      loan: '🏦',
      insurance: '🛡️'
    };
    return icons[category] || '📋';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading government schemes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('govt_schemes')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('discover_schemes')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('filter_schemes')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('category')}
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">{t('all_categories')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {t(cat)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('state')}
              </label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">{t('all_states')}</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {t('clear_filters')}
              </button>
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-600">
                {pagination.totalSchemes} {t('schemes_found')}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Schemes Grid */}
        {schemes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('no_schemes_found')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('no_schemes_description')}
            </p>
            <button
              onClick={clearFilters}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {t('view_all_schemes')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {schemes.map((scheme) => (
              <div key={scheme._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getCategoryIcon(scheme.category)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {scheme.name}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
                          {t(scheme.category)}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scheme.status)}`}>
                      {t(scheme.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {scheme.description}
                  </p>

                  {scheme.benefits && scheme.benefits.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {t('key_benefits')}:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {scheme.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {benefit}
                          </li>
                        ))}
                        {scheme.benefits.length > 3 && (
                          <li className="text-gray-500 text-xs">
                            +{scheme.benefits.length - 3} {t('more_benefits')}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {scheme.eligibility && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {t('eligibility')}:
                      </h4>
                      <div className="text-sm text-gray-600">
                        {scheme.eligibility.age && (
                          <p>{t('age_range')}: {scheme.eligibility.age.min}-{scheme.eligibility.age.max} {t('years')}</p>
                        )}
                        {scheme.eligibility.income && (
                          <p>{t('max_income')}: ₹{scheme.eligibility.income.max.toLocaleString()}</p>
                        )}
                        {scheme.eligibility.state && scheme.eligibility.state.length > 0 && (
                          <p>{t('states')}: {scheme.eligibility.state.slice(0, 2).join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      {t('valid_until')}: {new Date(scheme.validityPeriod.end).toLocaleDateString()}
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      {t('view_details')} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('previous')}
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      page === pagination.currentPage
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('next')}
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('need_help_schemes')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('schemes_help_description')}
          </p>
          <a
            href="https://wa.me/919876543210?text=Hello%2C%20I%20need%20help%20with%20government%20schemes%20on%20Kisaanmela"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"></path>
            </svg>
            {t('whatsapp_chat')}
          </a>
        </div>
      </div>
    </div>
  );
}
