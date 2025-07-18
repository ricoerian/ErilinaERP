import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section
      aria-label="Hero Section"
      className="relative bg-white overflow-hidden min-h-[calc(100vh-6rem)]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 h-full flex flex-col-reverse md:flex-row items-center">

        {/* TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Optimalkan Bisnis Anda dengan{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300">
              Eri
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
              Lina
            </span>
            ERP
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-prose">
          <span className="bg-clip-text text-transparent bg-yellow-400">Eri</span><span className="bg-clip-text text-transparent bg-blue-400">Lina</span>ERP adalah ERP berbasis cloud dengan model berlangganan per modul & per pengguna aktifkan hanya fitur yang Anda butuhkan, skala mudah, dan keamanan terjamin.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-lg bg-gradient-to-r from-blue-400 to-blue-300 text-white font-semibold cursor-pointer"
            >
              Mulai Sekarang
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-lg border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-white transition cursor-pointer"
            >
              Pelajari Lebih Lanjut
            </motion.button>
          </div>
        </motion.div>

        {/* IMAGE CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center md:justify-end"
        >
          <img
            src="/Hero.png"
            alt="Ilustrasi EriLina ERP"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
