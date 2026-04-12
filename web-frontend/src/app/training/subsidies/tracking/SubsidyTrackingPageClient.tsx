'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  PhoneIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface TimelineStep {
  label: string;
  detail: string;
  status: 'done' | 'inprogress' | 'pending';
}

interface MockApplicationResult {
  schemeName: string;
  appliedDate: string;
  estimatedCompletion: string;
  timeline: TimelineStep[];
}

// Mock application data keyed by "applicationId|mobile"
const MOCK_DATA: Record<string, MockApplicationResult> = {
  'APP123456|9876543210': {
    schemeName: 'PM-KISAN Scheme',
    appliedDate: '2026-01-15',
    estimatedCompletion: '2026-04-30',
    timeline: [
      { label: 'Application Submitted', detail: 'Your application was received on 15 Jan 2026.', status: 'done' },
      { label: 'Document Verification', detail: 'Officials are verifying your Aadhaar, land records, and bank details.', status: 'inprogress' },
      { label: 'Bank Account Verification', detail: 'Your bank account will be validated for direct benefit transfer.', status: 'pending' },
      { label: 'Disbursement', detail: 'Approved amount will be transferred directly to your account.', status: 'pending' },
    ],
  },
  'APP789012|8765432109': {
    schemeName: 'Pradhan Mantri Fasal Bima Yojana',
    appliedDate: '2026-02-10',
    estimatedCompletion: '2026-05-15',
    timeline: [
      { label: 'Application Submitted', detail: 'Your crop insurance application was received on 10 Feb 2026.', status: 'done' },
      { label: 'Document Verification', detail: 'Insurance documents and crop details have been verified.', status: 'done' },
      { label: 'Bank Account Verification', detail: 'Your bank account is being verified for claim settlement.', status: 'inprogress' },
      { label: 'Disbursement', detail: 'Claim amount will be disbursed upon final approval.', status: 'pending' },
    ],
  },
};

const DEFAULT_RESULT: MockApplicationResult = {
  schemeName: 'Kisan Credit Card Scheme',
  appliedDate: '2026-03-01',
  estimatedCompletion: '2026-06-01',
  timeline: [
    { label: 'Application Submitted', detail: 'Your application was received successfully.', status: 'done' },
    { label: 'Document Verification', detail: 'Officials are verifying your submitted documents.', status: 'inprogress' },
    { label: 'Bank Account Verification', detail: 'Your bank account will be validated before approval.', status: 'pending' },
    { label: 'Disbursement', detail: 'Approved credit limit will be activated on your Kisan Credit Card.', status: 'pending' },
  ],
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function StepIcon({ status }: { status: TimelineStep['status'] }) {
  if (status === 'done')
    return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
  if (status === 'inprogress')
    return <ClockIcon className="h-6 w-6 text-yellow-500" />;
  return <ClockIcon className="h-6 w-6 text-gray-300" />;
}

function stepStatusLabel(status: TimelineStep['status']) {
  if (status === 'done') return 'Completed';
  if (status === 'inprogress') return 'In Progress';
  return 'Pending';
}

function stepStatusBadge(status: TimelineStep['status']) {
  if (status === 'done')
    return 'bg-green-100 text-green-700';
  if (status === 'inprogress')
    return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-500';
}

export default function SubsidyTrackingPageClient() {
  const [applicationId, setApplicationId] = useState('');
  const [mobile, setMobile] = useState('');
  const [result, setResult] = useState<MockApplicationResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!applicationId.trim() || !mobile.trim()) {
      setError('Please enter both your Application ID and Mobile Number.');
      return;
    }
    const key = `${applicationId.trim()}|${mobile.trim()}`;
    const found = MOCK_DATA[key] ?? DEFAULT_RESULT;
    setResult(found);
    setSearched(true);
  }

  function handleReset() {
    setApplicationId('');
    setMobile('');
    setResult(null);
    setSearched(false);
    setError('');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">Track Your Application</h1>
          <p className="text-green-100 text-lg">
            Enter your Application ID and registered mobile number to check the real-time status of your subsidy
            application.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Lookup Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-green-600" />
            Application Lookup
          </h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DocumentTextIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    placeholder="e.g. APP123456"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Track Application
              </button>
              {searched && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  New Search
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Result */}
        {result && (
          <>
            {/* Application Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Scheme</span>
                  <span className="font-semibold text-gray-900">{result.schemeName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Applied On</span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <CalendarDaysIcon className="h-4 w-4 text-green-500" />
                    {formatDate(result.appliedDate)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Est. Completion</span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <CalendarDaysIcon className="h-4 w-4 text-green-500" />
                    {formatDate(result.estimatedCompletion)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h2>
              <ol className="relative ml-3">
                {result.timeline.map((step, index) => {
                  const isLast = index === result.timeline.length - 1;
                  return (
                    <li key={index} className={`relative flex gap-4 ${!isLast ? 'pb-8' : ''}`}>
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                            step.status === 'done' ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div className="shrink-0 z-10">
                        <StepIcon status={step.status} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`font-semibold text-sm ${
                              step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                            }`}
                          >
                            {step.label}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${stepStatusBadge(
                              step.status
                            )}`}
                          >
                            {stepStatusLabel(step.status)}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </>
        )}

        {/* Help / CTA */}
        <div className="bg-green-50 rounded-xl border border-green-100 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Need Help with Your Application?</h2>
          <p className="text-gray-600 text-sm mb-5 max-w-xl mx-auto">
            Our support team can assist with document uploads, application queries, and status updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Get Help
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/training/subsidies"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
            >
              Browse All Schemes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
