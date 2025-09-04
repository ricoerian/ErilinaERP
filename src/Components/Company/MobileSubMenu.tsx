import React, { useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanyDetails } from '../../Contexts/CompanyContext';
import { Module } from '../../types/moduleAndSubModule';
import { X, ChevronsUp, LayoutDashboard } from 'lucide-react'; // FIX: Menambahkan ikon LayoutDashboard

interface MobileSubMenuProps {
    module: Module;
}

const MobileSubMenu: React.FC<MobileSubMenuProps> = ({ module }) => {
    const { company } = useParams<{ company: string }>();
    const location = useLocation();
    const companyDetails = useCompanyDetails();
    const [isOpen, setIsOpen] = useState(false);
    const primaryColor = companyDetails?.primary_color || '#3b82f6';
    const textColor = '#ffffff';

    const toggleMenu = () => setIsOpen(!isOpen);

    const activeSubmenu = module.submenus?.find(submenu => location.pathname.startsWith(`/${company}${submenu.href}`));

    const menuVariants = {
        closed: { opacity: 0, y: 50, transition: { type: 'spring', stiffness: 400, damping: 40 } },
        open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0 }
    };

    if (!module || !module.submenus || module.submenus.length === 0) {
        return null;
    }

    const MainIcon = module.Icon || ChevronsUp;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMenu}
                        className="fixed inset-0 bg-black/60 z-40"
                    />
                )}
            </AnimatePresence>

            <div className="fixed bottom-6 left-6 z-50">
                <AnimatePresence>
                    {isOpen && (
                        <motion.nav
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="flex flex-col items-start gap-3 mb-4"
                        >
                            {/* FIX: Tombol untuk kembali ke Dashboard */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-3 w-full"
                            >
                                <NavLink
                                    to={`/${company}/dashboard`}
                                    onClick={() => setIsOpen(false)}
                                    className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg bg-gray-600 text-white hover:bg-gray-700"
                                >
                                    <LayoutDashboard size={24} />
                                </NavLink>
                                <span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md">
                                    All Modules
                                </span>
                            </motion.div>

                            {/* Garis pemisah */}
                            <motion.hr
                                variants={itemVariants}
                                className="border-t-2 border-dashed border-gray-300 w-full my-1"
                            />
                            
                            {module.submenus.map((submenu, index) => {
                                const IconComponent = submenu.Icon || ChevronsUp;
                                const isActive = activeSubmenu?.href === submenu.href;

                                return (
                                    <motion.div
                                        key={submenu.name}
                                        variants={itemVariants}
                                        transition={{ delay: (index + 1) * 0.05 }} // Tambah delay agar muncul setelah tombol dashboard
                                        className="flex items-center gap-3"
                                    >
                                        <NavLink
                                            to={`/${company}${submenu.href}`}
                                            onClick={() => setIsOpen(false)}
                                            className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
                                            style={{
                                                backgroundColor: isActive ? primaryColor : '#ffffff',
                                                color: isActive ? textColor : primaryColor,
                                            }}
                                        >
                                            <IconComponent size={24} />
                                        </NavLink>
                                        <span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md">
                                            {submenu.name}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.nav>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMenu}
                    className="h-16 w-16 rounded-full flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: primaryColor, color: textColor }}
                >
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={isOpen ? 'close' : 'open'}
                            initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isOpen ? <X size={30} /> : <MainIcon size={30} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            </div>
        </>
    );
};

export default MobileSubMenu;