'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    farmers: [
      { name: 'Farmers Market', path: '/farmers-market' },
      { name: 'Training Programs', path: '/training' },
      { name: 'Subsidy Guide', path: '/training/subsidies' },
      { name: 'Weather Updates', path: '/weather' }
    ],
    vendors: [
      { name: 'Book Stall', path: '/vendors/book-stall' },
      { name: 'Upload Catalog', path: '/vendors/catalog' },
      { name: 'Analytics Dashboard', path: '/vendor/dashboard' },
      { name: 'Partner Program', path: '/vendors/partner' }
    ],
    company: [
      { name: 'About Kisaan Mela', path: '/about' },
      { name: 'Our Mission', path: '/about#mission' },
      { name: 'Team', path: '/about#team' },
      { name: 'Careers', path: '/careers' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Support', path: '/contact' },
      { name: 'WhatsApp Support', path: 'https://wa.me/919876543210' },
      { name: 'Report Issue', path: '/report' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Refund Policy', path: '/refund' }
    ],
    resources: [
      { name: 'Press Kit', path: '/press' },
      { name: 'Brochure Download', path: '/brochure' },
      { name: 'API Documentation', path: '/api-docs' },
      { name: 'Developer Resources', path: '/developers' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/kisaanmela', icon: '📘' },
    { name: 'Twitter', url: 'https://twitter.com/kisaanmela', icon: '🐦' },
    { name: 'Instagram', url: 'https://instagram.com/kisaanmela', icon: '📷' },
    { name: 'YouTube', url: 'https://youtube.com/kisaanmela', icon: '📺' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/kisaanmela', icon: '💼' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">🚜</div>
              <div className="text-2xl font-bold">KisaanMela</div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting farmers, vendors, and agricultural enthusiasts across India. 
              Your one-stop platform for agricultural fairs, marketplace, and learning.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPinIcon className="h-5 w-5 text-green-500" />
                <span>123 Pet Street, Pet City, PC 12345, United States</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <PhoneIcon className="h-5 w-5 text-green-500" />
                <div className="flex flex-col">
                  <span>+91-9999778321</span>
                  <span className="text-sm text-gray-400">Mon-Fri: 8AM-8PM</span>
                  <span className="text-sm text-gray-400">Sat-Sun: 9AM-6PM</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <EnvelopeIcon className="h-5 w-5 text-green-500" />
                <div className="flex flex-col">
                  <span>hello@kisaanmela.com</span>
                  <span>support@kisaanmela.com</span>
                  <span>careers@kisaanmela.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <GlobeAltIcon className="h-5 w-5 text-green-500" />
                <span>www.kisaanmela.com</span>
              </div>
            </div>
          </div>

          {/* Farmers Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">For Farmers</h3>
            <ul className="space-y-2">
              {footerLinks.farmers.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">For Vendors</h3>
            <ul className="space-y-2">
              {footerLinks.vendors.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path}
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {link.path.startsWith('http') ? (
                    <a 
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      href={link.path}
                      className="text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates on agricultural events, market prices, and farming techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-green-400 transition-colors"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 KisaanMela. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Made with</span>
                <HeartIcon className="h-4 w-4 text-red-500" />
                <span>for Indian Farmers</span>
              </div>
              <div className="text-gray-400 text-sm">
                🇮🇳 Proudly Indian
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources Section */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/events/upcoming" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace/buy" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Buy Products
                  </Link>
                </li>
                <li>
                  <Link href="/training/workshops" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Free Workshops
                  </Link>
                </li>
                <li>
                  <Link href="/vendors/book-stall" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Book Your Stall
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Emergency Support</h4>
              <div className="space-y-2">
                <div className="text-gray-400 text-sm">
                  <strong>24/7 Helpline:</strong> +91-9999778321
                </div>
                <div className="text-gray-400 text-sm">
                  <strong>WhatsApp:</strong> +91-9999778321
                </div>
                <div className="text-gray-400 text-sm">
                  <strong>Email:</strong> support@kisaanmela.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
