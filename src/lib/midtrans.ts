declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: any) => void;
    };
  }
}


export const payWithMidtrans = (transactionToken: string) => {
  // Pastikan window.snap sudah tersedia sebelum memanggilnya
  if (typeof window !== 'undefined' && window.snap) {
    window.snap.pay(transactionToken, {
      onSuccess: function(result: any){
        // Callback saat pembayaran berhasil
        console.log('Pembayaran Berhasil:', result);
        alert('Pembayaran Berhasil! Cek di console log untuk detail.');
        // TODO: Redirect user to an order success page or update order status in UI
        // Contoh: router.push('/order-status?status=success&orderId=' + result.order_id);
      },
      onPending: function(result: any){
        // Callback saat pembayaran tertunda (menunggu pembayaran)
        console.log('Pembayaran Tertunda:', result);
        alert('Pembayaran Tertunda! Silakan selesaikan pembayaran.');
        // TODO: Redirect user to a pending order page
        // Contoh: router.push('/order-status?status=pending&orderId=' + result.order_id);
      },
      onError: function(result: any){
        // Callback saat terjadi error pembayaran
        console.log('Pembayaran Error:', result);
        alert('Terjadi error saat pembayaran.');
        // TODO: Handle error, maybe show a retry option or redirect to error page
      },
      onClose: function(){
        // Callback saat pop-up pembayaran ditutup oleh user tanpa menyelesaikan pembayaran
        console.log('Pop-up pembayaran ditutup tanpa menyelesaikan pembayaran.');
        alert('Anda menutup pop-up pembayaran tanpa menyelesaikan transaksi.');
        // TODO: Inform user, maybe offer to try again
      }
    });
  } else {
    // Jika window.snap belum tersedia, ini berarti script belum dimuat.
    // Ini bisa terjadi jika ada masalah jaringan atau next/script belum selesai memuat.
    console.error("Midtrans Snap script not loaded or window object is undefined.");
    alert("Maaf, terjadi kesalahan saat memuat halaman pembayaran. Mohon coba lagi.");
  }
};
