import React, { useEffect, useState, useRef } from 'react';
import { LogOut, User, Settings, Key, Mail } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanyDetails } from '../../Contexts/CompanyContext';
import { URL_BECC } from '../../Utils/Constants';

interface UserData {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  company_id: number;
  company: {
    id: number;
    name: string;
    slug: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string;
  };
  role?: {
    id: number;
    name: string;
    permissions: unknown;
  } | null;
}

const DashboardNavbar = () => {
  const { company } = useParams<{ company: string }>();
  const navigate = useNavigate();
  const companyDetails = useCompanyDetails();
  const [userDetails, setUserDetails] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [showUserCard, setShowUserCard] = useState<boolean>(false);
  const userCardRef = useRef<HTMLDivElement>(null);

  const slug = company?.toLowerCase().replace(/\s+/g, '') ?? '';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!slug) {
        setLoadingUser(false);
        return;
      }

      try {
        const userRes = await fetch(
          `${URL_BECC}/api/company/${slug}/user/private`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (userRes.ok) {
          const userData: UserData = await userRes.json();
          setUserDetails(userData);
          console.log("DashboardNavbar: User data fetched successfully:", userData);
        } else {
          console.error(`DashboardNavbar: Failed to fetch user data: Status ${userRes.status}`);
          if (userRes.status === 401 || userRes.status === 403) {
            navigate(`/${slug}/login`, { replace: true });
          }
        }

      } catch (err) {
        console.error('DashboardNavbar: Failed to fetch user data:', err);
        navigate(`/${slug}/login`, { replace: true });
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [slug, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userCardRef.current &&
        !userCardRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.user-card-trigger')
      ) {
        setShowUserCard(false);
      }
    };

    if (showUserCard) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserCard]);


  const handleLogout = async () => {
    try {
      await fetch(`${URL_BECC}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      window.location.href = `/${company}/login`;
    }
  };

  const primaryColor = companyDetails?.primary_color || '#3b82f6';
  const textColor = '#ffffff';

  if (!companyDetails || loadingUser) {
    return (
      <header className="sticky top-0 flex items-center justify-between bg-blue-400 text-white px-6 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="animate-pulse h-6 w-32 bg-blue-300 rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="animate-pulse h-8 w-24 bg-red-400 rounded-md"></div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 shadow-lg"
      style={{ backgroundColor: primaryColor, color: textColor }}
    >
      <div className="flex items-center gap-4">
        <div className="md:hidden text-lg font-bold">
          {companyDetails?.name}
        </div>
      </div>
      <div className="relative z-50 flex items-center gap-4">
        {userDetails && (
          <div className="relative">
            <button
              onClick={() => setShowUserCard(!showUserCard)}
              className="flex items-center gap-2 p-2 rounded hover:bg-white/20 transition user-card-trigger"
            >
              <User size={24} className="text-white" />
              <span className="font-medium hidden sm:block">{userDetails.full_name}</span>
            </button>

            {showUserCard && (
              <div
                ref={userCardRef}
                className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2"
                style={{ color: '#333', zIndex: 99999 }}
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="font-semibold">{userDetails.full_name}</div>
                  {userDetails.role && (
                    <div className="text-sm text-gray-500 mb-1">
                      {userDetails.role.name}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail size={16} /> {userDetails.email}
                  </div>
                </div>
                <button
                  onClick={() => { setShowUserCard(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings size={18} /> Account Setting
                </button>
                <button
                  onClick={() => { setShowUserCard(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Key size={18} /> Change Password
                </button>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar;
