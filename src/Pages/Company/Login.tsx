import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { URL_BECC } from '../../Utils/Constants';

const CompanyAuthLoginPage: React.FC = () => {
  const { company } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) {
      setLoading(false);
      return;
    }

    const checkLoginAndFetchCompany = async () => {
      try {
        const loginCheckRes = await fetch(
          `${URL_BECC}/api/${company}/check-login`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        const loginCheckData = await loginCheckRes.json();

        if (loginCheckRes.ok && loginCheckData.loggedIn) {
          navigate(`/${company}/dashboard`, { replace: true });
          return;
        }

        const companyCheckRes = await fetch(
          `${URL_BECC}/api/check-company`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_name: company }),
          }
        );
        const companyCheckData = await companyCheckRes.json();

        if (companyCheckRes.ok && companyCheckData.valid && companyCheckData.company_name) {
          setCompanyName(companyCheckData.company_name);
        } else {
          navigate(`/login`, { replace: true });
          setError('Company not found.');
        }
      } catch (err) {
        console.error('Failed to initialize login page:', err);
        setError('Failed to fetch initial data.');
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetchCompany();
  }, [company, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(
        `${URL_BECC}/api/${company}/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        navigate(`/${company}/dashboard`, { replace: true });
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <p className="text-xl text-blue-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {companyName ? `Login to ${companyName}` : 'Company Not Found'}
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your credentials to access your ERP
        </p>

        <form onSubmit={handleLogin} className="space-y-6 text-black">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            disabled={!companyName}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompanyAuthLoginPage;