'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';
import { isRouteVisibleForRole, type AppRole } from '@/config/appMatrix';
import { useAuth } from '@/components/providers/AuthProvider';

function navRoleFromUser(role: string | undefined): AppRole {
  if (!role) return 'guest';
  const r = role.toLowerCase();
  if (r === 'seller') return 'vendor';
  if (r === 'farmer' || r === 'admin') return 'farmer';
  return 'guest';
}

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const headerRef = useRef<HTMLElement | null>(null);
  const [desktopOpenMenu, setDesktopOpenMenu] = useState<string | null>(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const safePathname = pathname ?? '';

  const userRole: AppRole = isAuthenticated ? navRoleFromUser(user?.role) : 'guest';
  
  // Filter navigation items based on user role
  const getVisibleNavItems = () => {
    return navigationConfig.unified.filter(item => 
      isRouteVisibleForRole(item.path, userRole)
    ).map(item => ({
      ...item,
      children: item.children?.filter(child => 
        isRouteVisibleForRole(child.path, userRole)
      )
    }));
  };

  const nav = getVisibleNavItems();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setDesktopOpenMenu(null);
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopOpenMenu(null);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setDesktopOpenMenu(null);
    setMobileOpenMenu(null);
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [safePathname]);

  return (
    <>
      {/* Top Microbar */}
      <div className="bg-gray-800 text-white text-sm sm:text-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center min-h-11 py-1.5 sm:gap-3">
            <div className="flex items-center gap-3 sm:space-x-4 min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="shrink-0" aria-hidden>
                  📞
                </span>
                <span className="font-medium text-xs sm:text-sm md:text-base truncate">+91-9999778321</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 whitespace-nowrap shrink-0">
                <span>💬</span>
                <span className="font-medium">WhatsApp Support</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:space-x-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <Link
                href="/events/register"
                className="hidden md:inline-flex items-center whitespace-nowrap rounded-md bg-green-600 hover:bg-green-700 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200"
              >
                🎪 Join Mela
              </Link>
              <Link
                href="/vendors/book-stall"
                className="hidden md:inline-flex items-center whitespace-nowrap rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200"
              >
                🏪 Book Stall
              </Link>
              <div className="relative min-w-0 max-w-full flex-1 sm:flex-initial sm:max-w-none">
                <select className="w-full min-w-0 max-w-full sm:w-auto sm:max-w-[11rem] appearance-none bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 pr-7 sm:pr-8 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
      <header ref={headerRef} className="bg-green-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-3">
            <Link
              href="/"
              className="min-w-0 text-xl sm:text-2xl lg:text-[1.65rem] xl:text-3xl font-extrabold tracking-wide whitespace-nowrap lg:justify-self-start"
            >
              KisaanMela
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex min-w-0 justify-center">
              <ul className="flex gap-1 xl:gap-2 items-center whitespace-nowrap px-1">
                {nav.map((item) => {
                  const visibleChildren = (item.children ?? []).filter(
                    (child) => child.path !== item.path
                  );
                  const itemActive =
                    safePathname === item.path || safePathname.startsWith(`${item.path}/`);
                  const childActive = Boolean(
                    visibleChildren.some((child) => safePathname === child.path)
                  );
                  const hasChildren = visibleChildren.length > 0;
                  const isOpen = desktopOpenMenu === item.name;

                  return (
                    <li
                      key={item.path}
                      className="relative shrink-0"
                      onMouseEnter={() => hasChildren && setDesktopOpenMenu(item.name)}
                      onMouseLeave={() => hasChildren && setDesktopOpenMenu(null)}
                    >
                      {hasChildren ? (
                        <>
                          <button
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={isOpen}
                            className={`px-2.5 py-2 rounded-md transition-colors duration-200 hover:text-yellow-300 whitespace-nowrap text-base xl:text-[1.0625rem] font-medium ${
                              itemActive || childActive ? 'text-yellow-400 font-semibold' : ''
                            }`}
                            onClick={() =>
                              setDesktopOpenMenu(isOpen ? null : item.name)
                            }
                          >
                            {item.name} ▾
                          </button>

                          <ul
                            role="menu"
                            className={`absolute left-0 top-full mt-0 bg-white text-green-800 rounded-md shadow-lg min-w-[14rem] z-[60] border border-green-100 transition-all duration-150 origin-top ${
                              isOpen
                                ? 'opacity-100 translate-y-0 visible'
                                : 'opacity-0 -translate-y-1 invisible pointer-events-none'
                            }`}
                          >
                            <li>
                              <Link
                                href={item.path}
                                className={`block px-4 py-2.5 text-base hover:bg-green-50 rounded font-medium ${
                                  safePathname === item.path ? 'bg-green-100 text-green-800' : ''
                                }`}
                                onClick={() => setDesktopOpenMenu(null)}
                              >
                                {item.name} Overview
                              </Link>
                            </li>
                            {visibleChildren.map((child) => (
                              <li key={child.path}>
                                <Link
                                  href={child.path}
                                  className={`block px-4 py-2.5 text-[0.9375rem] xl:text-base hover:bg-green-50 rounded ${
                                    safePathname === child.path
                                      ? 'bg-green-100 text-green-800 font-semibold'
                                      : ''
                                  } ${child.highlight ? 'font-semibold text-green-700' : ''}`}
                                  onClick={() => setDesktopOpenMenu(null)}
                                >
                                  {child.icon && <span className="mr-2">{child.icon}</span>}
                                  {child.name}
                                {child.cta && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                      CTA
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={item.path}
                          className={`px-2.5 py-2 rounded-md hover:text-yellow-300 transition-colors duration-200 whitespace-nowrap text-base xl:text-[1.0625rem] font-medium ${
                            safePathname === item.path ? 'text-yellow-400 font-semibold' : ''
                          }`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* CTA Buttons & User Menu */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 shrink-0 justify-self-end pl-2">
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <span className="text-sm text-green-200/90 px-2" aria-live="polite">
                    …
                  </span>
                ) : isAuthenticated ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 max-w-[14rem] text-base font-medium text-white hover:text-yellow-400 transition-colors duration-200"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="menu"
                    >
                      <span className="shrink-0" aria-hidden>
                        👤
                      </span>
                      <span className="truncate">{user?.name || user?.mobile || 'Account'}</span>
                      <span className="shrink-0" aria-hidden>
                        ▼
                      </span>
                    </button>
                    {userMenuOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 mt-2 w-52 bg-white text-green-800 rounded-md shadow-lg py-2 z-[60] border border-green-100"
                      >
                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 truncate">
                          {user?.email || user?.mobile}
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2.5 text-sm font-medium hover:bg-green-50 rounded"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2.5 text-sm font-medium hover:bg-green-50 rounded"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2.5 text-sm font-medium hover:bg-green-50 rounded"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            void logout();
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-red-50 rounded text-red-600"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-white hover:text-yellow-400 px-3 xl:px-4 py-2.5 rounded-md text-base font-semibold transition-colors duration-200 whitespace-nowrap"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 xl:px-5 py-2.5 rounded-lg text-base font-semibold transition-colors duration-200 shadow-md whitespace-nowrap"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden shrink-0 min-h-11 min-w-11 flex items-center justify-center rounded-md text-2xl text-white hover:bg-green-700/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-green-900 text-white max-h-[min(70vh,calc(100dvh-8rem))] overflow-y-auto overscroll-contain shadow-inner border-t border-green-700/80">
          <ul className="flex flex-col gap-2 px-4 sm:px-6 pb-4 transition-all">
            {nav.map((item) => {
              const visibleChildren = (item.children ?? []).filter(
                (child) => child.path !== item.path
              );
              const hasChildren = visibleChildren.length > 0;
              const isMobileOpen = mobileOpenMenu === item.name;
              return (
                <li key={item.path} className="border-b border-green-700 pb-2">
                  {hasChildren ? (
                    <>
                      <button
                        className="w-full flex justify-between items-center py-1 text-left text-base font-semibold"
                        onClick={() =>
                          setMobileOpenMenu(isMobileOpen ? null : item.name)
                        }
                      >
                        <span>
                          {item.icon && <span className="mr-2 text-lg">{item.icon}</span>}
                          {item.name}
                        </span>
                        <span>{isMobileOpen ? '−' : '+'}</span>
                      </button>
                      {isMobileOpen && (
                        <ul className="pl-4 flex flex-col gap-1 transition-all">
                          <li>
                            <Link
                              href={item.path}
                              className={`block py-2 text-[0.9375rem] hover:text-yellow-400 transition-colors duration-200 font-medium ${
                                safePathname === item.path ? 'text-yellow-400 font-semibold' : ''
                              }`}
                              onClick={() => setMobileOpen(false)}
                            >
                              {item.name} Overview
                            </Link>
                          </li>
                          {visibleChildren.map((child) => (
                            <li key={child.path}>
                              <Link
                                href={child.path}
                                className={`block py-2 text-[0.9375rem] hover:text-yellow-400 transition-colors duration-200 ${
                                  safePathname === child.path
                                    ? 'text-yellow-400 font-semibold'
                                    : ''
                                } ${child.highlight ? 'font-semibold text-yellow-300' : ''}`}
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.icon && <span className="mr-2">{child.icon}</span>}
                                {child.name}
                                {child.cta && (
                                  <span className="ml-2 text-xs bg-yellow-400 text-green-800 px-1 rounded">
                                    CTA
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      className={`block py-2 text-base font-semibold hover:text-yellow-400 transition-colors duration-200 ${
                        safePathname === item.path ? 'text-yellow-400 font-semibold' : ''
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile CTA Buttons */}
          <div className="px-4 sm:px-6 pb-4 border-t border-green-700 pt-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/events/register"
                onClick={() => setMobileOpen(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-200 shadow-md flex items-center justify-center space-x-2"
              >
                <span>🎪</span>
                <span>Join Mela</span>
              </Link>
              <Link
                href="/vendors/book-stall"
                onClick={() => setMobileOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-200 shadow-md flex items-center justify-center space-x-2"
              >
                <span>🏪</span>
                <span>Book Stall</span>
              </Link>
            </div>
          </div>

          {/* Mobile User Menu */}
          <div className="px-4 sm:px-6 border-t border-green-700 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            {isLoading ? (
              <p className="text-sm text-green-200 py-2">Loading account…</p>
            ) : isAuthenticated ? (
              <div className="space-y-2">
                <p className="text-sm text-green-100/90 pb-2 border-b border-green-700 truncate">
                  {user?.name}
                  {user?.email || user?.mobile ? (
                    <span className="block text-xs text-green-200/80 truncate">{user?.email || user?.mobile}</span>
                  ) : null}
                </p>
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
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void logout();
                  }}
                  className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                >
                  🚪 Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-white hover:text-yellow-400 px-3 py-3 rounded-md text-base font-semibold transition-colors duration-200 text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-200 shadow-md text-center"
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