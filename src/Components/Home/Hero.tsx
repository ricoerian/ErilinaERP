import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section
      aria-label="Hero Section"
      className="relative bg-white overflow-hidden flex items-center min-h-[calc(100vh-5rem)]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col-reverse md:flex-row items-center justify-center md:justify-between">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-black">
            Optimize Your Business with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300">
              Eri
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
              Lina
            </span>
            ERP
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-prose">
            <span className="bg-clip-text text-transparent bg-yellow-400">Eri</span>
            <span className="bg-clip-text text-transparent bg-blue-400">Lina</span>
            ERP is a cloud-based ERP with a module and user based subscription model activate only the features you need, scale easily, and enjoy robust security.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a href="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-lg bg-gradient-to-r from-blue-400 to-blue-300 text-white font-semibold cursor-pointer"
              >
                Order Now
              </motion.button>
            </a>

            <a href="/company">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-lg border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-white transition cursor-pointer"
              >
                Learn More
              </motion.button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="hidden md:flex w-full md:w-1/2 mb-8 md:mb-0 justify-center md:justify-end"
        >
          <img
            src="/Hero.png"
            alt="EriLina ERP Illustration"
            className="h-auto sm:h-[20rem] md:h-[32rem] w-auto md:max-w-md lg:max-w-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
