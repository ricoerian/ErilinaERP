import React from 'react';
import { motion } from 'framer-motion';
import { BrandInstagram, BrandTwitter, BrandGithub } from 'tabler-icons-react';

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/contact', label: 'Contact' },
];

export const Footer: React.FC = () => (
  <motion.footer
    className="py-12 bg-white"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    aria-label="Footer"
  >
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-6 md:mb-0 text-center md:text-left">
        <p className="text-2xl font-bold text-gray-900"><span className='text-[#FFDE59]'>Eri</span><span className='text-[#4CB4F0]'>Lina</span>ERP</p>
        <p className="text-gray-500">© 2025 EriLinaERP. All rights reserved.</p>
      </div>
      <nav className="flex space-x-6 mb-6 md:mb-0">
        {LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex space-x-4">
        <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors"><BrandInstagram size={24} /></a>
        <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition-colors"><BrandTwitter size={24} /></a>
        <a href="#" aria-label="GitHub" className="hover:text-gray-800 transition-colors"><BrandGithub size={24} /></a>
      </div>
    </div>
  </motion.footer>
);