// src/Pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-6xl md:text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">Halaman Tidak Ditemukan</h2>
        <p className="mt-4 text-gray-600">
          Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
