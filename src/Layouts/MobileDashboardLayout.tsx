// src/Layouts/MobileDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { MODULES, URL_BECC, URL_BESMCIM, URL_BESMCDM } from '../Utils/Constants';
import MobileSubMenu from '../Components/Company/MobileSubMenu';
import DashboardNavbar from '../Components/Company/DashboardNavbar';

// Import Provider dan Context yang diperlukan
import CompanyContext, { CompanyDetails } from '../Contexts/CompanyContext';
import ExchangeRateContext, { ExchangeRates } from '../Contexts/ExchangeRateContext';
import { NotificationProvider } from '../Components/NotificationProvider';
import SosNotification from '../Components/SosNotification';
import { SosLog } from '../types/delivery';
import { Module } from '../types/moduleAndSubModule'; // FIX: Mengimpor tipe Module

const MobileDashboardLayout: React.FC = () => {
    const location = useLocation();
    const { company } = useParams<{ company: string }>();
    const navigate = useNavigate();
    const [activeModule, setActiveModule] = useState<Module | null>(null); // FIX: Menggunakan tipe Module yang benar

    // State management yang sama seperti di DashboardLayout
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
    const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
    const [loadingRates, setLoadingRates] = useState<boolean>(true);
    const [sosAlerts, setSosAlerts] = useState<SosLog[]>([]);

    const slug = company?.toLowerCase().replace(/\s+/g, '') ?? '';

    useEffect(() => {
        if (!slug) {
            setLoadingCompany(false);
            return;
        }
        (async () => {
            try {
                const res = await fetch(`${URL_BECC}/api/check-company/${slug}/private`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
                if (res.ok) {
                    const data: CompanyDetails = await res.json();
                    setCompanyDetails(data);
                } else {
                    // If company not found or unauthorized, navigate to login
                    if (res.status === 404 || res.status === 401 || res.status === 403) {
                        navigate(`/${slug}/login`, { replace: true });
                    }
                }
            } catch {
                navigate(`/${slug}/login`, { replace: true });
            } finally {
                setLoadingCompany(false);
            }
        })();
    }, [slug, navigate]);

    // FIX: Menambahkan useEffect untuk mengambil data nilai tukar
    useEffect(() => {
        const fetchExchangeRates = async (companyId: number) => {
            setLoadingRates(true);
            try {
                const response = await fetch(`${URL_BESMCIM}/api/companies/${companyId}/exchange-rates?base=USD`, { method: 'GET', headers: { 'Content-Type': 'application/json', }, credentials: 'include' });
                if (!response.ok) throw new Error(`Gagal mengambil nilai tukar: ${response.statusText}`);
                const data: ExchangeRates = await response.json();
                setExchangeRates(data);
            } catch (err) {
                console.error("MobileDashboardLayout: Error mengambil nilai tukar:", err);
            } finally {
                setLoadingRates(false);
            }
        };
        if (companyDetails && companyDetails.id !== 0) {
            fetchExchangeRates(companyDetails.id);
            const intervalId = setInterval(() => fetchExchangeRates(companyDetails.id), 3600000);
            return () => clearInterval(intervalId);
        } else if (!loadingCompany && companyDetails?.id === 0) {
            setLoadingRates(false);
            setExchangeRates({});
        }
    }, [companyDetails, loadingCompany]);
    
    useEffect(() => {
        if (!companyDetails?.id) return;
        const fetchRecentSosLogs = async () => {
            try {
                const res = await fetch(`${URL_BESMCDM}/api/companies/${companyDetails.id}/sos-logs/recent`, { credentials: 'include' });
                if (res.ok) {
                    const newAlerts: SosLog[] = await res.json();
                    if (newAlerts.length > 0) {
                        setSosAlerts(currentAlerts => {
                            const currentIds = new Set(currentAlerts.map(a => a.id));
                            const uniqueNewAlerts = newAlerts.filter(a => !currentIds.has(a.id));
                            return [...currentAlerts, ...uniqueNewAlerts];
                        });
                    }
                }
            } catch (error) {
                console.error("Gagal memeriksa alert SOS:", error);
            }
        };
        fetchRecentSosLogs();
        const intervalId = setInterval(fetchRecentSosLogs, 10000);
        return () => clearInterval(intervalId);
    }, [companyDetails?.id]);

    useEffect(() => {
        const currentPath = location.pathname.replace(`/${company}`, '');
        const module = MODULES.find(m => currentPath.startsWith(m.href) || m.submenus.some(s => currentPath.startsWith(s.href))) as unknown as Module | null;
        setActiveModule(module || null);
    }, [location.pathname, company]);
    
    const dismissAlert = (id: number) => {
        setSosAlerts(alerts => alerts.filter(alert => alert.id !== id));
    };

    // FIX: Memperbarui kondisi loading
    if (loadingCompany || loadingRates || companyDetails === null || exchangeRates === null) {
        return (
            <div className="flex h-screen bg-gray-100 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <CompanyContext.Provider value={companyDetails}>
            <ExchangeRateContext.Provider value={exchangeRates}>
                <NotificationProvider>
                    <div className="flex flex-col h-screen bg-gray-100">
                        <SosNotification alerts={sosAlerts} onDismiss={dismissAlert} />
                        <DashboardNavbar toggleSidebar={() => {}} isSidebarOpen={false} />
                        <main className="flex-grow overflow-y-auto pb-24">
                            <Outlet />
                        </main>
                        {/* FIX: Pengecekan aman sebelum render */}
                        {activeModule && activeModule.submenus && activeModule.submenus.length > 0 && (
                            <MobileSubMenu module={activeModule} />
                        )}
                    </div>
                </NotificationProvider>
            </ExchangeRateContext.Provider>
        </CompanyContext.Provider>
    );
};

export default MobileDashboardLayout;