import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import NextAuthProvider from '@/components/providers/SessionProvider';
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
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="YOUR_MIDTRANS_CLIENT_KEY" // Ganti dengan Client Key Anda
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
