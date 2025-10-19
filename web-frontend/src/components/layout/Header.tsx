'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { navigationConfig, NavItem } from '@/config/navigation';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon,
  ChevronDownIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface DropdownMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

function DropdownMenu({ items, isOpen, onClose }: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.path}
          onClick={onClose}
          className={`block px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
            item.highlight ? 'bg-green-50 border-l-4 border-green-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${item.highlight ? 'text-green-700' : 'text-gray-900'}`}>
                {item.name}
              </div>
              {item.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {item.description}
                </div>
              )}
            </div>
            {item.cta && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
}

function NavItemComponent({ item, isActive, showDropdown, onToggleDropdown, onCloseDropdown }: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      onToggleDropdown();
    }
  };

  return (
    <div className="relative">
      <Link
        href={item.path}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive 
            ? 'text-green-700 bg-green-50' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
        onClick={handleClick}
        onMouseEnter={item.children ? onToggleDropdown : undefined}
        onMouseLeave={item.children ? onCloseDropdown : undefined}
      >
        <span className="text-base">{item.icon}</span>
        <span>{item.name}</span>
        {item.children && (
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        )}
      </Link>
      {item.children && (
        <DropdownMenu 
          items={item.children} 
          isOpen={showDropdown} 
          onClose={onCloseDropdown} 
        />
      )}
    </div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const isActive = (path: string) => {
    if (typeof window === 'undefined') return false;
    const currentPath = window.location.pathname;
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = (itemName: string) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Top Microbar */}
      <div className="bg-gray-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4" />
                <span>+91-9999778321</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="en">🇺🇸 English</option>
                  <option value="hi">🇮🇳 Hindi</option>
                  <option value="mr">🇮🇳 Marathi</option>
                  <option value="pa">🇮🇳 Punjabi</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <button className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
                <MoonIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white shadow-lg border-b-2 border-green-200 transition-all duration-300 ${
        isScrolled ? 'sticky top-0 z-50 shadow-xl' : 'relative'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-lg border-2 border-green-200">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                    <path d="M10 4h1v12h-1z"></path>
                    <path d="M13 4h1v12h-1z"></path>
                    <path d="M7 6h1v10h-1z"></path>
                    <path d="M16 6h1v10h-1z"></path>
                    <circle cx="10" cy="3" r="1"></circle>
                    <circle cx="13" cy="3" r="1"></circle>
                    <circle cx="7" cy="5" r="1"></circle>
                    <circle cx="16" cy="5" r="1"></circle>
                    <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1"></circle>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">Kisaanmela</span>
                  <span className="text-xs text-green-700 font-semibold -mt-1">Farmers' Marketplace</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationConfig.main.map((item) => (
                <div key={item.name} ref={el => dropdownRefs.current[item.name] = el}>
                  <NavItemComponent
                    item={item}
                    isActive={isActive(item.path)}
                    showDropdown={openDropdown === item.name}
                    onToggleDropdown={() => handleToggleDropdown(item.name)}
                    onCloseDropdown={handleCloseDropdown}
                  />
                </div>
              ))}
            </nav>

            {/* CTA Buttons & User Menu */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Link
                  href="/events/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md flex items-center space-x-2"
                >
                  <span>🎪</span>
                  <span>Join Mela</span>
                </Link>
                <Link
                  href="/vendors/book-stall"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md flex items-center space-x-2"
                >
                  <span>🏪</span>
                  <span>Book Stall</span>
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="space-y-2">
                {navigationConfig.main.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive(item.path) 
                          ? 'text-green-700 bg-green-50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                    {item.children && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child, index) => (
                          <Link
                            key={index}
                            href={child.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/events/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>🎪</span>
                      <span>Join Mela</span>
                    </Link>
                    <Link
                      href="/vendors/book-stall"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>🏪</span>
                      <span>Book Stall</span>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}