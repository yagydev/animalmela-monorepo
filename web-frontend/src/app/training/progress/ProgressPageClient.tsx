'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  ArrowRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface CourseProgress {
  id: string;
  title: string;
  category: string;
  progressPercent: number;
  hasCertificate: boolean;
  hoursSpent: number;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  iconBg: string;
}

const enrolledCourses: CourseProgress[] = [
  {
    id: '1',
    title: 'Modern Drip Irrigation',
    category: 'Crop Management',
    progressPercent: 75,
    hasCertificate: false,
    hoursSpent: 6,
  },
  {
    id: '2',
    title: 'Organic Farming Certification',
    category: 'Organic Farming',
    progressPercent: 40,
    hasCertificate: false,
    hoursSpent: 8,
  },
  {
    id: '3',
    title: 'Drone Technology',
    category: 'Technology',
    progressPercent: 100,
    hasCertificate: true,
    hoursSpent: 7,
  },
];

const badges: Badge[] = [
  {
    id: '1',
    title: 'Early Learner',
    description: 'Enrolled within the first week of a workshop opening',
    colorClass: 'text-yellow-700',
    iconBg: 'bg-yellow-100 border-yellow-300',
  },
  {
    id: '2',
    title: 'Tech Pioneer',
    description: 'Completed a technology-focused workshop',
    colorClass: 'text-blue-700',
    iconBg: 'bg-blue-100 border-blue-300',
  },
  {
    id: '3',
    title: 'Certified Farmer',
    description: 'Earned a certificate of completion',
    colorClass: 'text-green-700',
    iconBg: 'bg-green-100 border-green-300',
  },
];

// Simulate a "not logged in" state that can be toggled for demo purposes
export default function ProgressPageClient() {
  const [isLoggedIn] = useState(true); // set to false to see login prompt

  const completedCount = enrolledCourses.filter((c) => c.progressPercent === 100).length;
  const certificatesCount = enrolledCourses.filter((c) => c.hasCertificate).length;
  const totalHours = enrolledCourses.reduce((sum, c) => sum + c.hoursSpent, 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10 max-w-md w-full text-center">
          <UserCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Progress</h2>
          <p className="text-gray-600 mb-6">
            Log in to see your enrolled courses, progress, and earned certificates.
          </p>
          <Link
            href="/auth/login"
            className="block w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mb-3"
          >
            Log In
          </Link>
          <Link
            href="/auth/register"
            className="block w-full py-2.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
          >
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">My Learning Progress</h1>
          <p className="text-green-100 text-lg">Track your agricultural training journey and collect achievements.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <BookOpenIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</div>
            <div className="text-sm text-gray-500 mt-1">Courses Enrolled</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <CheckCircleIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{completedCount}</div>
            <div className="text-sm text-gray-500 mt-1">Completed</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <AcademicCapIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{certificatesCount}</div>
            <div className="text-sm text-gray-500 mt-1">Certificates Earned</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <ClockIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">{totalHours}h</div>
            <div className="text-sm text-gray-500 mt-1">Learning Hours</div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Enrolled Courses</h2>
          <div className="space-y-6">
            {enrolledCourses.map((course) => (
              <div key={course.id}>
                <div className="flex items-start justify-between mb-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className="text-xs text-gray-500">{course.category}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {course.hasCertificate && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <AcademicCapIcon className="h-3.5 w-3.5" />
                        Certificate Available
                      </span>
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        course.progressPercent === 100 ? 'text-green-600' : 'text-gray-700'
                      }`}
                    >
                      {course.progressPercent}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      course.progressPercent === 100 ? 'bg-green-500' : 'bg-green-400'
                    }`}
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{course.hoursSpent}h spent</span>
                  {course.progressPercent === 100 ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">In progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements / Badges */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrophyIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-4 p-4 rounded-xl border ${badge.iconBg}`}
              >
                <div className="shrink-0">
                  <TrophyIcon className={`h-8 w-8 ${badge.colorClass}`} />
                </div>
                <div>
                  <p className={`font-semibold ${badge.colorClass}`}>{badge.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse CTA */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Keep Learning</h2>
          <p className="text-green-100 mb-6 max-w-xl mx-auto">
            Discover more workshops to expand your farming knowledge and earn additional certificates.
          </p>
          <Link
            href="/training/workshops"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse More Workshops
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
