import React from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const STATS = [
  {
    icon: <UsersIcon className="w-10 h-10 text-blue-500" aria-hidden="true" />,
    label: 'Pengguna Aktif',
    value: '5.000+',
    description: 'Dari seluruh cabang global.',
  },
  {
    icon: <CheckCircleIcon className="w-10 h-10 text-green-500" aria-hidden="true" />,
    label: 'Proyek Selesai',
    value: '1.200+',
    description: 'Implementasi ERP sukses untuk klien kami.',
  },
  {
    icon: <ClockIcon className="w-10 h-10 text-red-500" aria-hidden="true" />,
    label: 'Uptime Sistem',
    value: '99.9%',
    description: 'Ketersediaan layanan tahunan.',
  },
];

export const StatsSection: React.FC = () => {
  // Format bulan & tahun sekarang untuk subtitle
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
  const subtitle = `Data terkini per ${formatter.format(now)}`;

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-bold mb-2 text-gray-800"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Statistik Kami
        </motion.h2>
        <p className="text-gray-600 mb-12">{subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            >
              <div className="mb-4 flex justify-center">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-lg font-medium text-gray-700 mt-1 mb-2">{stat.label}</div>
              <p className="text-gray-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
