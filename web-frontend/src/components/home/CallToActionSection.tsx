'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  StarIcon,
  UserGroupIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export function CallToActionSection() {
  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Implement newsletter signup
      console.log('Newsletter signup:', email);
      setEmail('');
    }
  };

  const benefits = [
    {
      icon: CheckCircleIcon,
      text: 'Verified pet sitters'
    },
    {
      icon: StarIcon,
      text: '4.9/5 average rating'
    },
    {
      icon: UserGroupIcon,
      text: '10,000+ happy pets'
    },
    {
      icon: HeartIcon,
      text: '24/7 customer support'
    }
  ];

  return (
    <section className="py-20 bg-primary-600 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/cta-pattern.svg')] bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of pet owners who trust AnimalMela for their pet care needs. 
            Sign up today and find the perfect care for your furry friend.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <benefit.icon className="h-8 w-8 mx-auto mb-2 text-primary-200" />
              <p className="text-sm text-primary-100">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            Learn More
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Stay Updated with Pet Care Tips
          </h3>
          <p className="text-primary-100 mb-6 text-center">
            Get the latest pet care advice, service updates, and exclusive offers delivered to your inbox.
          </p>
          
          <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 border-0"
              required
            />
            <button 
              type="submit"
              className="bg-primary-500 hover:bg-primary-400 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-primary-200 text-sm mt-4 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-primary-200 text-sm mb-4">
            Trusted by pet owners nationwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Placeholder for trust badges/logos */}
            <div className="text-primary-200 text-sm">BBB A+ Rating</div>
            <div className="text-primary-200 text-sm">Insured & Bonded</div>
            <div className="text-primary-200 text-sm">Background Checked</div>
          </div>
        </div>
      </div>
    </section>
  );
}
