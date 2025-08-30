"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaSpinner, FaTruck, FaClock, FaPhone, FaEnvelope } from 'react-icons/fa';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryFee: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    salad: {
      name: string;
      imageUrl: string;
    };
  }>;
}

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionId = searchParams.get('transaction_id');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      setError('Order ID tidak ditemukan');
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/verify-payment?order_number=${orderId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setOrderDetails(data.order);
      } else {
        setError(data.error || 'Gagal memuat detail pesanan');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Terjadi kesalahan saat memuat detail pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-grey flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <FaSpinner className="mx-auto text-6xl text-lime-green mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-deep-teal mb-2">Memuat Detail Pesanan</h2>
          <p className="text-dark-grey-text">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-soft-grey flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Terjadi Kesalahan
            </h1>
            <p className="text-dark-grey-text mb-6">
              {error || 'Detail pesanan tidak dapat dimuat'}
            </p>
            <div className="space-y-3">
              <Link 
                href="/cart" 
                className="block w-full bg-lime-green text-white font-bold py-3 px-6 rounded-lg hover:bg-lime-600 transition-colors duration-300"
              >
                Kembali ke Keranjang
              </Link>
              <Link 
                href="/" 
                className="block w-full bg-gray-200 text-dark-grey-text font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDING: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: FaClock, text: 'Menunggu Konfirmasi' },
    CONFIRMED: { color: 'text-green-600', bg: 'bg-green-50', icon: FaCheckCircle, text: 'Dikonfirmasi' },
    PREPARING: { color: 'text-blue-600', bg: 'bg-blue-50', icon: FaClock, text: 'Sedang Dipersiapkan' },
    OUT_FOR_DELIVERY: { color: 'text-purple-600', bg: 'bg-purple-50', icon: FaTruck, text: 'Dalam Perjalanan' },
    DELIVERED: { color: 'text-green-600', bg: 'bg-green-50', icon: FaCheckCircle, text: 'Terkirim' },
    CANCELLED: { color: 'text-red-600', bg: 'bg-red-50', icon: FaClock, text: 'Dibatalkan' },
  };

  const currentStatus = statusConfig[orderDetails.status as keyof typeof statusConfig] || statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-soft-grey py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <FaCheckCircle className="mx-auto text-8xl text-green-500 mb-6 animate-bounce" />
          <h1 className="text-4xl font-bold text-deep-teal mb-4">
            Pembayaran Berhasil!
          </h1>
          <p className="text-xl text-dark-grey-text mb-2">
            Terima kasih atas pesanan Anda
          </p>
          {transactionId && (
            <p className="text-sm text-dark-grey-text/70">
              Transaction ID: <strong>{transactionId}</strong>
            </p>
          )}
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-lime-green text-white p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Pesanan #{orderDetails.orderNumber}</h2>
                <p className="opacity-90">
                  Dibuat pada {new Date(orderDetails.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStatus.bg}`}>
                <StatusIcon className={`${currentStatus.color}`} />
                <span className={`font-semibold ${currentStatus.color}`}>
                  {currentStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-deep-teal mb-4">Detail Pesanan</h3>
            <div className="space-y-4 mb-6">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-soft-grey/30 rounded-lg">
                  <div className="w-16 h-16 bg-soft-grey rounded-lg flex-shrink-0">
                    <img 
                      src={item.salad.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop&crop=center"}
                      alt={item.salad.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-deep-teal">{item.salad.name}</h4>
                    <p className="text-dark-grey-text/70">
                      {item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lime-green">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-soft-grey pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-dark-grey-text">Subtotal</span>
                  <span className="font-semibold">Rp {orderDetails.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-grey-text">Biaya Pengiriman</span>
                  <span className="font-semibold">Rp {orderDetails.deliveryFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-2 border-t">
                  <span className="text-dark-grey-text">Total</span>
                  <span className="text-lime-green">
                    Rp {(orderDetails.totalAmount + orderDetails.deliveryFee).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-deep-teal mb-4 flex items-center gap-2">
              <FaPhone className="text-lime-green" />
              Informasi Kontak
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-dark-grey-text">{orderDetails.customerName}</p>
                <p className="text-dark-grey-text/70 text-sm">Nama Penerima</p>
              </div>
              <div>
                <p className="font-semibold text-dark-grey-text">{orderDetails.customerPhone}</p>
                <p className="text-dark-grey-text/70 text-sm">Nomor Telepon</p>
              </div>
              <div>
                <p className="font-semibold text-dark-grey-text">{orderDetails.customerEmail}</p>
                <p className="text-dark-grey-text/70 text-sm">Email</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-deep-teal mb-4 flex items-center gap-2">
              <FaTruck className="text-lime-green" />
              Alamat Pengiriman
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-dark-grey-text">{orderDetails.deliveryAddress}</p>
                <p className="text-dark-grey-text/70 text-sm">Alamat Lengkap</p>
              </div>
              <div className="bg-lime-green/10 p-3 rounded-lg">
                <p className="text-sm font-semibold text-deep-teal mb-1">Estimasi Pengiriman</p>
                <p className="text-sm text-dark-grey-text">30-60 menit dari konfirmasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-deep-teal mb-4">Langkah Selanjutnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-lime-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaEnvelope className="text-lime-green text-xl" />
              </div>
              <h4 className="font-semibold text-deep-teal mb-2">Konfirmasi Email</h4>
              <p className="text-sm text-dark-grey-text/70">
                Kami akan mengirim detail pesanan ke email Anda
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-lime-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaClock className="text-lime-green text-xl" />
              </div>
              <h4 className="font-semibold text-deep-teal mb-2">Persiapan</h4>
              <p className="text-sm text-dark-grey-text/70">
                Tim kami akan mempersiapkan pesanan Anda dengan fresh ingredients
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-lime-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTruck className="text-lime-green text-xl" />
              </div>
              <h4 className="font-semibold text-deep-teal mb-2">Pengiriman</h4>
              <p className="text-sm text-dark-grey-text/70">
                Kurir akan menghubungi Anda sebelum pengiriman
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu" 
              className="bg-lime-green text-white font-bold py-4 px-8 rounded-xl hover:bg-lime-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <FaCheckCircle />
              Pesan Lagi
            </Link>
            <Link 
              href="/" 
              className="bg-white border-2 border-deep-teal text-deep-teal font-medium py-4 px-8 rounded-xl hover:bg-deep-teal hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Kembali ke Beranda
            </Link>
          </div>
          
          {/* Customer Support */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-dark-grey-text mb-2">
              <strong>Butuh bantuan?</strong> Tim customer service kami siap membantu
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <a href="tel:+6281234567890" className="text-lime-green hover:underline">
                📞 0812-3456-7890
              </a>
              <span className="hidden sm:inline text-gray-400">|</span>
              <a href="mailto:support@freshsalad.id" className="text-lime-green hover:underline">
                ✉️ support@freshsalad.id
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}