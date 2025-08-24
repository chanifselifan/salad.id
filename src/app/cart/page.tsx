"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { payWithMidtrans } from '@/lib/midtrans';

export default function CartPage() {
  const { data: session } = useSession();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
  });

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

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address) {
      alert("Mohon lengkapi data pengiriman!");
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
        customerDetails,
      };

      const response = await fetch('/api/orders/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create transaction');
      }

      payWithMidtrans(data.transactionToken, {
        onSuccess: (result) => {
          clearCart();
          window.location.href = `/order-success?order_id=${result.order_id}`;
        },
        onPending: (result) => {
          window.location.href = `/order-pending?order_id=${result.order_id}`;
        }
      });
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
        <Link href="/menu" className="bg-lime-green text-white font-bold py-3 px-6 rounded-full hover:bg-lime-600 transition-colors duration-300">
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
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-deep-teal mb-4">Item Pesanan</h2>
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b border-soft-grey py-4 last:border-b-0">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-deep-teal">{item.name}</h3> 
                    <p className="text-sm text-dark-grey-text">Rp {item.price.toLocaleString('id-ID')}</p>
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

            {/* Customer Details Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-deep-teal mb-4">Data Pengiriman</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="form-label">No. Telepon</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    placeholder="081234567890"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Alamat Pengiriman</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                    placeholder="Alamat lengkap untuk pengiriman"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-dark-grey-text">Subtotal</span>
                <span className="text-dark-grey-text">Rp {totalHarga.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-grey-text">Biaya Pengiriman</span>
                <span className="text-dark-grey-text">Rp 10.000</span>
              </div>
              <div className="border-t border-soft-grey pt-2">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-dark-grey-text">Total</span>
                  <span className="text-2xl font-extrabold text-lime-green">
                    Rp {(totalHarga + 10000).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
            
            {!session && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <Link href="/auth/signin" className="font-medium text-lime-green hover:text-deep-teal">
                    Login
                  </Link> untuk pengalaman belanja yang lebih mudah
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
              className={`w-full mt-6 bg-lime-green text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg transition-colors duration-300
                ${isLoading || items.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lime-600'}`} 
            >
              {isLoading ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}