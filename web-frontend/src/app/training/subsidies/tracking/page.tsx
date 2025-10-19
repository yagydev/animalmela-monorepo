'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DownloadIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface SubsidyApplication {
  id: string;
  subsidyId: string;
  subsidyTitle: string;
  amount: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'disbursed';
  submittedDate: string;
  lastUpdated: string;
  documents: {
    name: string;
    status: 'pending' | 'uploaded' | 'verified';
    required: boolean;
  }[];
  progress: number;
  notes: string[];
  nextSteps: string[];
}

const mockApplications: SubsidyApplication[] = [
  {
    id: 'app-1',
    subsidyId: '1',
    subsidyTitle: 'PM-KISAN Scheme',
    amount: '₹6,000 per year',
    status: 'approved',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-02-01',
    documents: [
      { name: 'Aadhaar Card', status: 'verified', required: true },
      { name: 'Land Records', status: 'verified', required: true },
      { name: 'Bank Account Details', status: 'verified', required: true },
      { name: 'Mobile Number Verification', status: 'verified', required: true }
    ],
    progress: 100,
    notes: ['Application approved', 'Payment scheduled for next quarter'],
    nextSteps: ['Wait for payment disbursement', 'Update bank account if needed']
  },
  {
    id: 'app-2',
    subsidyId: '2',
    subsidyTitle: 'Pradhan Mantri Fasal Bima Yojana',
    amount: 'Up to ₹40,000 per hectare',
    status: 'under_review',
    submittedDate: '2024-02-10',
    lastUpdated: '2024-02-15',
    documents: [
      { name: 'Aadhaar Card', status: 'verified', required: true },
      { name: 'Land Records', status: 'uploaded', required: true },
      { name: 'Bank Account Details', status: 'verified', required: true },
      { name: 'Crop Details', status: 'uploaded', required: true },
      { name: 'Insurance Premium Receipt', status: 'pending', required: true }
    ],
    progress: 75,
    notes: ['Application under review', 'Additional documents may be required'],
    nextSteps: ['Upload insurance premium receipt', 'Wait for verification']
  },
  {
    id: 'app-3',
    subsidyId: '3',
    subsidyTitle: 'Soil Health Card Scheme',
    amount: 'Free service',
    status: 'submitted',
    submittedDate: '2024-02-20',
    lastUpdated: '2024-02-20',
    documents: [
      { name: 'Aadhaar Card', status: 'verified', required: true },
      { name: 'Land Ownership Proof', status: 'uploaded', required: true },
      { name: 'Application Form', status: 'uploaded', required: true }
    ],
    progress: 50,
    notes: ['Application submitted successfully'],
    nextSteps: ['Wait for soil testing appointment', 'Prepare for field visit']
  }
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  disbursed: 'bg-purple-100 text-purple-800'
};

const statusLabels = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed'
};

export default function SubsidyTrackingPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = mockApplications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = app.subsidyTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return CheckCircleIcon;
      case 'under_review':
        return ClockIcon;
      case 'rejected':
        return ExclamationTriangleIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Subsidy Applications</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track the status of your government scheme applications and manage your documents.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application) => {
            const StatusIcon = getStatusIcon(application.status);
            return (
              <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{application.subsidyTitle}</h3>
                    <div className="flex items-center text-green-600 mb-2">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">{application.amount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status]}`}>
                      {statusLabels[application.status]}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Application Progress</span>
                    <span>{application.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${application.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="flex items-center mb-4">
                  <StatusIcon className="h-5 w-5 text-green-600 mr-2" />
                  <div className="text-sm text-gray-600">
                    <span>Last updated: {formatDate(application.lastUpdated)}</span>
                    <span className="mx-2">•</span>
                    <span>Submitted: {formatDate(application.submittedDate)}</span>
                  </div>
                </div>

                {/* Documents Status */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Document Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {application.documents.map((doc, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          doc.status === 'verified' ? 'bg-green-500' :
                          doc.status === 'uploaded' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <span className={`${
                          doc.status === 'verified' ? 'text-green-700' :
                          doc.status === 'uploaded' ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {doc.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {application.notes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Updates</h4>
                    <ul className="space-y-1">
                      {application.notes.map((note, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {application.nextSteps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {application.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <ArrowRightIcon className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download Documents
                    </button>
                    <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <InformationCircleIcon className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                  <Link
                    href={`/training/subsidies/${application.subsidyId}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    View Scheme Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-16">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or start a new application.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/training/subsidies"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Browse Schemes
              </Link>
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSearchTerm('');
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Applications?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team can help you understand application requirements, upload documents, and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Application Help
              </Link>
              <Link
                href="/training/subsidies"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Apply for New Scheme
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{mockApplications.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {mockApplications.filter(app => app.status === 'approved' || app.status === 'disbursed').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {mockApplications.filter(app => app.status === 'under_review').length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {mockApplications.filter(app => app.status === 'disbursed').length}
            </div>
            <div className="text-sm text-gray-600">Disbursed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
