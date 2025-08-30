"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaCreditCard, FaTruck, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { payWithMidtrans, loadMidtransScript } from '@/lib/midtrans';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';

export default function CartPage() {
  const { data: session } = useSession();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMidtransReady, setIsMidtransReady] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    notes: '',
  });

  // Load Midtrans script on component mount
  useEffect(() => {
    loadMidtransScript()
      .then(() => {
        setIsMidtransReady(true);
        console.log('Midtrans script loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load Midtrans script:', error);
      });
  }, []);

  const { subtotal, deliveryFee, total } = useMemo(() => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 10000 : 0;
    return {
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee
    };
  }, [items]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeItem(id);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    // Show removal feedback
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg';
    toast.textContent = 'Item dihapus dari keranjang';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address'];
    return required.every(field => {
      const value = customerDetails[field as keyof typeof customerDetails]?.trim();
      return value && value.length > 0;
    });
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      alert("Mohon lengkapi semua data yang diperlukan!");
      return;
    }

    if (!isMidtransReady) {
      alert("Sistem pembayaran belum siap. Mohon tunggu sebentar dan coba lagi.");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          notes: customerDetails.notes,
        },
      };

      console.log('Creating transaction with data:', orderData);

      // Call API to create transaction
      const response = await fetch('/api/orders/create-transaction', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      console.log('Transaction created successfully:', data);

      if (!data.transactionToken) {
        throw new Error('No transaction token received from server');
      }

      // Process payment with Midtrans
      await payWithMidtrans(data.transactionToken, {
        onSuccess: (result) => {
          console.log('Payment successful:', result);
          clearCart();
          window.location.href = `/order-success?order_id=${result.order_id}&transaction_id=${result.transaction_id}`;
        },
        onPending: (result) => {
          console.log('Payment pending:', result);
          window.location.href = `/order-pending?order_id=${result.order_id}&transaction_id=${result.transaction_id}`;
        },
        onError: (result) => {
          console.error('Payment error:', result);
          alert(`Pembayaran gagal: ${result.status_message || 'Terjadi kesalahan sistem'}`);
        },
        onClose: () => {
          console.log('Payment popup closed');
          // Don't show alert, user might want to try different payment method
        }
      });

    } catch (error) {
      console.error("Error during checkout:", error);
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          alert("Koneksi bermasalah. Mohon periksa internet Anda dan coba lagi.");
        } else if (error.message.includes('salad')) {
          alert("Ada masalah dengan item di keranjang. Mohon refresh halaman dan coba lagi.");
        } else {
          alert(`Terjadi kesalahan: ${error.message}`);
        }
      } else {
        alert("Terjadi kesalahan tidak diketahui. Mohon coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-soft-grey">
        <AppHeader />
        <div className="flex flex-col justify-center items-center py-16 sm:py-24">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl sm:text-8xl mb-6">🛒</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-grey-text mb-4">
              Keranjang Anda Kosong
            </h1>
            <p className="text-dark-grey-text/70 mb-6 sm:mb-8">
              Sepertinya Anda belum menambahkan salad apapun. Mari jelajahi menu lezat kami!
            </p>
            <Link 
              href="/menu" 
              className="btn btn-primary px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center gap-3"
            >
              <FaShoppingBag />
              Mulai Belanja
            </Link>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-grey">
      <AppHeader />
      
      <main className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <Link
              href="/menu"
              className="p-2 rounded-lg text-dark-grey-text hover:text-lime-green hover:bg-lime-green/10 transition-all duration-300"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-teal">
                {currentStep === 1 ? 'Keranjang Belanja' : 'Checkout'}
              </h1>
              <p className="text-dark-grey-text/70">
                {totalItems} item • Total: Rp {total.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4 sm:space-x-8">
                <div className={`flex items-center gap-2 sm:gap-3 ${currentStep >= 1 ? 'text-lime-green' : 'text-dark-grey-text/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 1 ? 'bg-lime-green text-white' : 'bg-soft-grey text-dark-grey-text'
                  }`}>
                    1
                  </div>
                  <span className="hidden sm:inline font-medium">Keranjang</span>
                </div>
                <div className="w-8 sm:w-16 h-0.5 bg-soft-grey">
                  <div 
                    className={`h-full transition-all duration-500 ${currentStep >= 2 ? 'bg-lime-green' : 'bg-transparent'}`}
                  />
                </div>
                <div className={`flex items-center gap-2 sm:gap-3 ${currentStep >= 2 ? 'text-lime-green' : 'text-dark-grey-text/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 2 ? 'bg-lime-green text-white' : 'bg-soft-grey text-dark-grey-text'
                  }`}>
                    2
                  </div>
                  <span className="hidden sm:inline font-medium">Checkout</span>
                </div>
              </div>
            </div>
          </div>

          {currentStep === 1 ? (
            // STEP 1: CART ITEMS
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-soft-grey">
                    <h2 className="text-lg sm:text-xl font-bold text-deep-teal">Item Pesanan</h2>
                  </div>
                  
                  <div className="divide-y divide-soft-grey">
                    {items.map(item => (
                      <div key={item.id} className="p-4 sm:p-6 group hover:bg-soft-grey/50 transition-colors duration-300">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex gap-4 sm:flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-soft-grey rounded-lg flex-shrink-0">
                              <img 
                                src={item.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop&crop=center"}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-deep-teal mb-1 line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-sm sm:text-base text-lime-green font-semibold">
                                Rp {item.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="flex items-center bg-soft-grey rounded-full px-1">
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="p-2 text-deep-teal hover:text-lime-green transition-colors duration-300"
                              >
                                <FaMinus className="text-sm" />
                              </button>
                              <span className="mx-3 sm:mx-4 font-semibold text-dark-grey-text min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="p-2 text-deep-teal hover:text-lime-green transition-colors duration-300"
                              >
                                <FaPlus className="text-sm" />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-soft-grey/50 flex justify-between items-center">
                          <span className="text-sm text-dark-grey-text/70">Subtotal</span>
                          <span className="font-bold text-dark-grey-text">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24">
                  <h2 className="text-lg sm:text-xl font-bold text-deep-teal mb-4 sm:mb-6">
                    Ringkasan Pesanan
                  </h2>
                  
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-dark-grey-text">Subtotal ({totalItems} item)</span>
                      <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-grey-text">Biaya Pengiriman</span>
                      <span className="font-semibold">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-soft-grey">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-dark-grey-text">Total</span>
                        <span className="text-xl sm:text-2xl font-extrabold text-lime-green">
                          Rp {total.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-lime-green/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-lime-green" />
                      <span className="font-semibold text-deep-teal">Pengiriman Cepat</span>
                    </div>
                    <p className="text-sm text-dark-grey-text/80">
                      Estimasi 30-60 menit • Gratis ongkir untuk pembelian di atas Rp 100.000
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!isMidtransReady}
                    className={`w-full btn btn-primary py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-3 ${
                      !isMidtransReady ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {!isMidtransReady ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Memuat Sistem Pembayaran...
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        Lanjut ke Checkout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // STEP 2: CHECKOUT FORM
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Details */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-deep-teal mb-4 sm:mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-lime-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Data Pengiriman
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="form-group">
                      <label className="block text-sm font-semibold text-dark-grey-text mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-lime-green focus:border-lime-green transition-all duration-300"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-semibold text-dark-grey-text mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-lime-green focus:border-lime-green transition-all duration-300"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-semibold text-dark-grey-text mb-2">
                        No. Telepon *
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-lime-green focus:border-lime-green transition-all duration-300"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                        placeholder="081234567890"
                        required
                      />
                    </div>
                    
                    <div className="form-group sm:col-span-2">
                      <label className="block text-sm font-semibold text-dark-grey-text mb-2">
                        Alamat Lengkap *
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-lime-green focus:border-lime-green transition-all duration-300"
                        rows={3}
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                        placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                        required
                      />
                    </div>
                    
                    <div className="form-group sm:col-span-2">
                      <label className="block text-sm font-semibold text-dark-grey-text mb-2">
                        Catatan Tambahan (Opsional)
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-soft-grey rounded-lg focus:ring-2 focus:ring-lime-green focus:border-lime-green transition-all duration-300"
                        rows={2}
                        value={customerDetails.notes}
                        onChange={(e) => setCustomerDetails({...customerDetails, notes: e.target.value})}
                        placeholder="Instruksi khusus untuk kurir..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-deep-teal mb-4 sm:mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-lime-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    Metode Pembayaran
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="p-4 border-2 border-lime-green bg-lime-green/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          defaultChecked
                          className="w-4 h-4 text-lime-green"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FaCreditCard className="text-lime-green" />
                            <span className="font-semibold">Midtrans Payment Gateway</span>
                          </div>
                          <p className="text-sm text-dark-grey-text/70">
                            Kartu Kredit, Debit, E-wallet (GoPay, OVO, DANA, ShopeePay), Virtual Account (BCA, BNI, BRI), QRIS
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-soft-grey rounded-lg opacity-60">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          disabled
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">Cash on Delivery</span>
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                              Coming Soon
                            </span>
                          </div>
                          <p className="text-sm text-dark-grey-text/70">
                            Bayar langsung saat pesanan tiba
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                    <FaLock className="text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-blue-700 font-medium mb-1">Pembayaran 100% Aman</p>
                      <p className="text-blue-600">
                        Dienkripsi dengan SSL dan diverifikasi oleh Midtrans
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24">
                  <h2 className="text-lg sm:text-xl font-bold text-deep-teal mb-4 sm:mb-6">
                    Konfirmasi Pesanan
                  </h2>
                  
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-semibold text-dark-grey-text mb-3">Items ({totalItems})</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="flex-1 line-clamp-1">{item.quantity}x {item.name}</span>
                          <span className="font-semibold ml-2">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 pb-4 border-b border-soft-grey">
                    <div className="flex justify-between">
                      <span className="text-dark-grey-text">Subtotal</span>
                      <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-grey-text">Biaya Pengiriman</span>
                      <span className="font-semibold">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-dark-grey-text">Total Pembayaran</span>
                      <span className="text-lime-green">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="mb-6 p-3 bg-lime-green/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-lime-green" />
                      <span className="font-semibold text-deep-teal">Estimasi Pengiriman</span>
                    </div>
                    <p className="text-sm text-dark-grey-text">
                      30-60 menit setelah pembayaran dikonfirmasi
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isLoading || !validateForm() || !isMidtransReady}
                      className={`w-full py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-3 rounded-lg font-bold transition-all duration-300 ${
                        isLoading || !validateForm() || !isMidtransReady
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-lime-green text-white hover:bg-lime-600 hover:shadow-lg transform hover:scale-[1.02]'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Memproses Pembayaran...
                        </>
                      ) : !isMidtransReady ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Memuat Sistem Pembayaran...
                        </>
                      ) : (
                        <>
                          <FaLock />
                          Bayar Sekarang
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setCurrentStep(1)}
                      disabled={isLoading}
                      className="w-full py-2 sm:py-3 text-sm sm:text-base border-2 border-deep-teal text-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-all duration-300"
                    >
                      Kembali ke Keranjang
                    </button>
                  </div>

                  {/* Form Validation Hints */}
                  {!validateForm() && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        <strong>Mohon lengkapi:</strong> Semua field yang bertanda * wajib diisi
                      </p>
                    </div>
                  )}

                  {/* Midtrans Loading Status */}
                  {!isMidtransReady && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        <strong>Memuat sistem pembayaran...</strong> Mohon tunggu sebentar
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security & Trust Badges */}
          {/* Security & Trust Badges */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <FaLock className="text-green-500" />
                <span className="text-sm font-medium text-dark-grey-text">
                  SSL Encrypted
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <img 
                  src="https://midtrans.com/assets/images/main/midtrans-logo.svg" 
                  alt="Midtrans" 
                  className="h-4"
                />
                <span className="text-sm font-medium text-dark-grey-text">
                  Powered by Midtrans
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};