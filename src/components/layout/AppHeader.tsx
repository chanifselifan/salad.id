"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useCartStore } from '@/lib/stores/cart';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const AppHeader: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCartStore();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-deep-teal'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className={`text-xl sm:text-2xl font-bold tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-deep-teal' : 'text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">🥗</span>
                Salad.id
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/menu', label: 'Menu' },
                { href: '/about', label: 'Tentang' },
                { href: '/contact', label: 'Kontak' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors duration-300 font-medium hover:scale-105 transform ${
                    scrolled 
                      ? 'text-dark-grey-text hover:text-lime-green' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart */}
              <Link
                href="/cart"
                className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  scrolled 
                    ? 'text-dark-grey-text hover:text-lime-green hover:bg-lime-green/10' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <FaShoppingCart className="text-xl" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lime-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-lime-green border-t-transparent rounded-full animate-spin" />
              ) : session ? (
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${
                    scrolled ? 'text-dark-grey-text' : 'text-white/90'
                  }`}>
                    Hi, {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="btn btn-ghost text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="btn btn-primary text-sm px-6 py-2 flex items-center gap-2"
                >
                  <FaUser />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                scrolled 
                  ? 'text-dark-grey-text hover:text-lime-green hover:bg-lime-green/10' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu fixed top-16 sm:top-20 left-0 right-0 z-50 md:hidden transform transition-all duration-300 ${
        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="bg-white/95 backdrop-blur-lg shadow-xl border-t border-soft-grey">
          <div className="container mx-auto px-4 py-6">
            {/* Navigation Links */}
            <nav className="space-y-4 mb-6">
              {[
                { href: '/', label: 'Beranda', icon: '🏠' },
                { href: '/menu', label: 'Menu', icon: '🥗' },
                { href: '/about', label: 'Tentang', icon: '📖' },
                { href: '/contact', label: 'Kontak', icon: '📞' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg text-dark-grey-text hover:text-lime-green hover:bg-lime-green/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center justify-between p-3 rounded-lg text-dark-grey-text hover:text-lime-green hover:bg-lime-green/10 transition-all duration-300 border border-soft-grey mb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <FaShoppingCart className="text-lg" />
                <span className="font-medium">Keranjang</span>
              </div>
              {cartItemCount > 0 && (
                <span className="bg-lime-green text-white text-sm font-bold rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            <div className="pt-4 border-t border-soft-grey">
              {status === "loading" ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-lime-green border-t-transparent rounded-full animate-spin" />
                </div>
              ) : session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-lime-green/10 rounded-lg">
                    <div className="w-8 h-8 bg-lime-green rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-dark-grey-text">{session.user?.name || 'User'}</p>
                      <p className="text-sm text-dark-grey-text/70">{session.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn btn-outline flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  <FaUser />
                  Login / Daftar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default AppHeader;
