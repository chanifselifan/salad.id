"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useCartStore } from '@/lib/stores/cart';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaPaperPlane,
  FaComments,
  FaHeart,
  FaLightbulb,
  FaQuestionCircle,
  FaGift,
  FaHandsHelping
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactReason: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeContact, setActiveContact] = useState(0);

  const contactReasons = [
    { value: 'general', label: 'Pertanyaan Umum', icon: '💬', color: 'from-blue-400 to-cyan-400' },
    { value: 'order', label: 'Bantuan Pesanan', icon: '🛒', color: 'from-emerald-400 to-teal-400' },
    { value: 'feedback', label: 'Saran & Masukan', icon: '💡', color: 'from-amber-400 to-orange-400' },
    { value: 'partnership', label: 'Kerjasama', icon: '🤝', color: 'from-purple-400 to-indigo-400' },
    { value: 'custom', label: 'Menu Custom', icon: '🎨', color: 'from-rose-400 to-pink-400' }
  ];

  const contactMethods = [
    {
      icon: <FaPhone className="text-2xl text-emerald-500" />,
      title: "Telepon",
      details: "+62 21 123-4567",
      description: "Senin - Minggu, 08:00 - 22:00",
      action: "tel:+622112341567",
      gradient: "from-emerald-400 to-teal-400"
    },
    {
      icon: <FaWhatsapp className="text-2xl text-green-500" />,
      title: "WhatsApp",
      details: "+62 812-3456-7890",
      description: "Respon cepat 24/7",
      action: "https://wa.me/6281234567890",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: <FaEnvelope className="text-2xl text-blue-500" />,
      title: "Email",
      details: "hello@salad.id",
      description: "Respon dalam 2-4 jam",
      action: "mailto:hello@salad.id",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-purple-500" />,
      title: "Lokasi",
      details: "Jakarta Pusat",
      description: "Area pengiriman tersedia",
      action: "#",
      gradient: "from-purple-400 to-indigo-400"
    }
  ];

  const socialMedia = [
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com/salad.id', color: 'from-pink-500 to-rose-500' },
    { icon: <FaFacebook />, name: 'Facebook', url: 'https://facebook.com/salad.id', color: 'from-blue-600 to-blue-700' },
    { icon: <FaTwitter />, name: 'Twitter', url: 'https://twitter.com/salad_id', color: 'from-sky-400 to-sky-500' }
  ];

  const faqs = [
    {
      question: "Berapa lama waktu pengiriman?",
      answer: "Pengiriman kami biasanya memakan waktu 30-60 menit tergantung lokasi Anda di area Jakarta."
    },
    {
      question: "Apakah bisa custom salad?",
      answer: "Tentu! Kami menyediakan layanan custom salad sesuai preferensi dan kebutuhan diet Anda."
    },
    {
      question: "Bagaimana cara menjaga kesegaran salad?",
      answer: "Salad dikemas dengan teknologi khusus dan dikirim dengan cooler bag untuk menjaga kesegaran."
    },
    {
      question: "Ada program langganan bulanan?",
      answer: "Ya, kami memiliki paket langganan dengan berbagai pilihan menu dan frekuensi pengiriman."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactReason: 'general'
      });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveContact((prev) => (prev + 1) % contactMethods.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50">
      <AppHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-violet-200/40 to-purple-200/40 rounded-full blur-3xl translate-x-36 -translate-y-36 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl -translate-x-48 translate-y-48 animate-float" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <FaComments className="text-violet-600" />
              Mari Terhubung
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-in-left">
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Hubungi
              </span>
              <br />
              <span className="text-slate-800">
                Tim Kami
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed animate-slide-in-right">
              Ada pertanyaan? Butuh bantuan? Atau ingin berbagi saran?
              <br className="hidden md:block" />
              Kami di sini untuk <span className="text-violet-600 font-semibold">membantu</span> dan <span className="text-indigo-600 font-semibold">mendengarkan</span> Anda.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {contactMethods.slice(0, 3).map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${method.gradient} text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  {method.icon}
                  <span className="hidden sm:inline">{method.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <FaHandsHelping className="text-emerald-600" />
              Cara Menghubungi Kami
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Pilih Cara yang <span className="text-violet-600">Paling Mudah</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai channel komunikasi untuk memudahkan Anda terhubung dengan tim kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 text-center border-2 ${
                  activeContact === index ? 'border-violet-300 shadow-2xl scale-105' : 'border-transparent'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${method.gradient} mb-4 shadow-lg`}>
                    {method.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{method.title}</h3>
                  <p className="text-lg font-semibold text-violet-600 mb-2">{method.details}</p>
                  <p className="text-sm text-slate-600 mb-4">{method.description}</p>
                  
                  <a 
                    href={method.action}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${method.gradient} text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                  >
                    Hubungi Sekarang
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Social Media */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Atau ikuti kami di media sosial</h3>
            <div className="flex justify-center gap-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${social.color} text-white flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <FaPaperPlane className="text-indigo-600" />
                Kirim Pesan
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Ada Yang Ingin <span className="text-indigo-600">Ditanyakan?</span>
              </h2>
              <p className="text-lg text-slate-600">
                Isi form di bawah ini dan kami akan segera merespons pesan Anda
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <FaHeart className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-emerald-700 font-semibold">Pesan terkirim!</p>
                    <p className="text-emerald-600 text-sm">Terima kasih, kami akan merespons dalam 2-4 jam.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Reason Selector */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-3">
                    Keperluan Anda
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {contactReasons.map((reason) => (
                      <label
                        key={reason.value}
                        className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${
                          formData.contactReason === reason.value
                            ? 'border-violet-300 bg-violet-50'
                            : 'border-gray-200 hover:border-violet-200 hover:bg-violet-25'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contactReason"
                          value={reason.value}
                          checked={formData.contactReason === reason.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${reason.color} flex items-center justify-center text-sm`}>
                            {reason.icon}
                          </div>
                          <span className="font-medium text-sm">{reason.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      Subjek *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="Subjek pesan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Pesan *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300 resize-none bg-white/70 backdrop-blur-sm"
                    placeholder="Ceritakan kepada kami apa yang bisa kami bantu..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Kirim Pesan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
              <FaQuestionCircle className="text-amber-600" />
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Pertanyaan yang <span className="text-amber-600">Sering Ditanya</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Mungkin pertanyaan Anda sudah terjawab di sini
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-semibold text-slate-800 pr-4">{faq.question}</h3>
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center group-open:rotate-45 transition-transform duration-300">
                      <FaLightbulb className="text-amber-600" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">Tidak menemukan jawaban yang Anda cari?</p>
            <Link href="#contact-form" className="btn btn-primary px-6 py-3">
              <FaComments className="mr-2" />
              Tanya Langsung
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full translate-x-36 -translate-y-36 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 translate-y-48 animate-float" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGift className="text-2xl" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap untuk Memulai Perjalanan
              <br />
              <span className="text-violet-100">Sehat Bersama Kami?</span>
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
              Jangan ragu untuk menghubungi kami kapan saja. Tim kami selalu siap membantu 
              dan menjawab semua pertanyaan Anda dengan ramah dan profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu" className="btn bg-white text-violet-600 hover:bg-violet-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <FaHeart className="mr-2" />
                Mulai Pesan Sekarang
              </Link>
              <a href="https://wa.me/6281234567890" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-violet-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                <FaWhatsapp className="mr-2" />
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🥗</span> Salad.id
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Terhubung dengan kami untuk pengalaman kuliner sehat terbaik di Indonesia.
              </p>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${social.color} flex items-center justify-center hover:scale-110 transition-transform duration-300`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-violet-400">Kontak Cepat</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-emerald-400" />
                  (021) 123-4567
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="text-green-400" />
                  +62 812-3456-7890
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />
                  hello@salad.id
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-violet-400">Jam Operasional</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <FaClock className="text-amber-400" />
                  Senin - Jumat: 08:00 - 22:00
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-amber-400" />
                  Sabtu - Minggu: 09:00 - 21:00
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-violet-400">Area Layanan</h4>
              <div className="space-y-1 text-slate-400 text-sm">
                <div>Jakarta Pusat</div>
                <div>Jakarta Selatan</div>
                <div>Jakarta Barat</div>
                <div>+ Area sekitar</div>
                 </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Salad.id. Semua Hak Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}