// src/Layouts/DashboardLayout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../Components/Company/DashboardNavbar';
import DashboardFooter from '../Components/Company/DashboardFooter';
import DashboardSidebar from '../Components/Company/DashboardSidebar';
import CompanyContext, { CompanyDetails } from '../Contexts/CompanyContext';
import ExchangeRateContext, { ExchangeRates } from '../Contexts/ExchangeRateContext';
import ForbiddenPage from '../Pages/ForbiddenPage';
import { URL_BECC, URL_BESMCIM, URL_BESMCDM } from '../Utils/Constants';
import { NotificationProvider } from '../Components/NotificationProvider';
import SosNotification from '../Components/SosNotification';
import { SosLog } from '../types/delivery';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { company } = useParams<{ company: string }>();
  const navigate = useNavigate();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loadingRates, setLoadingRates] = useState<boolean>(true);
  const [sosAlerts, setSosAlerts] = useState<SosLog[]>([]);

  const sidebarWidthOpen = '16rem';
  const sidebarWidthClosed = '5rem';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slug = company?.toLowerCase().replace(/\s+/g, '') ?? '';

  useEffect(() => {
    if (!slug) {
      setLoadingCompany(false);
      setCompanyDetails({ id: 0, name: '', slug: '', logo_url: '', primary_color: '', secondary_color: '', currency_code: '', cover_image_url: '', address: '', contact_email: '', phone: '', timezone: '' });
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${URL_BECC}/api/check-company/${slug}/private`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
        switch (res.status) {
          case 200: {
            const data: CompanyDetails = await res.json();
            setCompanyDetails(data);
            break;
          }
          case 401:
          case 403:
            return <ForbiddenPage />;
          case 404:
            setCompanyDetails({ id: 0, name: '', slug: '', logo_url: '', primary_color: '', secondary_color: '', currency_code: '', cover_image_url: '', address: '', contact_email: '', phone: '', timezone: '' });
            navigate(`/${slug}/login`, { replace: true });
            break;
          default:
            setCompanyDetails({ id: 0, name: '', slug: '', logo_url: '', primary_color: '', secondary_color: '', currency_code: '', cover_image_url: '', address: '', contact_email: '', phone: '', timezone: '' });
        }
      } catch {
        setCompanyDetails({ id: 0, name: '', slug: '', logo_url: '', primary_color: '', secondary_color: '', currency_code: '', cover_image_url: '', address: '', contact_email: '', phone: '', timezone: '' });
        navigate(`/${slug}/login`, { replace: true });
      } finally {
        setLoadingCompany(false);
      }
    })();
  }, [slug, navigate]);

  useEffect(() => {
    const fetchExchangeRates = async (companyId: number) => {
      setLoadingRates(true);
      try {
        const response = await fetch(`${URL_BESMCIM}/api/companies/${companyId}/exchange-rates?base=USD`, { method: 'GET', headers: { 'Content-Type': 'application/json', }, credentials: 'include' });
        if (!response.ok) throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
        const data: ExchangeRates = await response.json();
        setExchangeRates(data);
      } catch (err) {
        console.error("DashboardLayout: Error fetching exchange rates:", err);
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
        console.error("Failed to poll for SOS alerts:", error);
      }
    };
    fetchRecentSosLogs();
    const intervalId = setInterval(fetchRecentSosLogs, 10000);
    return () => clearInterval(intervalId);
  }, [companyDetails?.id]);

  const dismissAlert = (id: number) => {
    setSosAlerts(alerts => alerts.filter(alert => alert.id !== id));
  };

  if (loadingCompany || loadingRates || companyDetails === null || exchangeRates === null) {
    return (
      <div className="flex h-screen bg-gray-100 font-inter items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-2 text-gray-600">Loading Company data and Exchange Rates...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-inter overflow-hidden">
      <CompanyContext.Provider value={companyDetails}>
        <ExchangeRateContext.Provider value={exchangeRates}>
          <NotificationProvider>
            <SosNotification alerts={sosAlerts} onDismiss={dismissAlert} />
            <div className="hidden md:flex">
              <DashboardSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            </div>
            <div
              className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0 min-w-0 overflow-x-hidden`}
              style={{ marginLeft: sidebarOpen ? sidebarWidthOpen : sidebarWidthClosed }}
            >
              <DashboardNavbar
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                isSidebarOpen={sidebarOpen}
              />
              <main className="flex-grow p-4 md:p-6 overflow-y-auto">
                <Outlet />
              </main>
              <DashboardFooter />
            </div>
          </NotificationProvider>
        </ExchangeRateContext.Provider>
      </CompanyContext.Provider>
    </div>
  );
};

export default DashboardLayout;