import Link from 'next/link';
import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-[#00796B] text-[#FFFFFF] p-4 flex justify-between items-center shadow-md">
      {/* Logo / Nama Aplikasi */}
      <Link href="/" className="text-2xl font-bold tracking-wide">
        Salad.id
      </Link>

      {/* Navigasi Utama */}
      <nav className="flex items-center space-x-6">
        <Link href="/menu" className="hover:text-[#8BC34A] transition-colors duration-200">
          Menu
        </Link>
        <Link href="/locations" className="hover:text-[#8BC34A] transition-colors duration-200">
          Lokasi
        </Link>
        <Link href="/catering" className="hover:text-[#8BC34A] transition-colors duration-200">
          Catering
        </Link>
      </nav>

      {/* Tombol Aksi */}
      <Link
        href="/order"
        className="bg-[#8BC34A] text-[#263238] px-6 py-2 rounded-full font-semibold hover:bg-[#689F38] transition-colors duration-200"
      >
        Order Now
      </Link>
    </header>
  );
};

export default AppHeader;
