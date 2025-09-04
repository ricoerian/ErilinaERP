import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ChevronDown,
  ChevronRight,
  Truck, DollarSign, Factory, Wifi, Clipboard, Users, ShoppingCart, Box, BarChart2, FileText, Cog, GitPullRequest, Shield, Repeat,
  Settings, Cloud, Tag, Wrench, User, BarChart, PieChart, ListChecks, ShieldCheck, // New icons from user's input
  LucideIcon // Import LucideIcon type
} from 'lucide-react';
import { useCompanyDetails } from '../../Contexts/CompanyContext';
import { URL_BECC } from '../../Utils/Constants';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface FetchedSubModule {
  name: string;
  href: string;
  key: string;
  // permissions: any; // You can keep this if you plan to use permissions on the frontend
}

interface FetchedModule {
  name: string;
  key: string;
  href: string;
  icon: string;
  submenus: FetchedSubModule[]; // Confirmed this matches backend response
}

const iconMap: Record<string, LucideIcon> = {
  Truck: Truck,
  DollarSign: DollarSign,
  Factory: Factory,
  Wifi: Wifi,
  Clipboard: Clipboard,
  Users: Users,
  ShoppingCart: ShoppingCart,
  Box: Box,
  BarChart2: BarChart2,
  FileText: FileText,
  Cog: Cog,
  GitPullRequest: GitPullRequest,
  Shield: Shield,
  Repeat: Repeat,
  Settings: Settings,
  Cloud: Cloud,
  Tag: Tag,
  Wrench: Wrench,
  User: User,
  BarChart: BarChart,
  PieChart: PieChart,
  ListChecks: ListChecks,
  ShieldCheck: ShieldCheck,
};

const DashboardSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { company } = useParams<{ company: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const companyDetails = useCompanyDetails();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modules, setModules] = useState<FetchedModule[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState<boolean>(true);
  const [errorLoadingModules, setErrorLoadingModules] = useState<string | null>(null);

  const slug = company?.toLowerCase().replace(/\s+/g, '') ?? '';

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoadingModules(true);
      setErrorLoadingModules(null);
      try {
        const response = await fetch(`${URL_BECC}/api/user/modules`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FetchedModule[] = await response.json();

        // Filter out "Exchange Rate Management" module and "Rates" submenu
        const filteredModules = data.filter(module => {
          // Hide the entire "Exchange Rate Management" module
          if (module.name === "Exchange Rate Management") {
            return false;
          }
          // For other modules, filter their submenus if "Rates" exists
          module.submenus = module.submenus.filter(submenu => submenu.name !== "Rates");
          return true;
        });

        setModules(filteredModules);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
        setErrorLoadingModules("Failed to load modules. Please try again later.");
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    if (modules.length > 0) {
      const initialExpanded: Record<string, boolean> = {};
      modules.forEach(m => {
        if (
          m.submenus.some(s => location.pathname.includes(`/${slug}${s.href}`)) ||
          location.pathname === `/${slug}${m.href}`
        ) {
          initialExpanded[m.name] = true;
        }
      });
      setExpanded(initialExpanded);
    }
  }, [location.pathname, slug, modules]);

  const primaryColor = companyDetails?.primary_color || '#3b82f6';
  const secondaryColor = companyDetails?.secondary_color || '#2ecc71';

  const getLightColor = (hexColor: string, opacity: string = '1A') => {
    if (!hexColor || hexColor.length !== 7) return '';
    return `${hexColor}${opacity}`;
  };

  const initials = companyDetails?.name
    ? companyDetails.name
        .split(' ')
        .map(w => w[0]?.toUpperCase())
        .join('')
    : '';

  const toggleModule = (name: string) =>
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));

  const isActive = (path: string) => {
    const fullPath = `/${slug}${path}`;
    return (
      location.pathname === fullPath ||
      (path === '/dashboard' && location.pathname === `/${slug}/dashboard`) ||
      (modules.some(m => m.href === path && m.submenus.some(s => location.pathname.includes(`/${slug}${s.href}`))))
    );
  };

  if (!companyDetails || isLoadingModules) {
    console.log("DashboardSidebar: companyDetails from context is null or modules are loading, displaying loading spinner.");
    return (
      <aside
        className={`fixed top-0 left-0 h-full bg-white text-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } flex flex-col z-40`}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-200 cursor-pointer h-16 flex-shrink-0">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        <nav className="flex-grow pt-4 px-3 overflow-y-auto">
          <ul className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="animate-pulse h-10 bg-gray-200 rounded-xl"></li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }

  if (errorLoadingModules) {
    return (
      <aside
        className={`fixed top-0 left-0 h-full bg-white text-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } flex flex-col rounded-r-lg z-40 p-4 justify-center items-center text-center`}
      >
        <p className="text-red-500">{errorLoadingModules}</p>
        <p className="text-sm text-gray-500 mt-2">Please refresh the page.</p>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white text-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col rounded-r-lg z-40`}
    >
      <div
        onClick={toggleSidebar}
        className="flex items-center justify-center p-4 border-b border-gray-200 cursor-pointer h-16 flex-shrink-0"
      >
        {isOpen ? (
          companyDetails.logo_url ? (
            <img
              src={companyDetails.logo_url}
              alt={`${companyDetails.name} Logo`}
              className="h-10 w-auto object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                const fallbackColorHex = (companyDetails.primary_color && companyDetails.primary_color.length === 7) ? companyDetails.primary_color.substring(1) : '3b82f6';
                e.currentTarget.src = `https://placehold.co/150x50/${fallbackColorHex}/FFFFFF?text=${initials}`;
              }}
            />
          ) : (
            <h2 className="text-xl font-bold tracking-wide truncate" style={{ color: primaryColor }}>
              {companyDetails.name || 'Your Company'}
            </h2>
          )
        ) : (
          <div className="text-xl font-bold" style={{ color: primaryColor }}>
            {companyDetails.logo_url ? (
              <img
                src={companyDetails.logo_url}
                alt={`${companyDetails.name} Logo`}
                className="h-8 w-auto object-contain rounded-md"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  const fallbackColorHex = (companyDetails.primary_color && companyDetails.primary_color.length === 7) ? companyDetails.primary_color.substring(1) : '3b82f6';
                  e.currentTarget.src = `https://placehold.co/50x50/${fallbackColorHex}/FFFFFF?text=${initials}`;
                }}
              />
            ) : (
              initials || <Home size={28} />
            )}
          </div>
        )}
      </div>

      <nav
        className={`flex-grow pt-4 px-3 overflow-y-auto ${
          isOpen
            ? 'custom-scrollbar-visible'
            : 'custom-scrollbar-hidden-but-scrollable'
        }`}
      >
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate(`/${slug}/dashboard`)}
              className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 shadow-sm ${
                isActive('/dashboard')
                  ? 'font-semibold'
                  : 'text-gray-700 hover:text-blue-400'
              } focus:outline-none`}
              style={{
                backgroundColor: isActive('/dashboard') ? getLightColor(primaryColor, '1A') : '',
                color: isActive('/dashboard') ? primaryColor : '',
              }}
            >
              <Home
                size={24}
                className={`flex-shrink-0`}
                style={{ color: isActive('/dashboard') ? primaryColor : '#4b5563' }}
              />
              {isOpen && <span className="ml-4 text-md">Dashboard</span>}
            </button>
          </li>

          {modules.map((module) => {
            const IconComponent = iconMap[module.icon] || Home;
            const hasSubmenus = module.submenus.length > 0;
            return (
              <li key={module.key}>
                <button
                  onClick={() =>
                    hasSubmenus
                      ? toggleModule(module.name)
                      : navigate(`/${slug}${module.href}`)
                  }
                  className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 shadow-sm ${
                    isActive(module.href) || expanded[module.name]
                      ? 'font-semibold'
                      : 'text-gray-700 hover:text-blue-400'
                  } focus:outline-none`}
                  aria-expanded={!!expanded[module.name]}
                  aria-controls={`${module.name}-submenu`}
                  style={{
                    backgroundColor: isActive(module.href) || expanded[module.name] ? getLightColor(primaryColor, '1A') : '',
                    color: isActive(module.href) || expanded[module.name] ? primaryColor : '',
                  }}
                >
                  <IconComponent
                    size={24}
                    className={`flex-shrink-0`}
                    style={{ color: isActive(module.href) || expanded[module.name] ? primaryColor : '#4b5563' }}
                  />
                  {isOpen && <span className="ml-4 flex-1 text-md truncate">{module.name}</span>}
                  {isOpen && hasSubmenus &&
                    (expanded[module.name] ? (
                      <ChevronDown size={20} className="flex-shrink-0 ml-2" style={{ color: primaryColor }} />
                    ) : (
                      <ChevronRight size={20} className="flex-shrink-0 ml-2" style={{ color: '#6b7280' }} />
                    ))}
                </button>

                {isOpen && expanded[module.name] && hasSubmenus && (
                  <ul
                    id={`${module.name}-submenu`}
                    className="mt-2 space-y-1 pl-6 ml-4"
                    style={{ borderLeft: `1px solid ${getLightColor(primaryColor, '33')}` }}
                  >
                    {module.submenus.map((subModule) => (
                      <li key={subModule.key}>
                        <button
                          onClick={() =>
                            navigate(`/${slug}${subModule.href}`)
                          }
                          className={`flex items-center w-full p-2 text-sm rounded-lg transition-all duration-200 ${
                            isActive(subModule.href)
                              ? 'font-medium'
                              : 'text-gray-600 hover:text-blue-400'
                          } focus:outline-none`}
                          style={{
                            backgroundColor: isActive(subModule.href) ? getLightColor(primaryColor, '0D') : '',
                            color: isActive(subModule.href) ? secondaryColor : '',
                          }}
                        >
                          {subModule.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;