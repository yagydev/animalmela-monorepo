'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CameraIcon, MapPinIcon } from '@heroicons/react/24/outline';

export function HeroSection() {
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchLocation);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/hero-pattern.svg')] bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Your Pet's Best Friend
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8">
              Find trusted pet care services in your area. From pet sitting to grooming, 
              we connect you with verified professionals who love pets as much as you do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Find Services
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 text-center hover:shadow-lg transform hover:-translate-y-1"
              >
                Become a Sitter
              </Link>
            </div>
          </div>

          {/* Right side - Search */}
          <div className="relative animate-slide-up">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/20 rounded-full">
                    <CameraIcon className="h-16 w-16 text-primary-200" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Pet Care Near You</h3>
                <p className="text-primary-100 mb-6">Enter your location to get started</p>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex">
                    <div className="relative flex-1">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="Enter your address or city"
                        className="w-full pl-10 pr-4 py-3 rounded-l-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 border-0"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-primary-500 hover:bg-primary-400 px-6 py-3 rounded-r-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary-200">10,000+</div>
                    <div className="text-primary-100">Happy Pets</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary-200">5,000+</div>
                    <div className="text-primary-100">Trusted Sitters</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
