// frontend/src/app/page.tsx
// Halaman utama (landing page) untuk aplikasi Salad.id.
// Menggabungkan hero section dan daftar produk unggulan.
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E0F2F1] via-[#F5F5F5] to-[#F5F5F5]">
      <AppHeader />
      <main>
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center overflow-hidden">
          {/* Decorative gradient blobs */}
          <div className="absolute left-[-60px] top-[-60px] w-72 h-72 bg-[#8BC34A]/20 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute right-[-80px] bottom-[-80px] w-96 h-96 bg-[#00796B]/20 rounded-full blur-3xl -z-10 animate-pulse" />
          <Image
            src="/W1.png"
            alt="Salad.id Logo"
            width={140}
            height={140}
            className="mb-8 drop-shadow-xl animate-fade-in"
            priority
          />
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#00796B] leading-tight mb-4 tracking-tight drop-shadow-sm animate-fade-in">
            Selamat Datang di{" "}
            <span className="text-[#8BC34A]">Salad.id</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#37474F] mb-10 max-w-2xl mx-auto animate-fade-in">
            Nikmati salad sehat, segar, dan lezat setiap hari.
            <br className="hidden sm:inline" />
            Pesan dengan mudah, dikirim langsung ke pintu Anda!
          </p>
          <Link
            href="/menu"
            className="bg-[#8BC34A] text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-[#689F38] transition-all duration-300 transform hover:scale-105 text-lg animate-fade-in"
          >
            Lihat Menu Salad
          </Link>
        </section>

        {/* Why Choose Us Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-1 flex flex-col items-center md:items-start">
              <h2 className="text-3xl font-bold text-[#00796B] mb-4">
                Kenapa{" "}
                <span className="text-[#8BC34A]">Salad.id</span>
                ?
              </h2>
              <ul className="text-[#37474F] text-lg space-y-3">
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-[#8BC34A] rounded-full mr-2" />
                  Bahan segar & berkualitas setiap hari
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-[#8BC34A] rounded-full mr-2" />
                  Menu variatif & bisa custom topping
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-[#8BC34A] rounded-full mr-2" />
                  Pesan mudah, pengiriman cepat
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-[#8BC34A] rounded-full mr-2" />
                  Cocok untuk diet & gaya hidup sehat
                </li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <Image
                  src="/5.jpg"
                  alt="Salad Segar"
                  width={320}
                  height={320}
                  className="rounded-3xl shadow-2xl border-4 border-[#8BC34A]/30 bg-white animate-fade-in"
                />
                {/* Decorative ring */}
                <div className="absolute -inset-4 rounded-3xl border-4 border-[#8BC34A]/30 animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
      {/* Optional: Tambahkan animasi CSS di global.css untuk .animate-fade-in dan .animate-pulse */}
    </div>
  );
}

