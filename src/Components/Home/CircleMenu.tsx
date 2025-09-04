import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useViewportScroll, useTransform } from 'framer-motion';

interface Module {
  id: string;
  label: string;
  title: string;
  description: string;
}

const modules: Module[] = [
  { id: 'scm', label: 'SCM', title: 'Supply Chain Management', description: 'Manage the flow of materials and products, monitor inventory, and track shipments for cost efficiency.' },
  { id: 'fm',  label: 'FM', title: 'Financial Management',  description: 'Handle accounting, reporting, and cash flow for strategic decision-making.' },
  { id: 'm',   label: 'M', title: 'Manufacturing',   description: 'Support production planning, BOM management, and real-time quality control.' },
  { id: 'iot', label: 'IoT', title: 'Internet of Things', description: 'Connect devices with sensors and predictive analytics to prevent downtime.' },
  { id: 'pm',  label: 'PM', title: 'Project Management',  description: 'Plan and monitor projects with scheduling, resource allocation, and milestones.' },
  { id: 'crm', label: 'CRM', title: 'Customer Relationship Management', description: 'Unify customer data, contact management, and sales interaction tracking.' },
  { id: 'sm',  label: 'SM', title: 'Sales Management',  description: 'Manage leads, pipelines, quotas, and sales team performance reports.' },
  { id: 's&m', label: 'S&M', title: 'Service & Maintenance', description: 'Schedule asset maintenance, work orders, and service history to minimize downtime.' },
  { id: 'hrm', label: 'HRM', title: 'Human Resource Management', description: 'Recruitment, attendance, leave management, and payroll in one integrated platform.' },
  { id: 'am',  label: 'AM', title: 'Asset Management',  description: 'Track asset lifecycle from acquisition to depreciation and disposal.' },
  { id: 'bi',  label: 'BI', title: 'Business Intelligence',  description: 'Real-time dashboards and reports for deep business insights.' },
  { id: 'bda', label: 'BDA', title: 'Big Data Analytics', description: 'Leverage big data analytics and machine learning for business predictions.' }
];

const RADIUS = 170;
const CENTER_SIZE = 220;
const BOX_SIZE = RADIUS * 2 + CENTER_SIZE;

const CircleMenu: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [showModules, setShowModules] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // 1. get scrollY
  const { scrollY } = useViewportScroll();
  // 2. map scrollY 0–500px to backgroundPositionY 0 to -200px
  const bgY = useTransform(scrollY, [0, 500], [0, -200]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActive(null);
        setShowModules(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.div
      className="flex-1 flex justify-center min-h-screen max-h-screen items-center bg-cover bg-center p-4 relative"
      style={{
        backgroundImage: "url('/ERP.png')",
        // 3. apply transform
        backgroundPositionY: bgY,
      }}
    >
      <div className="absolute inset-0 bg-gray-800/50 pointer-events-none" />

      <div ref={containerRef} className="relative z-10" style={{ width: BOX_SIZE, height: BOX_SIZE }}>
        {/* Center ERP */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ width: CENTER_SIZE, height: CENTER_SIZE }}
          onClick={e => { e.stopPropagation(); setShowModules(prev => !prev); }}
        >
          <div className="w-full h-full rounded-full bg-blue-400 shadow-xl flex justify-center items-center">
            <span className="text-8xl font-extrabold text-yellow-300">ERP</span>
          </div>
        </div>

        <AnimatePresence>
          {showModules && modules.map((mod, idx) => {
            const angle = (idx / modules.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * RADIUS;
            const y = Math.sin(angle) * RADIUS;
            const isActive = active === mod.id;

            const isTop = angle < -Math.PI/4 && angle > -Math.PI*3/4;
            const isBottom = angle > Math.PI/4 && angle < Math.PI*3/4;
            const isRight = !isTop && !isBottom && angle >= -Math.PI/4 && angle <= Math.PI/4;
            const isLeft = !isTop && !isBottom && !isRight;

            let popClass = 'absolute bg-white p-3 rounded-xl shadow-lg text-sm w-72 text-justify z-20 ';
            let arrowClass = 'absolute bg-white shadow-lg w-4 h-4 ';

            if (isTop) {
              popClass += 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
              arrowClass += 'rotate-45 top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2';
            } else if (isBottom) {
              popClass += 'top-full left-1/2 transform -translate-x-1/2 mt-2';
              arrowClass += 'rotate-45 bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2';
            } else if (isRight) {
              popClass += 'left-full top-1/2 transform -translate-y-1/2 ml-2';
              arrowClass += 'rotate-45 left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2';
            } else if (isLeft) {
              popClass += 'right-full top-1/2 transform -translate-y-1/2 mr-2';
              arrowClass += 'rotate-45 right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2';
            }

            return (
              <motion.div
                key={mod.id}
                className="absolute top-1/2 left-1/2"
                initial={{
                  transform: 'translate(-50%, -50%) translate(0px, 0px)',
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  opacity: 1,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 200, damping: 20 }
                }}
                exit={{
                  transform: 'translate(-50%, -50%) translate(0px, 0px)',
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 0.3 }
                }}
                onMouseEnter={() => !isMobile && setActive(mod.id)}
                onMouseLeave={() => !isMobile && setActive(null)}
                onClick={() => isMobile && setActive(prev => (prev === mod.id ? null : mod.id))}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-yellow-300 border-4 border-blue-400 flex items-center justify-center shadow-md cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  animate={isActive ? { scale: 1.2, backgroundColor: '#50A2FF', borderColor: '#FFDF20' } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="font-bold text-lg text-gray-800">{mod.label}</span>
                </motion.div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={popClass}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="font-semibold text-gray-900 mb-1">{mod.title}</div>
                      <div className="text-xs text-gray-600">{mod.description}</div>
                      <div className={arrowClass} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CircleMenu;
