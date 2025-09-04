import React from 'react';
import { BrandInstagram, BrandTwitter, BrandLinkedin } from 'tabler-icons-react';

const LINKS = [
  { href: '/company', label: 'Company' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/contact', label: 'Contact' },
];

export const Footer: React.FC = () => (
  <footer className="py-12 bg-white" aria-label="Footer">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-6 md:mb-0 text-center md:text-left">
        <p className="text-2xl font-bold text-gray-900">
          <span className='text-[#FFDE59]'>Eri</span>
          <span className='text-[#4CB4F0]'>Lina</span>ERP
        </p>
        <p className="text-gray-500">
          © 2025 <span className="text-yellow-500">Eri</span>
          <span className="text-blue-500">Lina</span>ERP. All rights reserved.
        </p>
      </div>

      <nav className="flex space-x-6 mb-6 md:mb-0">
        {LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            className="text-gray-600"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex space-x-4">
        <a href="#" aria-label="Instagram" className="text-black"><BrandInstagram size={24} /></a>
        <a href="#" aria-label="Twitter" className="text-black"><BrandTwitter size={24} /></a>
        <a href="#" aria-label="LinkedIn" className="text-black"><BrandLinkedin size={24} /></a>
      </div>
    </div>
  </footer>
);
