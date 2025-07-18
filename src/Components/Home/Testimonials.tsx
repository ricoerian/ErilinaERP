import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

interface Testimonial { avatar: string; quote: string; name: string; }
const TESTIMONIALS: Testimonial[] = [
  {
    avatar: 'https://i.pravatar.cc/80?img=1',
    quote: 'EriLinaERP telah mengubah cara kami mengelola inventaris, sangat efisien!”',
    name: 'Budi Santoso, CEO PT. Makmur',
  },
  {
    avatar: 'https://i.pravatar.cc/80?img=2',
    quote: '“Laporan real-time membantu kami mengambil keputusan lebih cepat.”',
    name: 'Siti Aisyah, CFO PT. Sejahtera',
  },
  {
    avatar: 'https://i.pravatar.cc/80?img=3',
    quote: '“Integrasi modul sangat mudah dan fleksibel sesuai kebutuhan.”',
    name: 'Andi Wijaya, COO PT. Berkah',
  },
  {
    avatar: 'https://i.pravatar.cc/80?img=4',
    quote: '“Tim support sangat responsif dan membantu setiap masalah.”',
    name: 'Rina Dewi, CTO PT. Mahir',
  },
  {
    avatar: 'https://i.pravatar.cc/80?img=5',
    quote: '“Solusi ini meningkatkan produktivitas tim kami hingga 40%.”',
    name: 'Joko Prabowo, Manager TI PT. Fokus',
  },
  {
    avatar: 'https://i.pravatar.cc/80?img=6',
    quote: '“Implementasi lancar tanpa downtime, rekomendasi untuk siapa saja.”',
    name: 'Lisa Kartika, VP Engineering PT. Amanah',
  },
];

export const TestimonialSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [scrollWidth, setScrollWidth] = useState(0);
  const SPEED_PX_PER_SEC = 80;

  useEffect(() => {
    if (containerRef.current) {
      const total = containerRef.current.scrollWidth;
      setScrollWidth(total / 2);
      const duration = (total / 2) / SPEED_PX_PER_SEC;
      controls.start({ x: -total / 2, transition: { repeat: Infinity, ease: 'linear', duration } });
    }
  }, [controls]);

  const handleMouseEnter = () => controls.stop();
  const handleMouseLeave = () => {
    const duration = scrollWidth / SPEED_PX_PER_SEC;
    controls.start({ x: -scrollWidth, transition: { repeat: Infinity, ease: 'linear', duration } });
  };

  return (
    <section aria-labelledby="testimonials-title" className="py-20 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 id="testimonials-title" className="text-5xl font-extrabold mb-12 text-gray-900">
          Apa Kata Klien Kami
        </h2>
        <div
          className="relative overflow-x-hidden overflow-y-visible px-4 py-8"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-gray-50 pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-gray-50 pointer-events-none z-10" />

          <motion.div
            ref={containerRef}
            className="flex space-x-8 items-start"
            animate={controls}
            style={{ willChange: 'transform' }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-72 md:w-80 p-6 bg-white border border-gray-200 rounded-2xl shadow-md transform transition-transform hover:scale-105"
              >
                {/* Avatar Profile */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 mx-0.5" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">{t.quote}</p>
                <h4 className="font-semibold text-gray-900">{t.name}</h4>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
