declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: any) => void;
    };
  }
}

export function loadMidtransSnap(clientKey: string) {
  if (typeof window !== "undefined") {
    const script = document.createElement("script");
    script.src = "https://app.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    document.body.appendChild(script);
  }
}

export function payWithMidtrans(transactionToken: string) {
  if (typeof window !== 'undefined' && window.snap) {
    window.snap.pay(transactionToken, {
      onSuccess: function(result: any){
        alert("payment success!"); console.log(result);
        // TODO: Redirect to order confirmation page or update order status
      },
      onPending: function(result: any){
        alert("waiting your payment!"); console.log(result);
        // TODO: Redirect to pending payment page
      },
      onError: function(result: any){
        alert("payment failed!"); console.log(result);
        // TODO: Handle error, maybe show a retry option
      },
      onClose: function(){
        alert('you closed the popup without finishing the payment');
      }
    });
  } else {
    console.error("Midtrans Snap.js is not loaded.");
    // Optionally load snap.js dynamically here
    // const script = document.createElement('script');
    // script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    // script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    // document.body.appendChild(script);
    // script.onload = () => payWithMidtrans(transactionToken);
  }
}
