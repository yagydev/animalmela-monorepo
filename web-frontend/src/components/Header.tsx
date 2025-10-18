'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  HomeIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon,
  NewspaperIcon,
  PhoneIcon,
  GlobeAltIcon,
  UserIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

// Navigation configuration
const navigationConfig = {
  mainNav: [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
      description: 'Welcome to Kisaan Mela'
    },
    {
      name: 'Events',
      path: '/events',
      icon: CalendarDaysIcon,
      description: 'Agricultural fairs and exhibitions',
      dropdown: [
        { name: 'Upcoming Melas', path: '/events/upcoming' },
        { name: 'Past Highlights', path: '/events/past' },
        { name: 'Photo Gallery', path: '/events/gallery' }
      ]
    },
    {
      name: 'Marketplace',
      path: '/marketplace',
      icon: ShoppingBagIcon,
      description: 'Buy and sell agricultural products',
      dropdown: [
        { name: 'Buy Seeds & Tools', path: '/marketplace/buy' },
        { name: 'Sell Produce', path: '/marketplace/sell' },
        { name: 'Organic Products', path: '/marketplace/organic' },
        { name: 'Farmers Market', path: '/farmers-market' }
      ]
    },
    {
      name: 'Training',
      path: '/training',
      icon: AcademicCapIcon,
      description: 'Learn modern farming techniques',
      dropdown: [
        { name: 'Workshops', path: '/training/workshops' },
        { name: 'Subsidy Guidance', path: '/training/subsidies' },
        { name: 'Agri Tech Updates', path: '/training/tech' }
      ]
    },
    {
      name: 'Vendors',
      path: '/vendors',
      icon: BuildingStorefrontIcon,
      description: 'Business opportunities for vendors',
      dropdown: [
        { name: 'Book Stall / Advertise', path: '/vendors/book-stall' },
        { name: 'Upload Catalog', path: '/vendors/catalog' },
        { name: 'Analytics Dashboard', path: '/vendor/dashboard' }
      ]
    },
    {
      name: 'News',
      path: '/news',
      icon: NewspaperIcon,
      description: 'Latest agricultural news and stories',
      dropdown: [
        { name: 'Farmer Stories', path: '/news/stories' },
        { name: 'Innovation Hub', path: '/news/innovation' },
        { name: 'Policy Updates', path: '/news/policy' }
      ]
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: PhoneIcon,
      description: 'Get in touch with us'
    }
  ],
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ]
};

export default function Header() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsLanguageMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <>
      {/* Top Microbar */}
      <div className="bg-green-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              <span>📞 Helpline: +91-9999778321</span>
              <span>📧 hello@kisaanmela.com</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors"
                >
                  <LanguageIcon className="h-4 w-4" />
                  <span>{navigationConfig.languages.find(lang => lang.code === i18n.language)?.flag}</span>
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    {navigationConfig.languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 flex items-center space-x-2"
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Login/Register */}
              <div className="flex items-center space-x-2">
                <Link href="/login" className="hover:text-green-200 transition-colors">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Login
                </Link>
                <span>|</span>
                <Link href="/register" className="hover:text-green-200 transition-colors">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-green-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl">🚜</div>
              <div className={`text-2xl font-bold transition-colors ${
                isScrolled ? 'text-green-700' : 'text-white'
              }`}>
                KisaanMela
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationConfig.mainNav.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                      isActiveRoute(item.path)
                        ? isScrolled
                          ? 'text-green-700 bg-green-50'
                          : 'text-white bg-green-600'
                        : isScrolled
                        ? 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                        : 'text-white hover:text-green-200 hover:bg-green-600'
                    }`}
                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDownIcon className="h-3 w-3" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border z-50">
                      <div className="py-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/vendors/book-stall"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isScrolled
                    ? 'bg-green-700 text-white hover:bg-green-800'
                    : 'bg-white text-green-700 hover:bg-green-50'
                }`}
              >
                Book Stall
              </Link>
              <Link
                href="/register"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isScrolled
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                Join Mela
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-green-600'
              }`}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-2">
              {navigationConfig.mainNav.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                      isActiveRoute(item.path)
                        ? 'text-green-700 bg-green-50'
                        : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                    }`}
                    onClick={() => item.dropdown && toggleDropdown(item.name)}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.dropdown && <ChevronDownIcon className="h-4 w-4" />}
                  </Link>
                  
                  {/* Mobile Dropdown */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.path}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2">
                <Link
                  href="/vendors/book-stall"
                  className="block w-full px-4 py-2 bg-green-700 text-white text-center rounded-md font-medium hover:bg-green-800 transition-colors"
                >
                  Book Stall
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-4 py-2 bg-orange-600 text-white text-center rounded-md font-medium hover:bg-orange-700 transition-colors"
                >
                  Join Mela
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
