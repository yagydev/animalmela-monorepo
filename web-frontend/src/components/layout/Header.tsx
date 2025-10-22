'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context
  
  // Determine user role (this would come from auth context in real app)
  const userRole: 'guest' | 'farmer' | 'vendor' = isLoggedIn ? 'farmer' : 'guest';
  
  // Filter navigation items based on user role
  const getVisibleNavItems = () => {
    return navigationConfig.unified.filter(item => 
      !item.roles || item.roles.includes(userRole)
    ).map(item => ({
      ...item,
      children: item.children?.filter(child => 
        !child.roles || child.roles.includes(userRole)
      )
    }));
  };

  const nav = getVisibleNavItems();

  return (
    <>
      {/* Top Microbar */}
      <div className="bg-gray-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+91-9999778321</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <span>💬</span>
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
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-green-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <Link href="/" className="text-2xl font-bold tracking-wide">
            KisaanMela
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex gap-8 items-center">
            {nav.map((item) => (
              <li
                key={item.path}
                className="relative group"
                onMouseEnter={() => setOpenMenu(item.name)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      className={`transition-colors duration-200 hover:text-yellow-400 ${
                        pathname.includes(item.path.toLowerCase()) || 
                        item.children.some(child => pathname === child.path)
                          ? 'text-yellow-400 font-semibold'
                          : ''
                      }`}
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      {item.name} ▾
                    </button>

                    <ul
                      className={`absolute left-0 mt-2 bg-white text-green-800 rounded-md shadow-lg w-48 transform transition-all duration-300 ease-in-out ${
                        openMenu === item.name
                          ? 'opacity-100 translate-y-0 visible'
                          : 'opacity-0 -translate-y-2 invisible'
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            href={child.path}
                            className={`block px-4 py-2 hover:bg-green-50 rounded ${
                              pathname === child.path
                                ? 'bg-green-100 text-green-800 font-semibold'
                                : ''
                            } ${child.highlight ? 'font-semibold text-green-700' : ''}`}
                            onClick={() => setOpenMenu(null)}
                          >
                            {child.icon && <span className="mr-2">{child.icon}</span>}
                            {child.name}
                            {child.cta && <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">CTA</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className={`hover:text-yellow-400 transition-colors duration-200 ${
                      pathname === item.path ? 'text-yellow-400 font-semibold' : ''
                    }`}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

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
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-200"
                  >
                    <span>👤</span>
                    <span>Profile</span>
                    <span>▼</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-green-800 rounded-md shadow-lg py-2 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-green-50 rounded"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 hover:bg-green-50 rounded"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 hover:bg-green-50 rounded"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-green-50 rounded text-red-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-green-900 text-white">
          <ul className="flex flex-col gap-2 px-6 pb-4 transition-all">
            {nav.map((item) => (
              <li key={item.path} className="border-b border-green-700 pb-2">
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      className="w-full flex justify-between items-center"
                      onClick={() =>
                        setOpenMenu(openMenu === item.name ? null : item.name)
                      }
                    >
                      <span>
                        {item.icon && <span className="mr-1">{item.icon}</span>}
                        {item.name}
                      </span>
                      <span>{openMenu === item.name ? '−' : '+'}</span>
                    </button>
                    {openMenu === item.name && (
                      <ul className="pl-4 flex flex-col gap-1 transition-all">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              href={child.path}
                              className={`block py-1 hover:text-yellow-400 transition-colors duration-200 ${
                                pathname === child.path
                                  ? 'text-yellow-400 font-semibold'
                                  : ''
                              } ${child.highlight ? 'font-semibold text-yellow-300' : ''}`}
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.icon && <span className="mr-2">{child.icon}</span>}
                              {child.name}
                              {child.cta && <span className="ml-2 text-xs bg-yellow-400 text-green-800 px-1 rounded">CTA</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className={`block py-1 hover:text-yellow-400 transition-colors duration-200 ${
                      pathname === item.path ? 'text-yellow-400 font-semibold' : ''
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          {/* Mobile CTA Buttons */}
          <div className="px-6 pb-4 border-t border-green-700 pt-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/events/register"
                onClick={() => setMobileOpen(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md flex items-center justify-center space-x-2"
              >
                <span>🎪</span>
                <span>Join Mela</span>
              </Link>
              <Link
                href="/vendors/book-stall"
                onClick={() => setMobileOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md flex items-center justify-center space-x-2"
              >
                <span>🏪</span>
                <span>Book Stall</span>
              </Link>
            </div>
          </div>

          {/* Mobile User Menu */}
          <div className="px-6 pb-4 border-t border-green-700 pt-4">
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 hover:text-yellow-400 transition-colors duration-200"
                >
                  👤 My Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 hover:text-yellow-400 transition-colors duration-200"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 hover:text-yellow-400 transition-colors duration-200"
                >
                  ⚙️ Settings
                </Link>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  🚪 Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}