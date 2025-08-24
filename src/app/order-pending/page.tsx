"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaClock } from 'react-icons/fa';

export default function OrderPending() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-soft-grey flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <FaClock className="mx-auto text-6xl text-yellow-500 mb-6" />
          
          <h1 className="text-3xl font-bold text-deep-teal mb-4">
            Pembayaran Tertunda
          </h1>
          
          <p className="text-dark-grey-text mb-2">
            Pesanan Anda menunggu pembayaran
          </p>
          
          {orderId && (
            <p className="text-sm text-dark-grey-text mb-6">
              ID Pesanan: <strong>{orderId}</strong>
            </p>
          )}
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-700">
              Silakan selesaikan pembayaran Anda melalui metode yang telah dipilih. 
              Pesanan akan otomatis diproses setelah pembayaran dikonfirmasi.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/cart" 
              className="block w-full bg-lime-green text-white font-bold py-3 px-6 rounded-full hover:bg-lime-600 transition-colors duration-300"
            >
              Coba Lagi
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
