// src/Pages/ForbiddenPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-6xl md:text-9xl font-bold text-red-600">403</h1>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">Akses Ditolak</h2>
        <p className="mt-4 text-gray-600">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
