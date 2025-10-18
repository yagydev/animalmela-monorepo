'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function EventRegistrationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    eventId: 'event-1',
    participantType: 'visitor',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    interests: [],
    experience: '',
    expectations: '',
    dietaryRequirements: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const events = [
    {
      _id: 'event-1',
      title: 'Kisaan Mela 2024 - Spring Festival',
      slug: 'kisaan-mela-2024-spring-festival',
      description: 'Join us for the biggest agricultural festival of the year!',
      date: '2024-03-15T00:00:00.000Z',
      endDate: '2024-03-17T00:00:00.000Z',
      location: {
        name: 'Delhi Agricultural Ground',
        address: 'Sector 15, Rohini',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110085'
      },
      image: {
        url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
        alt: 'Kisaan Mela 2024'
      },
      organizer: {
        name: 'Ministry of Agriculture'
      },
      status: 'published',
      featured: true,
      tags: ['agriculture', 'festival', 'spring', 'farmers']
    },
    {
      _id: 'event-2',
      title: 'Organic Farming Workshop',
      slug: 'organic-farming-workshop',
      description: 'Learn sustainable organic farming techniques from experts.',
      date: '2024-04-20T00:00:00.000Z',
      endDate: '2024-04-20T00:00:00.000Z',
      location: {
        name: 'Agricultural Training Center',
        address: 'Plot 45, Industrial Area',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001'
      },
      image: {
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
        alt: 'Organic Farming Workshop'
      },
      organizer: {
        name: 'Pune Agricultural Society'
      },
      status: 'published',
      featured: false,
      tags: ['workshop', 'organic', 'training', 'sustainable']
    }
  ];

  const selectedEvent = events.find(event => event._id === formData.eventId) || events[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/events" className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Back to Events</span>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Registration Successful!</h1>
                  <p className="text-gray-600">Thank you for registering for the event.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully registered for <strong>{selectedEvent.title}</strong>. 
              You will receive a confirmation email shortly with event details and instructions.
            </p>
            <div className="space-y-4">
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                View Other Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/events" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back to Events</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Registration</h1>
                <p className="text-gray-600">Register for agricultural events and workshops</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Event</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.eventId === event._id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, eventId: event._id }))}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={event.image.url}
                        alt={event.image.alt}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="mt-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            {event.location.city}, {event.location.state}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Registration Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Participant Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Type *
                  </label>
                  <select
                    name="participantType"
                    value={formData.participantType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="visitor">Visitor</option>
                    <option value="farmer">Farmer</option>
                    <option value="vendor">Vendor</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I agree to the <a href="/terms" className="text-green-600 hover:text-green-700">Terms and Conditions</a> *
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToMarketing"
                      checked={formData.agreeToMarketing}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I would like to receive updates about future events and agricultural news
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {submitting ? 'Registering...' : 'Register for Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}