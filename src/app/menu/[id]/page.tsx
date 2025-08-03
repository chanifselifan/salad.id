import React from 'react';
import Image from 'next/image';
import { useCartStore } from '@/lib/stores/cart'; // Aktifkan import store

interface SaladDetailPageProps {
  params: {
    id: string;
  };
}

const dummySalads = [
  {
    id: '1',
    name: 'Salad Caesar Klasik',
    description: 'Selada romaine segar, crouton, keju parmesan, dan saus Caesar creamy.',
    price: 55000,
    imageUrl: '/images/salads/caesar.jpg',
    ingredients: ['Selada romaine', 'crouton', 'keju parmesan', 'saus Caesar'],
  },
  {
    id: '2',
    name: 'Salad Yunani',
    description: 'Tomat, timun, paprika, bawang merah, zaitun, dan keju feta dengan saus vinaigrette.',
    price: 50000,
    imageUrl: '/images/salads/greek.jpg',
    ingredients: ['Tomat', 'timun', 'paprika', 'keju feta', 'zaitun', 'saus vinaigrette'],
  },
  {
    id: '3',
    name: 'Salad Ayam Panggang',
    description: 'Dada ayam panggang, selada, tomat ceri, alpukat, dan saus honey mustard.',
    price: 65000,
    imageUrl: '/images/salads/grilled-chicken.jpg',
    ingredients: ['Dada ayam panggang', 'selada', 'tomat ceri', 'alpukat', 'saus honey mustard'],
  },
  {
    id: '4',
    name: 'Salad Quinoa',
    description: 'Quinoa, buncis hitam, jagung, alpukat, paprika, dengan saus lime cilantro.',
    price: 60000,
    imageUrl: '/images/salads/quinoa.jpg',
    ingredients: ['Quinoa', 'buncis hitam', 'jagung', 'alpukat', 'paprika', 'saus lime cilantro'],
  },
  {
    id: '5',
    name: 'Salad Buah Tropis',
    description: 'Campuran buah-buahan segar seperti mangga, nanas, dan kiwi dengan saus yoghurt.',
    price: 45000,
    imageUrl: '/images/salads/tropical-fruit.jpg',
    ingredients: ['Mangga', 'nanas', 'kiwi', 'saus yoghurt'],
  },
];

export default function SaladDetailPage({ params }: SaladDetailPageProps) {
  const salad = dummySalads.find((s) => s.id === params.id);
  const addToCart = useCartStore(state => state.addItem); // Aktifkan hook

  if (!salad) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5]">
        <h1 className="text-3xl text-[#37474F]">Salad tidak ditemukan!</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] py-12 min-h-screen">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Kiri: Gambar Salad */}
        <div className="flex justify-center items-start">
          <Image
            src={salad.imageUrl}
            alt={salad.name}
            width={500}
            height={500}
            className="rounded-xl shadow-lg"
            style={{ objectFit: "cover" }}
          />
        </div>
        {/* Kolom Kanan: Detail Produk */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold text-[#00796B] mb-2">{salad.name}</h1>
          <p className="text-2xl font-bold text-[#8BC34A] mb-4">
            Rp {salad.price.toLocaleString('id-ID')}
          </p>
          <p className="text-lg text-[#37474F] mb-6 leading-relaxed">{salad.description}</p>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#00796B] mb-2">Bahan-Bahan</h2>
            <ul className="list-disc list-inside text-[#37474F]">
              {salad.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => addToCart({
              id: salad.id,
              name: salad.name,
              price: salad.price,
            })}
            className="mt-auto bg-[#8BC34A] text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg hover:bg-[#689F38] transition-colors duration-300"
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}