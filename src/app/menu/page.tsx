import React from 'react';
import SaladCard from '@/components/salads/SaladCard';
import image from 'next/image';

const dummySalads = [
  {
    id: '1',
    name: 'Salad Caesar Klasik',
    description:
      'Selada romaine segar, crouton, keju parmesan, dan saus Caesar creamy.',
    price: 55000,
    Image:'/w1.jpg',
  },
  {
    id: '2',
    name: 'Salad Yunani',
    description:
      'Tomat, timun, paprika, bawang merah, zaitun, dan keju feta dengan saus vinaigrette.',
    price: 50000,
    imageUrl: '/2.jpg',
  },
  {
    id: '3',
    name: 'Salad Ayam Panggang',
    description:
      'Dada ayam panggang, selada, tomat ceri, alpukat, dan saus honey mustard.',
    price: 65000,
    imageUrl: '/3.jpg',
  },
  {
    id: '4',
    name: 'Salad Quinoa',
    description:
      'Quinoa, buncis hitam, jagung, alpukat, paprika, dengan saus lime cilantro.',
    price: 60000,
    imageUrl: '/4.jpg',
  },
  {
    id: '5',
    name: 'Salad Buah Tropis',
    description:
      'Campuran buah-buahan segar seperti mangga, nanas, dan kiwi dengan saus yoghurt.',
    price: 45000,
    imageUrl: '/5.jpg',
  },
];

export default function MenuPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
              <h2 className="text-2xl font-bold text-[#00796B] mb-2">{salad.name}</h2>
              <p className="text-[#37474F] text-base mb-4 text-center">{salad.description}</p>
              <button className="mt-auto bg-[#8BC34A] text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-[#689F38] transition-all duration-300">
                Pesan Sekarang
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}