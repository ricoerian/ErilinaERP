import React from 'react';
import { FaTruck, FaChartLine, FaWarehouse, FaCogs, FaIndustry, FaClipboardList, FaBoxes, FaPlug } from 'react-icons/fa';

const stats = [
  {
    title: '100K+',
    description: 'Orders Processed Monthly',
    icon: <FaClipboardList className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '1,200+',
    description: 'Vendors Integrated Globally',
    icon: <FaIndustry className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '98%',
    description: 'Inventory Accuracy Achieved',
    icon: <FaWarehouse className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '24/7',
    description: 'Real-time Logistics Monitoring',
    icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Multi-Channel Fulfillment',
    description: 'Seamlessly manage B2B and B2C channels from a unified platform.',
    icon: <FaTruck className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Smart Reordering',
    description: 'Automatically trigger purchase orders based on inventory levels and demand forecasting.',
    icon: <FaCogs className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Integrated Logistics',
    description: 'Connect with leading carriers and 3PLs for end-to-end shipment visibility.',
    icon: <FaPlug className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Centralized Supplier Management',
    description: 'Collaborate with suppliers, streamline onboarding, and manage compliance in one place.',
    icon: <FaIndustry className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Inventory Optimization',
    description: 'Gain real-time inventory insights and reduce carrying costs.',
    icon: <FaBoxes className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Demand Forecasting',
    description: 'Predict future sales and trends with intelligent algorithms.',
    icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Supplier Collaboration',
    description: 'Strengthen partnerships with integrated supplier tools.',
    icon: <FaIndustry className="text-blue-600 text-4xl mb-4" />,
  },
];

const SupplyChainPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&w=1950&q=80')` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Supply Chain Management</h1>
          <p className="text-xl text-gray-200">Digitize, optimize, and scale your supply chain operations with real-time visibility and intelligent automation.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-xl hover:shadow-2xl transition duration-300 rounded-2xl p-6 text-center border border-blue-100 hover:scale-105 transform"
              >
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-3xl font-bold text-blue-700 mt-2">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm tracking-wide uppercase">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 text-center transition-transform hover:scale-105">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mt-4">{feature.title}</h3>
                <p className="text-gray-600 mt-2 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Scenarios */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Use Case Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  {useCase.icon}
                  <h3 className="text-xl font-semibold text-gray-800">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Supply Chain?</h2>
          <p className="mb-8 text-lg">Get in touch with our experts and discover how our SCM module can streamline your operations.</p>
          <a href="mailto:sales@yourcompany.com" className="inline-block bg-white text-blue-800 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition">Request a Demo</a>
        </div>
      </section>
    </div>
  );
};

export default SupplyChainPage;
