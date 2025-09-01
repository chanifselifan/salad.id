// src/lib/midtrans-client.ts
declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: any) => void;
      embed?: (token: string, options?: any) => void;
    };
  }
}

export interface MidtransCallbacks {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

export interface MidtransResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  fraud_status?: string;
}

export const loadMidtransScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    if (window.snap) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' 
      ? 'https://app.midtrans.com/snap/snap.js' 
      : 'https://app.stg.midtrans.com/snap/snap.js';
    
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    
    script.onload = () => {
      console.log('Midtrans Snap script loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load Midtrans Snap script');
      reject(new Error('Failed to load Midtrans script'));
    };

    document.head.appendChild(script);
  });
};

export const payWithMidtrans = async (
  transactionToken: string, 
  callbacks?: MidtransCallbacks
): Promise<void> => {
  try {
    // Ensure Midtrans script is loaded
    await loadMidtransScript();
    
    if (!window.snap) {
      throw new Error('Midtrans Snap is not available');
    }

    window.snap.pay(transactionToken, {
      onSuccess: function(result: MidtransResult) {
        console.log('Payment Success:', result);
        if (callbacks?.onSuccess) {
          callbacks.onSuccess(result);
        } else {
          // Default success handler
          window.location.href = `/order-success?order_id=${result.order_id}&transaction_id=${result.transaction_id}`;
        }
      },
      
      onPending: function(result: MidtransResult) {
        console.log('Payment Pending:', result);
        if (callbacks?.onPending) {
          callbacks.onPending(result);
        } else {
          // Default pending handler
          window.location.href = `/order-pending?order_id=${result.order_id}&transaction_id=${result.transaction_id}`;
        }
      },
      
      onError: function(result: MidtransResult) {
        console.error('Payment Error:', result);
        if (callbacks?.onError) {
          callbacks.onError(result);
        } else {
          // Default error handler
          alert(`Pembayaran gagal: ${result.status_message || 'Terjadi kesalahan sistem'}`);
        }
      },
      
      onClose: function() {
        console.log('Payment popup closed by user');
        if (callbacks?.onClose) {
          callbacks.onClose();
        }
        // Don't show alert on close as it's user's choice
      }
    });
  } catch (error) {
    console.error('Midtrans payment error:', error);
    if (callbacks?.onError) {
      callbacks.onError({ error: error instanceof Error ? error.message : 'Unknown error' });
    } else {
      alert('Gagal memuat sistem pembayaran. Mohon refresh halaman dan coba lagi.');
    }
  }
};

// Embed payment form directly in page
export const embedMidtransPayment = async (
  containerId: string,
  transactionToken: string,
  callbacks?: MidtransCallbacks
): Promise<void> => {
  try {
    await loadMidtransScript();
    
    if (!window.snap) {
      throw new Error('Midtrans Snap is not available');
    }

    // Type guard to satisfy TypeScript
    if (typeof window.snap.embed === 'function') {
      window.snap.embed(transactionToken, {
        embedId: containerId,
        onSuccess: callbacks?.onSuccess,
        onPending: callbacks?.onPending,
        onError: callbacks?.onError,
        onClose: callbacks?.onClose,
      });
    } else {
      throw new Error('Midtrans Snap embed function is not available');
    }
  } catch (error) {
    console.error('Midtrans embed error:', error);
    throw error;
  }
};

// Utility function to format order data for Midtrans
export const formatMidtransOrderData = (order: {
  orderNumber: string;
  totalAmount: number;
  deliveryFee: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  const itemDetails = [
    ...order.items.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
      category: 'Food',
      merchant_name: 'Fresh Salad Store'
    })),
  ];

  // Add delivery fee if applicable
  if (order.deliveryFee > 0) {
    itemDetails.push({
      id: 'delivery-fee',
      price: order.deliveryFee,
      quantity: 1,
      name: 'Biaya Pengiriman',
      category: 'Service',
      merchant_name: 'Fresh Salad Store'
    });
  }

  const grossAmount = order.totalAmount + order.deliveryFee;

  return {
    transaction_details: {
      order_id: order.orderNumber,
      gross_amount: grossAmount,
    },
    customer_details: {
      first_name: order.customerDetails.name.split(' ')[0] || 'Customer',
      last_name: order.customerDetails.name.split(' ').slice(1).join(' ') || '',
      email: order.customerDetails.email,
      phone: order.customerDetails.phone,
      billing_address: {
        first_name: order.customerDetails.name.split(' ')[0] || 'Customer',
        last_name: order.customerDetails.name.split(' ').slice(1).join(' ') || '',
        email: order.customerDetails.email,
        phone: order.customerDetails.phone,
        address: order.customerDetails.address || '',
        city: 'Jakarta',
        postal_code: '12345',
        country_code: 'IDN'
      },
      shipping_address: {
        first_name: order.customerDetails.name.split(' ')[0] || 'Customer',
        last_name: order.customerDetails.name.split(' ').slice(1).join(' ') || '',
        email: order.customerDetails.email,
        phone: order.customerDetails.phone,
        address: order.customerDetails.address || '',
        city: 'Jakarta',
        postal_code: '12345',
        country_code: 'IDN'
      }
    },
    item_details: itemDetails,
    enabled_payments: [
      'credit_card', 'bca_va', 'bni_va', 'bri_va', 'cimb_va', 'permata_va', 
      'other_va', 'gopay', 'shopeepay', 'qris'
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success`,
    },
    expiry: {
      start_time: new Date().toISOString().replace(/\.\d{3}Z$/, '+07:00'),
      unit: 'hours',
      duration: 24
    },
    custom_field1: 'Fresh Salad Order',
    custom_field2: 'food_delivery',
    custom_field3: order.customerDetails.address || 'Jakarta'
  };
};