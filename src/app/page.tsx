import React from "react";
import Image from "next/image";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import {WelcomeSection} from "@/components/layout/WelcomeSection"; // import WelcomeSection

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <AppHeader />
      <main className="flex-1">
        {/* Welcome Section */}
        <WelcomeSection />
        {/* Features Section - Enhanced Grid */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-teal mb-3 sm:mb-4">
                Kenapa <span className="text-lime-green">Salad.id</span>?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-dark-grey-text max-w-2xl mx-auto">
                Kami berkomitmen memberikan yang terbaik untuk gaya hidup sehat
                Anda
              </p>
            </div>

            {/* Features Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: "🌱",
                  title: "Bahan Segar",
                  description:
                    "Dipilih setiap hari dengan kualitas terbaik dari petani lokal",
                },
                {
                  icon: "🎨",
                  title: "Menu Variatif",
                  description:
                    "Lebih dari 20+ varian salad dengan topping yang bisa disesuaikan",
                },
                {
                  icon: "🚚",
                  title: "Pengiriman Cepat",
                  description:
                    "Pesan mudah, pengiriman dalam 30-60 menit ke seluruh Jakarta",
                },
                {
                  icon: "💚",
                  title: "Hidup Sehat",
                  description:
                    "Cocok untuk diet, program detox, dan gaya hidup aktif",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="card p-4 sm:p-6 text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-deep-teal mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-dark-grey-text line-clamp-3">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Enhanced Layout */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Content Side */}
              <div className="order-2 lg:order-1 animate-slide-in-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-teal mb-4 sm:mb-6">
                  Mengapa Memilih
                  <br />
                  <span className="text-lime-green">Salad.id</span>?
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: "✨",
                      title: "Bahan segar & berkualitas setiap hari",
                      description: "Langsung dari kebun ke meja Anda",
                    },
                    {
                      icon: "🎯",
                      title: "Menu variatif & bisa custom topping",
                      description: "Sesuaikan dengan selera dan kebutuhan diet",
                    },
                    {
                      icon: "⚡",
                      title: "Pesan mudah, pengiriman cepat",
                      description:
                        "Aplikasi user-friendly dengan tracking real-time",
                    },
                    {
                      icon: "🏃‍♀️",
                      title: "Cocok untuk diet & gaya hidup sehat",
                      description: "Diformulasi oleh ahli gizi berpengalaman",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 group"
                    >
                      <div className="text-xl sm:text-2xl transform group-hover:scale-125 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-dark-grey-text mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm sm:text-base text-dark-grey-text/80">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Side */}
              <div className="order-1 lg:order-2 animate-slide-in-right">
                <div className="relative">
                  <div className="aspect-square max-w-md mx-auto relative">
                    <img
                      src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=500&h=500&fit=crop&crop=center"
                      alt="Salad Segar dan Lezat"
                      className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-lime-green/30"
                    />

                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg animate-float">
                      <span className="text-xl sm:text-2xl">🥗</span>
                    </div>
                    <div
                      className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-secondary rounded-full flex items-center justify-center shadow-lg animate-float"
                      style={{ animationDelay: "1s" }}
                    >
                      <span className="text-lg sm:text-xl">💚</span>
                    </div>
                  </div>

                  {/* Decorative ring */}
                  <div className="absolute -inset-8 rounded-3xl border-4 border-lime-green/20 animate-pulse-slow" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { number: "1000+", label: "Pelanggan Puas" },
                { number: "50+", label: "Varian Menu" },
                { number: "99%", label: "Rating Kepuasan" },
                { number: "30", label: "Menit Pengiriman" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base opacity-90">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 sm:py-16 md:py-20 bg-soft-grey">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-teal mb-4 sm:mb-6">
              Siap untuk Hidup Lebih Sehat?
            </h2>
            <p className="text-base sm:text-lg text-dark-grey-text mb-6 sm:mb-8 max-w-2xl mx-auto">
              Mulai perjalanan hidup sehat Anda hari ini dengan menu salad
              pilihan terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/menu" className="btn btn-primary text-lg px-8 py-4">
                Pesan Sekarang
              </Link>
              <Link
                href="/contact"
                className="btn btn-outline text-lg px-8 py-4"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
