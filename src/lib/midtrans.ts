declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: any) => void;
    };
  }
}

export interface MidtransCallbacks {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

export const payWithMidtrans = (
  transactionToken: string, 
  callbacks?: MidtransCallbacks
) => {
  if (typeof window !== 'undefined' && window.snap) {
    window.snap.pay(transactionToken, {
      onSuccess: function(result: any) {
        console.log('Pembayaran Berhasil:', result);
        if (callbacks?.onSuccess) {
          callbacks.onSuccess(result);
        } else {
          alert('Pembayaran Berhasil!');
          window.location.href = `/order-success?order_id=${result.order_id}`;
        }
      },
      onPending: function(result: any) {
        console.log('Pembayaran Tertunda:', result);
        if (callbacks?.onPending) {
          callbacks.onPending(result);
        } else {
          alert('Pembayaran Tertunda! Silakan selesaikan pembayaran.');
          window.location.href = `/order-pending?order_id=${result.order_id}`;
        }
      },
      onError: function(result: any) {
        console.log('Pembayaran Error:', result);
        if (callbacks?.onError) {
          callbacks.onError(result);
        } else {
          alert('Terjadi error saat pembayaran.');
        }
      },
      onClose: function() {
        console.log('Pop-up pembayaran ditutup');
        if (callbacks?.onClose) {
          callbacks.onClose();
        } else {
          alert('Anda menutup pop-up pembayaran.');
        }
      }
    });
  } else {
    console.error("Midtrans Snap script not loaded");
    alert("Mohon tunggu, sistem pembayaran sedang dimuat...");
  }
};

// Utility function to format order data for Midtrans
export const createMidtransOrderData = (order: {
  orderId: string;
  amount: number;
  customerDetails: {
    first_name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}) => {
  return {
    transaction_details: {
      order_id: order.orderId,
      gross_amount: order.amount,
    },
    customer_details: order.customerDetails,
    item_details: order.items.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    })),
  };
};