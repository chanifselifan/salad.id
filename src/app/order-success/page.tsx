"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details if needed
    if (orderId) {
      // You can implement API call to get order details
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-soft-grey flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-6" />
          
          <h1 className="text-3xl font-bold text-deep-teal mb-4">
            Pembayaran Berhasil!
          </h1>
          
          <p className="text-dark-grey-text mb-2">
            Terima kasih atas pesanan Anda
          </p>
          
          {orderId && (
            <p className="text-sm text-dark-grey-text mb-6">
              ID Pesanan: <strong>{orderId}</strong>
            </p>
          )}
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-700">
              Pesanan Anda sedang diproses. Kami akan mengirim notifikasi 
              update status pesanan melalui email.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/menu" 
              className="block w-full bg-lime-green text-white font-bold py-3 px-6 rounded-full hover:bg-lime-600 transition-colors duration-300"
            >
              Pesan Lagi
            </Link>
            <Link 
              href="/" 
              className="block w-full bg-gray-200 text-dark-grey-text font-medium py-3 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
