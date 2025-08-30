"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useCartStore } from '@/lib/stores/cart';
import { 
  FaLeaf, 
  FaHeart, 
  FaUsers, 
  FaAward, 
  FaStar,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaCheckCircle,
  FaLightbulb,
  FaHardHat,
  FaGlobeAsia
} from 'react-icons/fa';

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

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    {
      icon: <FaLeaf className="text-3xl text-emerald-500" />,
      title: "Kesegaran Alami",
      description: "Kami memilih setiap bahan dengan teliti dari petani lokal terpercaya untuk memastikan kesegaran maksimal dalam setiap gigitan."
    },
    {
      icon: <FaHeart className="text-3xl text-rose-500" />,
      title: "Dibuat dengan Cinta",
      description: "Setiap salad dibuat dengan penuh perhatian dan cinta, karena kami percaya makanan yang baik dimulai dari hati yang tulus."
    },
    {
      icon: <FaUsers className="text-3xl text-blue-500" />,
      title: "Komunitas Sehat",
      description: "Kami membangun komunitas yang peduli kesehatan, saling mendukung dalam perjalanan menuju gaya hidup yang lebih baik."
    },
    {
      icon: <FaGlobeAsia className="text-3xl text-teal-500" />,
      title: "Berkelanjutan",
      description: "Komitmen kami terhadap lingkungan tercermin dalam setiap pilihan, dari kemasan ramah lingkungan hingga kemitraan dengan petani lokal."
    }
  ];

  const achievements = [
    { number: "10K+", label: "Pelanggan Bahagia", icon: "😊" },
    { number: "50+", label: "Menu Kreatif", icon: "🥗" },
    { number: "99%", label: "Kepuasan", icon: "⭐" },
    { number: "3+", label: "Tahun Pengalaman", icon: "🏆" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & Head Chef",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description: "Berpengalaman 15 tahun di industri kuliner sehat"
    },
    {
      name: "Michael Rahman",
      role: "Nutrition Expert",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Ahli gizi bersertifikat dengan passion untuk makanan sehat"
    },
    {
      name: "Lisa Putri",
      role: "Quality Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Memastikan kualitas terbaik di setiap tahap produksi"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <AppHeader />
      
      {/* Hero Section with Elegant Design */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl -translate-x-36 -translate-y-36 animate-pulse-slow" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl translate-x-48 animate-float" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-br from-lime-200/30 to-emerald-200/30 rounded-full blur-3xl translate-y-32 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <FaLeaf className="text-emerald-600" />
              Tentang Perjalanan Kami
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-in-left">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Menciptakan
              </span>
              <br />
              <span className="text-slate-800">
                Revolusi Sehat
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed animate-slide-in-right">
              Kami percaya bahwa makanan sehat tidak harus membosankan. 
              <br className="hidden md:block" />
              Mari wujudkan gaya hidup sehat yang <span className="text-emerald-600 font-semibold">lezat</span> dan <span className="text-teal-600 font-semibold">berkelanjutan</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link href="/menu" className="btn btn-primary text-lg px-8 py-4">
                <FaLeaf className="mr-2" />
                Jelajahi Menu
              </Link>
              <Link href="/contact" className="btn btn-outline text-lg px-8 py-4 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                <FaHeart className="mr-2" />
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-6">
                <FaLightbulb className="text-rose-600" />
                Cerita Kami
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Dimulai dari Mimpi
                <br />
                <span className="text-emerald-600">Sederhana</span>
              </h2>
              
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Pada tahun 2021, kami bermimpi menciptakan tempat di mana makanan sehat bertemu dengan cita rasa luar biasa. 
                  Dimulai dari dapur kecil dengan resep keluarga, kami percaya setiap orang berhak mendapatkan nutrisi terbaik 
                  tanpa mengorbankan kelezatan.
                </p>
                <p>
                  Hari ini, <strong className="text-emerald-600">Salad.id</strong> telah menjadi rumah bagi ribuan pecinta makanan sehat 
                  di seluruh Indonesia. Kami bangga menjadi bagian dari perjalanan kesehatan Anda, satu salad pada satu waktu.
                </p>
                <p>
                  Visi kami sederhana namun kuat: <em>membuat hidup sehat menjadi mudah, lezat, dan terjangkau untuk semua orang.</em>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-8">
                {['Organik', 'Segar', 'Lezat', 'Berkelanjutan'].map((tag, index) => (
                  <span 
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm font-medium"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img 
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=400&fit=crop&crop=center" 
                      alt="Fresh Salad"
                      className="w-full h-64 object-cover rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=300&fit=crop&crop=center" 
                      alt="Colorful Ingredients"
                      className="w-full h-48 object-cover rounded-2xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop&crop=center" 
                      alt="Mediterranean Salad"
                      className="w-full h-48 object-cover rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=400&fit=crop&crop=center" 
                      alt="Protein Bowl"
                      className="w-full h-64 object-cover rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-20 animate-float" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <FaAward className="text-blue-600" />
              Nilai-Nilai Kami
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Yang Kami <span className="text-emerald-600">Junjung Tinggi</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Setiap keputusan yang kami ambil didasari oleh nilai-nilai fundamental yang membentuk identitas Salad.id
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`group p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                  activeValue === index 
                    ? 'bg-white shadow-2xl transform scale-105 border-2 border-emerald-200' 
                    : 'bg-white/70 shadow-lg hover:shadow-xl hover:transform hover:scale-102'
                }`}
                onClick={() => setActiveValue(index)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">{achievement.number}</div>
                <div className="text-sm text-slate-600 font-medium">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <FaUsers className="text-purple-600" />
              Tim Kami
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Orang-Orang di Balik
              <br />
              <span className="text-emerald-600">Kesegaran</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Bertemu dengan tim passionate yang bekerja tanpa lelah untuk menghadirkan yang terbaik untuk Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 text-center"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-emerald-200 group-hover:ring-emerald-300 transition-all duration-300">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-36 -translate-y-36 animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-float" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Bergabung dengan 
              <br />
              <span className="text-emerald-100">Komunitas Sehat</span> Kami?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
              Mari bersama-sama menciptakan perubahan positif dalam hidup Anda. 
              Mulai hari ini, rasakan perbedaannya!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu" className="btn bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <FaLeaf className="mr-2" />
                Mulai Pesan Sekarang
              </Link>
              <Link href="/contact" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                <FaHardHat className="mr-2" />
                Ceritakan Kisah Anda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🥗</span> Salad.id
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Menghadirkan revolusi sehat melalui salad berkualitas premium yang lezat dan bergizi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-emerald-400">Menu Favorit</h4>
              <div className="space-y-2 text-slate-400">
                <div>Caesar Supreme</div>
                <div>Quinoa Rainbow</div>
                <div>Grilled Chicken Power</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-emerald-400">Hubungi Kami</h4>
              <div className="space-y-2 text-slate-400">
                <div>📞 (021) 123-4567</div>
                <div>📧 hello@salad.id</div>
                <div>📍 Jakarta, Indonesia</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2025 Salad.id. Dibuat dengan ❤️ untuk hidup yang lebih sehat.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}