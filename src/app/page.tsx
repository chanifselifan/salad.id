import Image from "next/image";
import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

export default function HomePage() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold text-[#00796B] leading-tight mb-4">
            Salad.id: <br className="md:hidden" /> Pilihan Sehat, Hidup Nikmat
          </h1>
          <p className="text-lg text-[#37474F] mb-8 max-w-2xl mx-auto">
            Temukan berbagai pilihan salad segar dan lezat yang dibuat dengan
            bahan-bahan terbaik, siap diantar ke pintu Anda.
          </p>
          <button className="bg-[#8BC34A] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#689F38] transition-colors duration-300 transform hover:scale-105">
            Lihat Menu Kami
          </button>
        </section>

        {/* Featured Salads Section (Placeholder) */}
        <section className="container mx-auto px-4 mt-12">
          <h2 className="text-4xl font-bold text-[#00796B] text-center mb-8">
            Salad Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for SaladCard components */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#37474F] mb-2">
                Salad Ayam Panggang
              </h3>
              <p className="text-gray-600">
                Dada ayam panggang, selada, tomat, timun, saus madu mustard.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#37474F] mb-2">
                Salad Quinoa Vegetarian
              </h3>
              <p className="text-gray-600">
                Quinoa, alpukat, jagung, kacang hitam, paprika, saus lime
                cilantro.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#37474F] mb-2">
                Tropical Fruit Salad
              </h3>
              <p className="text-gray-600">
                Campuran buah tropis segar dengan dressing yoghurt mint.
              </p>
            </div>
          </div>
        </section>
      </div>
      <AppFooter />
    </div>
  );
}



