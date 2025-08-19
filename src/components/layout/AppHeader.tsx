"use client"

import Link from 'next/link';
import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react"

const AppHeader: React.FC = () => {
  const { data: session, status } = useSession()

  return (
    <header className="bg-[#00796B] text-[#FFFFFF] p-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold tracking-wide">
        Salad.id
      </Link>

      <nav className="flex items-center space-x-6">
        <Link href="/menu" className="hover:text-[#8BC34A] transition-colors duration-200">
          Menu
        </Link>
        <Link href="/cart" className="hover:text-[#8BC34A] transition-colors duration-200">
          Keranjang
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        {status === "loading" ? (
          <div>Loading...</div>
        ) : session ? (
          <>
            <span>Hi, {session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-[#8BC34A] text-[#263238] px-6 py-2 rounded-full font-semibold hover:bg-[#689F38] transition-colors duration-200"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
