import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { URL_BECC, URL_ERP } from '../Utils/Constants';

const CompanyLoginPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${URL_BECC}/api/check-company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: companyName.trim() })
      });

      const result = await response.json();

      if (result.valid && result.slug) {
        window.location.href = `${URL_ERP}/${result.slug}/login`;
      } else {
        setError('The company is not registered in the ERP system.');
      }
    } catch (err) {
      console.error('Error during company check:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Company Login</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your company name to proceed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div>
            <input
              type="text"
              placeholder="e.g., PT Makmur"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
          >
            Continue
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompanyLoginPage;
