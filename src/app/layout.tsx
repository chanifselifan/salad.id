import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Salad.id',
  description: 'Your daily dose of fresh salad.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/*
          Script Midtrans Snap
          Kita menggunakan next/script dengan strategy="afterInteractive"
          agar script dimuat setelah halaman interaktif dan tidak memblokir render.
        */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="YOUR_MIDTRANS_CLIENT_KEY" // Ganti dengan Client Key Anda
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
