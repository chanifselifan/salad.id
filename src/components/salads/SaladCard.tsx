// frontend/src/components/salads/SaladCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SaladCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const SaladCard: React.FC<SaladCardProps> = ({ id, name, description, price, imageUrl }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Gambar Salad */}
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
        />
      </div>
      {/* Detail Salad */}
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          {/* Menggunakan kelas warna dari palet yang terkunci */}
          <h3 className="text-xl font-bold text-deep-teal mb-1">{name}</h3>
          <p className="text-sm text-dark-grey-text mb-3 line-clamp-2">{description}</p>
        </div>
        {/* Harga dan Tombol Aksi */}
        <div className="flex flex-col mt-auto pt-2 border-t border-soft-grey">
          <span className="text-2xl font-extrabold text-lime-green mb-3">
            Rp {price.toLocaleString('id-ID')}
          </span>
          <Link 
            href={`/menu/${id}`} 
            // Menggunakan kelas warna dari palet yang terkunci
            className="bg-lime-green text-white font-bold py-3 px-4 rounded-full text-center hover:bg-lime-600 transition-colors duration-300"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SaladCard;
