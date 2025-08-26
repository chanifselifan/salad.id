"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaCreditCard, FaTruck, FaLock, FaArrowLeft } from 'react-icons/fa';
import { payWithMidtrans } from '@/lib/midtrans';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';

export default function CartPage() {
  const { data: session } = useSession();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart, 2: Checkout
  const [customerDetails, setCustomerDetails] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    notes: '',
  });

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
    toast.className = 'fixed top-24 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in';
    toast.textContent = 'Item dihapus dari keranjang';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address'];
    return required.every(field => customerDetails[field as keyof typeof customerDetails]?.trim());
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      alert("Mohon lengkapi semua data yang diperlukan!");
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
        totalAmount: subtotal,
        customerDetails,
      };

      const response = await fetch('/api/orders/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

          {/* Progress Steps - Mobile Responsive */}
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
                          {/* Mobile: Image + Info */}
                          <div className="flex gap-4 sm:flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-soft-grey rounded-lg flex-shrink-0">
                              <img 
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop&crop=center"
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

                          {/* Quantity Controls + Remove */}
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
                        
                        {/* Item Total */}
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

                  {/* Delivery Info */}
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
                    className="w-full btn btn-primary py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-3"
                  >
                    <FaCreditCard />
                    Lanjut ke Checkout
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
                      <label className="form-label">Nama Lengkap *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">No. Telepon *</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                        placeholder="081234567890"
                      />
                    </div>
                    
                    <div className="form-group sm:col-span-2">
                      <label className="form-label">Alamat Lengkap *</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                        placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                      />
                    </div>
                    
                    <div className="form-group sm:col-span-2">
                      <label className="form-label">Catatan Tambahan (Opsional)</label>
                      <textarea
                        className="form-input"
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
                            <span className="font-semibold">Payment Gateway</span>
                          </div>
                          <p className="text-sm text-dark-grey-text/70">
                            Kartu Kredit, Debit, E-wallet (GoPay, OVO, DANA), Virtual Account
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
                    <p className="text-sm text-blue-700">
                      Pembayaran Anda aman dan dienkripsi dengan teknologi SSL
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary & Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24">
                  <h2 className="text-lg sm:text-xl font-bold text-deep-teal mb-4 sm:mb-6">
                    Konfirmasi Pesanan
                  </h2>
                  
                  {/* Order Items Summary */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-semibold text-dark-grey-text mb-3">Items ({totalItems})</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="flex-1 line-clamp-1">{item.quantity}x {item.name}</span>
                          <span className="font-semibold">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
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

                  {/* Estimated Delivery */}
                  <div className="mb-6 p-3 bg-lime-green/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-lime-green" />
                      <span className="font-semibold text-deep-teal">Estimasi Pengiriman</span>
                    </div>
                    <p className="text-sm text-dark-grey-text">
                      30-60 menit setelah pembayaran dikonfirmasi
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isLoading || !validateForm()}
                      className={`w-full btn btn-primary py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-3 ${
                        isLoading || !validateForm() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Memproses...
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
                      className="w-full btn btn-outline py-2 sm:py-3 text-sm sm:text-base"
                    >
                      Kembali ke Keranjang
                    </button>
                  </div>

                  {/* Form Validation Hints */}
                  {!validateForm() && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        <strong>Mohon lengkapi:</strong> Semua field yang bertanda * wajib diisi
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Badge */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <FaLock className="text-green-500" />
              <span className="text-sm font-medium text-dark-grey-text">
                Secured by SSL Encryption
              </span>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};