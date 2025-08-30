import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import NextAuthProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

// Read env variables at build time
const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const midtransSnapUrl = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

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
         <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}></script>

       
      </body>

    </html>
  );
}