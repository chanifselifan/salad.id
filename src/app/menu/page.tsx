"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { useCartStore } from '@/lib/stores/cart';
import { 
  FaSearch, 
  FaFilter, 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaLeaf, 
  FaSeedling, // Replace FaWheatAlt with FaSeedling
  FaClock,
  FaFire,
  FaEye,
  FaPlus,
  FaCheck,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';

// Sample salad data with enhanced properties
const SALAD_DATA = [
  {
    id: '1',
    name: 'Caesar Supreme',
    slug: 'caesar-supreme',
    description: 'Selada romaine segar dengan crouton homemade, keju parmesan asli, dan saus Caesar yang creamy',
    price: 55000,
    originalPrice: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&crop=center',
    category: 'Klasik',
    categoryId: 'classic',
    ingredients: ['Selada romaine', 'Crouton homemade', 'Keju parmesan', 'Saus Caesar', 'Lemon'],
    calories: 320,
    prepTime: '5-8 menit',
    isVegan: false,
    isGlutenFree: false,
    isPopular: true,
    isNew: false,
    rating: 4.8,
    tags: ['protein', 'cheese', 'classic']
  },
  {
    id: '2',
    name: 'Greek Garden',
    slug: 'greek-garden',
    description: 'Kombinasi sempurna tomat cherry, timun, paprika, keju feta, dan zaitun dengan dressing herbs',
    price: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&crop=center',
    category: 'Mediterranean',
    categoryId: 'mediterranean',
    ingredients: ['Tomat cherry', 'Timun', 'Paprika', 'Keju feta', 'Zaitun', 'Oregano'],
    calories: 280,
    prepTime: '3-5 menit',
    isVegan: false,
    isGlutenFree: true,
    isPopular: false,
    isNew: false,
    rating: 4.6,
    tags: ['mediterranean', 'cheese', 'fresh']
  },
  {
    id: '3',
    name: 'Grilled Chicken Power',
    slug: 'grilled-chicken-power',
    description: 'Dada ayam panggang bumbu herbs, alpukat, tomat, selada mix dengan honey mustard dressing',
    price: 68000,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop&crop=center',
    category: 'Protein',
    categoryId: 'protein',
    ingredients: ['Dada ayam', 'Alpukat', 'Tomat cherry', 'Mixed greens', 'Honey mustard'],
    calories: 420,
    prepTime: '8-12 menit',
    isVegan: false,
    isGlutenFree: true,
    isPopular: true,
    isNew: false,
    rating: 4.9,
    tags: ['protein', 'healthy', 'filling']
  },
  {
    id: '4',
    name: 'Quinoa Rainbow',
    slug: 'quinoa-rainbow',
    description: 'Quinoa organik, edamame, wortel, paprika warna-warni, dan biji bunga matahari dengan tahini dressing',
    price: 62000,
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=400&fit=crop&crop=center',
    category: 'Superfood',
    categoryId: 'superfood',
    ingredients: ['Quinoa organik', 'Edamame', 'Wortel', 'Paprika', 'Biji bunga matahari'],
    calories: 380,
    prepTime: '6-10 menit',
    isVegan: true,
    isGlutenFree: true,
    isPopular: false,
    isNew: true,
    rating: 4.7,
    tags: ['vegan', 'superfood', 'protein']
  },
  {
    id: '5',
    name: 'Tropical Paradise',
    slug: 'tropical-paradise',
    description: 'Mangga manis, nanas segar, kiwi, dengan coconut flakes dan lime mint dressing yang menyegarkan',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop&crop=center',
    category: 'Buah',
    categoryId: 'fruit',
    ingredients: ['Mangga', 'Nanas', 'Kiwi', 'Coconut flakes', 'Mint', 'Lime'],
    calories: 220,
    prepTime: '3-5 menit',
    isVegan: true,
    isGlutenFree: true,
    isPopular: false,
    isNew: false,
    rating: 4.5,
    tags: ['fruit', 'refreshing', 'light']
  },
  {
    id: '6',
    name: 'Salmon Avocado Bliss',
    slug: 'salmon-avocado-bliss',
    description: 'Salmon panggang premium, alpukat creamy, cucumber ribbon, dengan wasabi mayo dressing',
    price: 85000,
    originalPrice: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-d8636f17c82b?w=400&h=400&fit=crop&crop=center',
    category: 'Premium',
    categoryId: 'premium',
    ingredients: ['Salmon fillet', 'Alpukat', 'Cucumber', 'Mixed greens', 'Wasabi mayo'],
    calories: 480,
    prepTime: '10-15 menit',
    isVegan: false,
    isGlutenFree: true,
    isPopular: true,
    isNew: true,
    rating: 4.9,
    tags: ['premium', 'omega3', 'protein']
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Semua Menu', icon: '🥗', color: 'bg-gray-100' },
  { id: 'classic', name: 'Klasik', icon: '👑', color: 'bg-yellow-100' },
  { id: 'protein', name: 'High Protein', icon: '💪', color: 'bg-red-100' },
  { id: 'superfood', name: 'Superfood', icon: '🌟', color: 'bg-green-100' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🏛️', color: 'bg-blue-100' },
  { id: 'fruit', name: 'Buah Segar', icon: '🍓', color: 'bg-pink-100' },
  { id: 'premium', name: 'Premium', icon: '✨', color: 'bg-purple-100' }
];

// Enhanced Header Component with Mobile Support
const AppHeader: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCartStore();
  
  const cartItemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl">
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
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

// Footer Component
const AppFooter: React.FC = () => {
  return (
    <footer className="bg-deep-teal text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🥗</span> Salad.id
            </h3>
            <p className="text-white/80 leading-relaxed">
              Menghadirkan salad sehat, segar, dan lezat untuk gaya hidup aktif Anda.
              Pesan mudah, diantar cepat!
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Menu Populer</h4>
            <div className="space-y-2 text-white/80">
              <div>Caesar Supreme</div>
              <div>Grilled Chicken Power</div>
              <div>Quinoa Rainbow</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <div className="space-y-2 text-white/80">
              <div>📞 (021) 123-4567</div>
              <div>📧 hello@salad.id</div>
              <div>📍 Jakarta, Indonesia</div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2025 Salad.id. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function MenuPage() {
  const { data: session } = useSession();
  const { addItem, items } = useCartStore();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort logic
  const filteredSalads = useMemo(() => {
    let filtered = SALAD_DATA;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(salad => salad.categoryId === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(salad =>
        salad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salad.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      case 'popular':
      default:
        return filtered.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
    }
  }, [selectedCategory, searchQuery, sortBy]);

  // Add to cart with animation feedback - Fixed to use proper interface
  const handleAddToCart = (salad: typeof SALAD_DATA[0]) => {
    addItem({
      id: salad.id,
      name: salad.name,
      price: salad.price
    });
    
    setAddedItems(prev => [...prev, salad.id]);
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== salad.id));
    }, 2000);
  };

  // Toggle favorites
  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-soft-grey">
      <AppHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white pt-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-36 -translate-y-36" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
              Menu Salad Terbaik
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto animate-slide-in-right">
              Pilih dari koleksi salad sehat, segar, dan lezat yang dibuat khusus untuk gaya hidup aktif Anda
            </p>
          </div>

          {/* Search & Quick Stats */}
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <div className="relative max-w-md mx-auto">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari salad favorit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-dark-grey-text placeholder-gray-400 shadow-lg focus:ring-2 focus:ring-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">{SALAD_DATA.length}+</div>
                <div className="text-sm opacity-80">Varian Menu</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm opacity-80">Rating Rata-rata</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm opacity-80">Menit Siap</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-lime-green text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-dark-grey-text hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  {selectedCategory === category.id && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {category.id === 'all' ? SALAD_DATA.length : SALAD_DATA.filter(s => s.categoryId === category.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-dark-grey-text font-medium">
                  {filteredSalads.length} menu ditemukan
                </span>
                {searchQuery && (
                  <span className="text-sm text-gray-500">
                    untuk "{searchQuery}"
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lime-green/30 focus:outline-none"
                >
                  <option value="popular">Terpopuler</option>
                  <option value="newest">Terbaru</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                </select>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <div className="w-4 h-4 flex flex-col gap-0.5">
                      <div className="h-1 bg-current rounded" />
                      <div className="h-1 bg-current rounded" />
                      <div className="h-1 bg-current rounded" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
        } mb-12`}>
          {filteredSalads.map((salad, index) => (
            <div 
              key={salad.id}
              className={`card group hover:shadow-2xl transition-all duration-500 ${
                viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Section */}
              <div className={`relative overflow-hidden ${
                viewMode === 'list' 
                  ? 'w-48 h-32 flex-shrink-0' 
                  : 'h-56 w-full'
              } ${viewMode === 'grid' ? 'rounded-t-2xl' : 'rounded-l-2xl'}`}>
                <img
                  src={salad.imageUrl}
                  alt={salad.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {salad.isNew && (
                    <span className="bg-lime-green text-white text-xs font-bold px-2 py-1 rounded-full">
                      BARU
                    </span>
                  )}
                  {salad.isPopular && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <FaFire className="text-xs" /> POPULER
                    </span>
                  )}
                  {salad.originalPrice && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      DISKON
                    </span>
                  )}
                </div>

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(salad.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
                >
                  <FaHeart className={`text-sm ${favorites.includes(salad.id) ? 'text-red-500' : 'text-gray-400'}`} />
                </button>

                {/* Quick view button */}
                <Link
                  href={`/menu/${salad.id}`}
                  className="absolute bottom-3 right-3 w-8 h-8 bg-deep-teal/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <FaEye className="text-sm" />
                </Link>
              </div>

              {/* Content Section */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-6`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-deep-teal mb-1 group-hover:text-lime-green transition-colors">
                      {salad.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{salad.rating}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <FaClock />
                        <span>{salad.prepTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {salad.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        Rp {salad.originalPrice.toLocaleString('id-ID')}
                      </div>
                    )}
                    <div className="text-xl font-bold text-lime-green">
                      Rp {salad.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {salad.description}
                </p>

                {/* Tags & Properties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaFire className="text-orange-500" />
                    {salad.calories} kal
                  </span>
                  {salad.isVegan && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaLeaf />
                      Vegan
                    </span>
                  )}
                  {salad.isGlutenFree && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaSeedling />
                      Gluten Free
                    </span>
                  )}
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Bahan utama:</div>
                  <div className="text-sm text-gray-600">
                    {salad.ingredients.slice(0, 3).join(', ')}
                    {salad.ingredients.length > 3 && '...'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(salad)}
                    disabled={addedItems.includes(salad.id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedItems.includes(salad.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-lime-green text-white hover:bg-lime-600 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    {addedItems.includes(salad.id) ? (
                      <>
                        <FaCheck />
                        Ditambahkan!
                      </>
                    ) : (
                      <>
                        <FaPlus />
                        Tambah ke Keranjang
                      </>
                    )}
                  </button>
                  
                  <Link
                    href={`/menu/${salad.id}`}
                    className="px-4 py-3 border-2 border-deep-teal text-deep-teal rounded-xl hover:bg-deep-teal hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <FaEye />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSalads.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-deep-teal mb-2">
              Tidak ada menu yang ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn btn-primary"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-primary text-white rounded-3xl p-8 md:p-12 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Belum Menemukan yang Cocok?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Hubungi kami untuk custom salad sesuai preferensi diet dan kesehatan Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">
              Konsultasi Gratis
            </Link>
            <Link href="/about" className="btn btn-outline bg-white/10 border-white text-white hover:bg-white hover:text-lime-green">
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </section>
      </div>

      <AppFooter />
    </div>
  );
}