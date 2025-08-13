"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/stores/cart';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { createMidtransTransaction } from '@/lib/api';
import { payWithMidtrans } from '@/lib/midtrans';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const totalHarga = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeItem(id);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Keranjang belanja kosong!");
      return;
    }
    setIsLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalHarga,
      };
      const transactionToken = await createMidtransTransaction(orderData);
      payWithMidtrans(transactionToken);
      // clearCart(); // Uncomment jika ingin mengosongkan keranjang setelah pembayaran sukses
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan saat proses checkout. Mohon coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-soft-grey"> 
        <h1 className="text-3xl text-dark-grey-text mb-4">Keranjang Anda kosong.</h1> 
        <Link href="/menu" className="bg-lime-green text-white font-bold py-3 px-6 rounded-full hover:bg-lime-600 transition-colors duration-300"> {/* Revisi warna */}
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-soft-grey py-12 min-h-screen"> 
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-teal text-center mb-8">Keranjang Belanja</h1> 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Daftar Item Keranjang */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b border-soft-grey py-4 last:border-b-0"> {/* Revisi warna */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-deep-teal">{item.name}</h3> 
                  <p className="text-sm text-dark-grey-text">Rp {item.price.toLocaleString('id-ID')}</p> {/* Revisi warna */}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-soft-grey rounded-full px-2"> 
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="text-deep-teal hover:text-lime-green transition-colors duration-300" 
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-4 text-dark-grey-text">{item.quantity}</span> 
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="text-deep-teal hover:text-lime-green transition-colors duration-300" 
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Kolom Kanan: Ringkasan Keranjang */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Ringkasan Pesanan</h2> 
            <div className="flex justify-between items-center py-4 border-t border-soft-grey"> 
              <span className="text-xl font-bold text-dark-grey-text">Total</span>
              <span className="text-2xl font-extrabold text-lime-green"> 
                Rp {totalHarga.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
              className={`w-full mt-6 bg-lime-green text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg transition-colors duration-300
                ${isLoading || items.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lime-600'}`} 
            >
              {isLoading ? 'Memproses...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}