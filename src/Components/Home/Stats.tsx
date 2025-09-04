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
    label: 'Active Users',
    value: '5,000+',
    description: 'Across all global branches.',
  },
  {
    icon: <CheckCircleIcon className="w-10 h-10 text-green-500" aria-hidden="true" />,
    label: 'Projects Completed',
    value: '1,200+',
    description: 'Successful ERP implementations for our clients.',
  },
  {
    icon: <ClockIcon className="w-10 h-10 text-red-500" aria-hidden="true" />,
    label: 'System Uptime',
    value: '99.9%',
    description: 'Annual service availability.',
  },
];

export const StatsSection: React.FC = () => {
  // Format current month & year for subtitle
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
  const subtitle = `Latest data as of ${formatter.format(now)}`;

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-bold mb-2 text-white"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Statistics
        </motion.h2>
        <p className="text-white mb-12">{subtitle}</p>

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
