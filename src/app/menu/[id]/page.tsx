"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useCartStore } from '@/lib/stores/cart';
import { 
  FaArrowLeft, 
  FaHeart, 
  FaStar, 
  FaLeaf, 
  FaSeedling, // Replace FaWheatAlt with FaSeedling
  FaClock,
  FaFire,
  FaPlus,
  FaMinus,
  FaCheck,
  FaShare,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';

interface SaladDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Enhanced salad data - same as in menu page
const SALAD_DATA = [
  {
    id: '1',
    name: 'Caesar Supreme',
    slug: 'caesar-supreme',
    description: 'Salad Caesar premium dengan selada romaine organik yang dipetik segar setiap pagi, crouton homemade yang renyah, keju parmesan Italia asli yang diparut halus, dan saus Caesar creamy yang dibuat dengan resep rahasia kami. Dilengkapi dengan grilled chicken tender yang dibumbui dengan herbs Mediterranean.',
    price: 55000,
    originalPrice: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&crop=center'
    ],
    category: 'Klasik',
    categoryId: 'classic',
    ingredients: ['Selada romaine organik', 'Crouton homemade', 'Keju parmesan Italia', 'Saus Caesar premium', 'Lemon segar', 'Grilled chicken tender'],
    nutritionFacts: {
      calories: 320,
      protein: '28g',
      carbs: '12g',
      fat: '18g',
      fiber: '4g',
      sugar: '3g',
      sodium: '680mg'
    },
    prepTime: '5-8 menit',
    servingSize: '1 porsi besar (350g)',
    isVegan: false,
    isGlutenFree: false,
    isPopular: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 156,
    tags: ['protein tinggi', 'cheese', 'classic', 'filling'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    benefits: ['High Protein', 'Rich in Calcium', 'Vitamin K', 'Folate'],
    customizations: [
      { name: 'Extra Chicken', price: 15000 },
      { name: 'Extra Parmesan', price: 8000 },
      { name: 'Gluten-free Croutons', price: 5000 },
      { name: 'Avocado Add-on', price: 12000 }
    ]
  },
  {
    id: '2',
    name: 'Greek Garden',
    slug: 'greek-garden',
    description: 'Perpaduan sempurna cita rasa Mediterranean dengan tomat cherry manis yang dipetik langsung dari kebun, timun segar yang renyah, paprika warna-warni, keju feta premium yang creamy, dan zaitun Kalamata asli. Disajikan dengan dressing herbs Mediterranean yang aromatik.',
    price: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center'
    ],
    category: 'Mediterranean',
    categoryId: 'mediterranean',
    ingredients: ['Tomat cherry organik', 'Timun segar', 'Paprika rainbow', 'Keju feta premium', 'Zaitun Kalamata', 'Oregano segar', 'Red onion'],
    nutritionFacts: {
      calories: 280,
      protein: '12g',
      carbs: '15g',
      fat: '20g',
      fiber: '6g',
      sugar: '8g',
      sodium: '520mg'
    },
    prepTime: '3-5 menit',
    servingSize: '1 porsi besar (320g)',
    isVegan: false,
    isGlutenFree: true,
    isPopular: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 89,
    tags: ['mediterranean', 'cheese', 'fresh', 'gluten-free'],
    allergens: ['Dairy'],
    benefits: ['Antioxidants', 'Healthy Fats', 'Vitamin C', 'Mediterranean Diet'],
    customizations: [
      { name: 'Extra Feta', price: 10000 },
      { name: 'Grilled Chicken', price: 18000 },
      { name: 'Quinoa Base', price: 8000 },
      { name: 'Extra Olives', price: 6000 }
    ]
  },
  {
    id: '3',
    name: 'Grilled Chicken Power',
    slug: 'grilled-chicken-power',
    description: 'Dada ayam panggang bumbu herbs, alpukat, tomat, selada mix dengan honey mustard dressing yang lezat dan sehat.',
    price: 68000,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center'
    ],
    category: 'Protein',
    categoryId: 'protein',
    ingredients: ['Dada ayam panggang', 'Alpukat', 'Tomat cherry', 'Mixed greens', 'Honey mustard'],
    nutritionFacts: {
      calories: 420,
      protein: '35g',
      carbs: '18g',
      fat: '22g',
      fiber: '8g',
      sugar: '5g',
      sodium: '590mg'
    },
    prepTime: '8-12 menit',
    servingSize: '1 porsi besar (380g)',
    isVegan: false,
    isGlutenFree: true,
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 203,
    tags: ['protein', 'healthy', 'filling'],
    allergens: ['Eggs'],
    benefits: ['High Protein', 'Healthy Fats', 'Vitamin E', 'Potassium'],
    customizations: [
      { name: 'Double Chicken', price: 20000 },
      { name: 'Extra Avocado', price: 12000 },
      { name: 'Quinoa Base', price: 8000 }
    ]
  }
  // Add more salads as needed...
];

// Enhanced Header Component
const AppHeader: React.FC = () => {
  const { data: session } = useSession();
  const { items } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartItemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-deep-teal'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 sm:h-20">
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

            <div className="flex items-center space-x-4">
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
              
              {/* Mobile menu button */}
              <button
                className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                  scrolled 
                    ? 'text-dark-grey-text hover:text-lime-green hover:bg-lime-green/10' 
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default function SaladDetailPage({ params }: SaladDetailPageProps) {
  // Use React.use() to unwrap the Promise params
  const resolvedParams = use(params);
  const salad = SALAD_DATA.find((s) => s.id === resolvedParams.id);
  
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!salad) {
    return (
      <div className="min-h-screen bg-soft-grey">
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-6xl mb-4">🥗</div>
          <h1 className="text-3xl font-bold text-deep-teal mb-4">Salad Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Maaf, salad yang Anda cari tidak tersedia.</p>
          <Link href="/menu" className="btn btn-primary">
            <FaArrowLeft />
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const customizationCost = selectedCustomizations.reduce((total, customization) => {
      const custom = salad.customizations?.find(c => c.name === customization);
      return total + (custom?.price || 0);
    }, 0);

    addItem({
      id: salad.id,
      name: salad.name + (selectedCustomizations.length > 0 ? ' (Custom)' : ''),
      price: salad.price + customizationCost,
      quantity: quantity
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleCustomization = (customization: string) => {
    setSelectedCustomizations(prev =>
      prev.includes(customization)
        ? prev.filter(c => c !== customization)
        : [...prev, customization]
    );
  };

  const totalPrice = salad.price + selectedCustomizations.reduce((total, customization) => {
    const custom = salad.customizations?.find(c => c.name === customization);
    return total + (custom?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-soft-grey">
      <AppHeader />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-lime-green">Beranda</Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-lime-green">Menu</Link>
          <span>/</span>
          <span className="text-deep-teal font-medium">{salad.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-square">
                <img
                  src={salad.gallery?.[selectedImage] || salad.imageUrl}
                  alt={salad.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {salad.isNew && (
                    <span className="bg-lime-green text-white text-xs font-bold px-3 py-1 rounded-full">
                      BARU
                    </span>
                  )}
                  {salad.isPopular && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <FaFire className="text-xs" /> POPULER
                    </span>
                  )}
                  {salad.originalPrice && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      HEMAT {Math.round(((salad.originalPrice - salad.price) / salad.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
                  >
                    <FaHeart className={`${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300">
                    <FaShare className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {salad.gallery && salad.gallery.length > 1 && (
              <div className="flex gap-3">
                {salad.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-lime-green shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${salad.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm px-3 py-1 bg-lime-green/10 text-lime-green font-medium rounded-full">
                  {salad.category}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FaStar className="text-yellow-400" />
                  <span>{salad.rating}</span>
                  <span>({salad.reviewCount} ulasan)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-deep-teal mb-3">
                {salad.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                {salad.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    Rp {salad.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
                <span className="text-2xl font-bold text-lime-green">
                  Rp {salad.price.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                  <FaClock className="text-gray-500" />
                  <span>{salad.prepTime}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                  <FaFire className="text-orange-500" />
                  <span>{salad.nutritionFacts.calories} kal</span>
                </div>
                {salad.isVegan && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-600 rounded-lg text-sm">
                    <FaLeaf />
                    <span>Vegan</span>
                  </div>
                )}
                {salad.isGlutenFree && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm">
                    <FaSeedling />
                    <span>Gluten Free</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-deep-teal mb-3">Deskripsi</h3>
              <p className="text-gray-700 leading-relaxed">
                {salad.description}
              </p>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold text-deep-teal mb-3">Bahan-bahan</h3>
              <div className="flex flex-wrap gap-2">
                {salad.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-soft-grey text-gray-700 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Customizations */}
            {salad.customizations && salad.customizations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-deep-teal mb-3">Kustomisasi</h3>
                <div className="space-y-2">
                  {salad.customizations.map((custom) => (
                    <label
                      key={custom.name}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-lime-green/50 hover:bg-lime-green/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomizations.includes(custom.name)}
                          onChange={() => toggleCustomization(custom.name)}
                          className="w-4 h-4 text-lime-green rounded focus:ring-lime-green"
                        />
                        <span className="font-medium">{custom.name}</span>
                      </div>
                      <span className="text-lime-green font-semibold">
                        +Rp {custom.price.toLocaleString('id-ID')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-deep-teal mb-3">Jumlah</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-deep-teal hover:text-lime-green transition-colors"
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-4 font-semibold min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-deep-teal hover:text-lime-green transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Total Harga:</div>
                    <div className="text-xl font-bold text-lime-green">
                      Rp {(totalPrice * quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : 'bg-lime-green text-white hover:bg-lime-600 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {isAdded ? (
                  <>
                    <FaCheck />
                    Berhasil Ditambahkan!
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Tambah ke Keranjang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nutrition Facts */}
            <div>
              <h3 className="text-lg font-bold text-deep-teal mb-4 flex items-center gap-2">
                <FaFire className="text-orange-500" />
                Informasi Gizi
              </h3>
              <div className="space-y-2">
                {Object.entries(salad.nutritionFacts).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                    <span className="capitalize text-gray-600">
                      {key === 'calories' ? 'Kalori' : key}
                    </span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-bold text-deep-teal mb-4 flex items-center gap-2">
                <FaLeaf className="text-green-500" />
                Manfaat Kesehatan
              </h3>
              <div className="space-y-2">
                {salad.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-lime-green rounded-full" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div>
              <h3 className="text-lg font-bold text-deep-teal mb-4">Alergen</h3>
              <div className="space-y-2">
                {salad.allergens.length > 0 ? (
                  salad.allergens.map((allergen, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-gray-700">{allergen}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Tidak ada alergen yang diketahui</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Menu */}
        <div className="text-center">
          <Link 
            href="/menu" 
            className="btn btn-outline px-8 py-3 text-lg flex items-center gap-3 mx-auto w-fit"
          >
            <FaArrowLeft />
            Kembali ke Menu
          </Link>
        </div>
      </div>
    </div>
  );
}