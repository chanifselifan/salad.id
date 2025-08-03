import React from 'react';

export default function SaladsPage() {
  const dummySalads = [
    { id: '1', name: 'Caesar Salad', price: 55000, description: 'Classic Caesar with grilled chicken.' },
    { id: '2', name: 'Greek Salad', price: 50000, description: 'Fresh veggies, feta cheese, olives.' },
    { id: '3', name: 'Cobb Salad', price: 60000, description: 'Hearty salad with bacon, egg, avocado.' },
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-12">
      <section className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#00796B] text-center mb-8">
          Semua Pilihan Salad Kami
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummySalads.map(salad => (
            <div key={salad.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#37474F] mb-2">{salad.name}</h3>
              <p className="text-gray-600 mb-4">{salad.description}</p>
              <p className="text-lg font-bold text-[#8BC34A]">Rp {salad.price.toLocaleString('id-ID')}</p>
              <button className="mt-4 bg-[#8BC34A] text-white px-4 py-2 rounded-md hover:bg-[#689F38] transition-colors duration-200">
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}