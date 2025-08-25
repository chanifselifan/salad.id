// src/app/menu/page.tsx
"use client";

import React from 'react';
import { useCartStore } from '@/lib/stores/cart';

const dummySalads = [
  {
    id: '1',
    name: 'Salad Caesar Klasik',
    description:
      'Selada romaine segar, crouton, keju parmesan, dan saus Caesar creamy.',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: '2',
    name: 'Salad Yunani',
    description:
      'Tomat, timun, paprika, bawang merah, zaitun, dan keju feta dengan saus vinaigrette.',
    price: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: '3',
    name: 'Salad Ayam Panggang',
    description:
      'Dada ayam panggang, selada, tomat ceri, alpukat, dan saus honey mustard.',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: '4',
    name: 'Salad Quinoa',
    description:
      'Quinoa, buncis hitam, jagung, alpukat, paprika, dengan saus lime cilantro.',
    price: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: '5',
    name: 'Salad Buah Tropis',
    description:
      'Campuran buah-buahan segar seperti mangga, nanas, dan kiwi dengan saus yoghurt.',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=400&fit=crop&crop=center',
  },
];

export default function MenuPage() {
  const addToCart = useCartStore(state => state.addItem);

  const handleAddToCart = (salad: typeof dummySalads[0]) => {
    addToCart({
      id: salad.id,
      name: salad.name,
      price: salad.price,
    });
    alert(`${salad.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="bg-gradient-to-b from-[#E0F2F1] via-[#F5F5F5] to-[#F5F5F5] py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#00796B] mb-4 drop-shadow">
            Pilihan Menu Salad Kami
          </h1>
          <p className="text-lg text-[#37474F] max-w-2xl mx-auto">
            Temukan berbagai pilihan salad sehat, segar, dan lezat yang cocok untuk gaya hidup Anda. Semua bahan dipilih dengan kualitas terbaik!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummySalads.map(salad => (
            <div
              key={salad.id}
              className="group bg-white rounded-3xl shadow-xl border border-[#8BC34A]/20 p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute right-4 top-4 bg-[#8BC34A] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Rp {salad.price.toLocaleString('id-ID')}
              </div>
              <div className="w-56 h-56 mb-6 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                <img
                  src={salad.imageUrl}
                  alt={salad.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <h2 className="text-2xl font-bold text-[#00796B] mb-2 text-center">{salad.name}</h2>
              <p className="text-[#37474F] text-base mb-4 text-center line-clamp-3">{salad.description}</p>
              <button 
                onClick={() => handleAddToCart(salad)}
                className="mt-auto bg-[#8BC34A] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#689F38] transition-all duration-300 w-full"
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}