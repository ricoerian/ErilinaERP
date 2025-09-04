import React, { useState } from 'react';
import { FaCheck, FaServer, FaCloud } from 'react-icons/fa';

interface ModuleItem {
  key: string;
  label: string;
}

const MODULES: ModuleItem[] = [
  { key: 'scm', label: 'Supply Chain Management' },
  { key: 'fm', label: 'Financial Management' },
  { key: 'mfg', label: 'Manufacturing' },
  { key: 'iot', label: 'Internet of Things' },
  { key: 'pm', label: 'Project Management' },
  { key: 'crm', label: 'Customer Relationship' },
  { key: 'sales', label: 'Sales Management' },
  { key: 'service', label: 'Service & Maintenance' },
  { key: 'hr', label: 'Human Resource' },
  { key: 'asset', label: 'Asset Management' },
  { key: 'bi', label: 'Business Intelligence' },
  { key: 'bda', label: 'Big Data Analytics' },
];
const PRICE_PER_UNIT = 8000;

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subscribe' | 'standalone'>('subscribe');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number>(5);

  const toggleModule = (key: string) => {
    setSelectedModules(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };
  const increaseUsers = () => setUserCount(prev => Math.min(prev + 1, 100000));
  const decreaseUsers = () => setUserCount(prev => Math.max(prev - 1, 1));
  const onUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= 100000) {
      setUserCount(val);
    } else if (e.target.value === '') {
      setUserCount(0);
    }
  };

  const estimatedPrice = selectedModules.length * userCount * PRICE_PER_UNIT;

  return (
    <section className="bg-gradient-to-br from-white to-gray-100 py-20 text-black">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-gray-800 mb-4">Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Flexible plans tailored to your business needs.</p>
        </header>

        <div className="flex justify-center mb-12 space-x-6">
          <button
            onClick={() => setActiveTab('subscribe')}
            className={`flex items-center space-x-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none ${
              activeTab === 'subscribe'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <FaCloud size={20} />
            <span>Subscription</span>
          </button>
          <button
            onClick={() => setActiveTab('standalone')}
            className={`flex items-center space-x-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none ${
              activeTab === 'standalone'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <FaServer size={20} />
            <span>Standalone</span>
          </button>
        </div>

        {activeTab === 'subscribe' && (
          <div className="grid lg:grid-cols-2 gap-14 bg-white p-12 rounded-3xl shadow-2xl">
            <div>
              <h2 className="text-3xl font-semibold mb-8">Pick Your Modules</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {MODULES.map(mod => (
                  <div
                    key={mod.key}
                    onClick={() => toggleModule(mod.key)}
                    className={`flex items-center justify-between p-5 border rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedModules.includes(mod.key)
                        ? 'bg-blue-50 border-blue-300 shadow-inner'
                        : 'bg-white border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-lg text-gray-800">{mod.label}</span>
                    {selectedModules.includes(mod.key) && (
                      <FaCheck className="text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="">
              <div>
                <h2 className="text-3xl font-semibold mb-6">Estimate Your Cost</h2>
                <div className="mb-8">
                  <label className="block text-lg font-medium mb-3">Number of Users</label>
                  <div className="inline-flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={decreaseUsers}
                      className="px-5 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      –
                    </button>
                    <input
                      type="number"
                      className="w-20 text-center font-bold text-gray-800 bg-white outline-none"
                      value={userCount}
                      min={1}
                      max={100000}
                      onChange={onUserChange}
                    />
                    <button
                      onClick={increaseUsers}
                      className="px-5 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-xl text-center border border-blue-100">
                  <p className="uppercase text-gray-500 mb-2 tracking-wider">Estimated</p>
                  <p className="text-5xl font-extrabold text-blue-600">{estimatedPrice} IDR</p>
                  <p className="text-gray-500 mt-1">per month</p>
                </div>
              </div>

              <button className="mt-10 w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-shadow shadow-md">
                Get Started
              </button>
            </div>
          </div>
        )}

        {activeTab === 'standalone' && (
          <div className="max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-2xl text-center">
            <FaServer size={60} className="mx-auto text-blue-600 mb-6" />
            <h2 className="text-3xl font-semibold mb-4">On-Premise Deployment</h2>
            <p className="text-gray-600 mb-6">One-time licensing with comprehensive support and customization.</p>
            <ul className="text-left mb-8 space-y-3 text-gray-700">
              <li className="flex items-center"><FaCheck className="mr-2 text-blue-600" />Custom Installation & Configuration</li>
              <li className="flex items-center"><FaCheck className="mr-2 text-blue-600" />Dedicated Support & Maintenance</li>
              <li className="flex items-center"><FaCheck className="mr-2 text-blue-600" />Security & Compliance Assurance</li>
            </ul>
            <button className="px-10 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-shadow shadow-md">
              Request a Quote
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPage;
