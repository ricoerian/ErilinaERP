import React from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const FEATURES = [
  {
    icon: <CogIcon className="w-10 h-10 text-blue-500" aria-hidden="true" />,
    title: 'Customizable',
    description: 'Sesuaikan modul sesuai kebutuhan bisnis Anda.',
  },
  {
    icon: <ChartBarIcon className="w-10 h-10 text-green-500" aria-hidden="true" />,
    title: 'Analytics',
    description: 'Dapatkan laporan real-time untuk pengambilan keputusan.',
  },
  {
    icon: <UsersIcon className="w-10 h-10 text-yellow-500" aria-hidden="true" />,
    title: 'User Management',
    description: 'Kelola peran dan akses tim dengan mudah.',
  },
  {
    icon: <ShieldCheckIcon className="w-10 h-10 text-red-500" aria-hidden="true" />,
    title: 'Security',
    description: 'Keamanan data tingkat enterprise untuk perlindungan maksimal.',
  },
];

export const FeatureSection: React.FC = () => (
  <section aria-labelledby="features-title" className="py-20 bg-gray-50">
    <div className="container mx-auto px-6 text-center">
      <motion.h2
        id="features-title"
        className="text-5xl font-extrabold mb-12 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Fitur Unggulan
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((item, idx) => (
          <motion.div
            key={idx}
            className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            role="group"
            aria-labelledby={`feature-${idx}-title`}
          >
            <div className="mb-4 !mx-auto flex justify-center">
              {item.icon}
            </div>
            <h3 id={`feature-${idx}-title`} className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-600">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);