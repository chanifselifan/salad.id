"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export const WelcomeSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Beautiful salad images with different compositions
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center&auto=enhance&sat=1.2&con=1.1",
      alt: "Caesar Salad Premium",
      title: "Caesar Supreme"
    },
    {
      url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&crop=center&auto=enhance&sat=1.2&con=1.1",
      alt: "Greek Garden Salad",
      title: "Greek Garden"
    },
    {
      url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&crop=center&auto=enhance&sat=1.2&con=1.1",
      alt: "Protein Power Bowl",
      title: "Power Bowl"
    },
    {
      url: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop&crop=center&auto=enhance&sat=1.2&con=1.1",
      alt: "Rainbow Quinoa Bowl",
      title: "Rainbow Bowl"
    }
  ];

  // Auto-rotate images
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#10B981"/>
              <circle cx="80" cy="40" r="0.8" fill="#06B6D4"/>
              <circle cx="40" cy="70" r="1.2" fill="#8B5CF6"/>
              <circle cx="70" cy="85" r="0.6" fill="#F59E0B"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grain)"/>
        </svg>
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-200/25 to-indigo-200/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          
          {/* Left Side - Content */}
          <div className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-medium shadow-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Sehat • Segar • Lezat
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-slate-800">Selamat Datang</span>
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  di Salad.id
                </span>
              </h1>
              
              <div className="relative">
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
                  Nikmati salad sehat, segar, dan lezat setiap hari.
                  <br className="hidden sm:inline" />
                  <span className="text-emerald-600 font-semibold">
                    Pesan dengan mudah, dikirim langsung ke pintu Anda!
                  </span>
                </p>
                
                {/* Decorative underline */}
                <div className="absolute -bottom-2 left-0 lg:left-0 w-32 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-60" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              {[
                { number: "1000+", label: "Pelanggan Puas", icon: "😊" },
                { number: "50+", label: "Menu Variatif", icon: "🥗" },
                { number: "99%", label: "Rating Kepuasan", icon: "⭐" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-emerald-600">{stat.number}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/menu"
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <span className="text-2xl">🥗</span>
                  Jelajahi Menu
                </span>
              </Link>
              
              <Link
                href="/about"
                className="group px-8 py-4 border-2 border-emerald-500 text-emerald-600 rounded-full font-bold text-lg hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="text-xl">📖</span>
                Tentang Kami
              </Link>
            </div>
          </div>

          {/* Right Side - Image Gallery */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}>
            
            {/* Main Image Container */}
            <div className="relative">
              
              {/* Background Circle */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full transform scale-110 opacity-30 animate-pulse-slow" />
              
              {/* Primary Image */}
              <div className="relative w-full max-w-lg mx-auto">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/50 backdrop-blur-sm relative">
                  {heroImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        currentSlide === index 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-110'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      
                      {/* Image Title */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                          <h3 className="text-lg font-bold text-slate-800">{image.title}</h3>
                          <p className="text-sm text-emerald-600">Tersedia sekarang</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Mini Images */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white bg-white animate-float">
                  <img
                    src="https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200&h=200&fit=crop&crop=center"
                    alt="Fresh Fruits"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white bg-white animate-float" style={{ animationDelay: '1s' }}>
                  <img
                    src="https://images.unsplash.com/photo-1559847844-d8636f17c82b?w=200&h=200&fit=crop&crop=center"
                    alt="Salmon Avocado"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-4 w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-1/4 -right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '2s' }} />
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-3 mt-8">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-emerald-500 scale-125' 
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quality Badges */}
            <div className="absolute top-8 right-8 space-y-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">Organik</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <span className="text-sm font-semibold text-slate-700">Segar</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <span className="text-sm font-semibold text-slate-700">Premium</span>
              </div>
            </div>

            {/* Nutritional Highlights */}
            <div className="absolute bottom-0 left-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💪</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">High Protein</p>
                  <p className="text-xs text-slate-600">25-35g per porsi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

