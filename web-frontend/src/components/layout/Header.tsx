'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from '@heroicons/react/24/solid';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Farmers Market', href: '/farmers-market' },
    { name: 'Farmers Management', href: '/farmers-management' },
    { name: 'Services', href: '/services' },
    { name: 'Pets', href: '/pets' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-white to-blue-50 shadow-lg border-b-2 border-blue-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-earth-600 rounded-full flex items-center justify-center shadow-lg border-2 border-primary-200">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {/* Pure Agricultural Logo - Farm/Wheat Symbol */}
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  {/* Wheat stalks */}
                  <path d="M10 4h1v12h-1z"/>
                  <path d="M13 4h1v12h-1z"/>
                  <path d="M7 6h1v10h-1z"/>
                  <path d="M16 6h1v10h-1z"/>
                  {/* Wheat heads - simple dots */}
                  <circle cx="10" cy="3" r="1"/>
                  <circle cx="13" cy="3" r="1"/>
                  <circle cx="7" cy="5" r="1"/>
                  <circle cx="16" cy="5" r="1"/>
                  {/* Center circle for farm symbol */}
                  <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">Kisaanmela</span>
                <span className="text-xs text-primary-700 font-semibold -mt-1">Farmers' Marketplace</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="text-sm font-medium hidden lg:block">
                      {user?.name}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/farmers-market?tab=cart"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        🛒 Shopping Cart
                      </Link>
                      <Link
                        href="/farmers-market?tab=orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        📋 My Orders
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        ❤️ Favorites
                      </Link>
                      <Link
                        href="/messages"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        💬 Messages
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          toggleTheme();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {theme === 'dark' ? '☀️ Light Theme' : '🌙 Dark Theme'}
                      </button>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-white to-blue-50 border-t-2 border-blue-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {/* Farmers Market Section */}
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Farmers Market</h3>
                  </div>
                  <Link
                    href="/farmers-management"
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ⚙️ Farmers Management
                  </Link>
                  
                  {/* Account Section */}
                  <div className="px-3 py-2 mt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
                  </div>
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/farmers-market?tab=cart"
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🛒 Shopping Cart
                  </Link>
                  <Link
                    href="/farmers-market?tab=orders"
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📋 My Orders
                  </Link>
                  <Link
                    href="/favorites"
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ❤️ Favorites
                  </Link>
                  <Link
                    href="/messages"
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    💬 Messages
                  </Link>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    {theme === 'dark' ? '☀️ Light Theme' : '🌙 Dark Theme'}
                  </button>
                  <Link
                    href="/settings"
                    className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
