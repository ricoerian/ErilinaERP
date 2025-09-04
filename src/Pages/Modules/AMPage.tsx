import React from 'react';
import {
  FaCubes,
  FaTools,
  FaExchangeAlt,
  FaHistory,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaRegChartBar,
  FaCheckCircle,
} from 'react-icons/fa';

const stats = [
  {
    title: '99.8%',
    description: 'Asset Accuracy Rate',
    icon: <FaCheckCircle className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '80%',
    description: 'Reduction in Asset Downtime',
    icon: <FaTools className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '150K+',
    description: 'Assets Tracked Globally',
    icon: <FaCubes className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '24/7',
    description: 'Monitoring Capability',
    icon: <FaMapMarkedAlt className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Asset Lifecycle Management',
    description: 'Track the complete lifecycle of physical and digital assets from acquisition to disposal.',
    icon: <FaHistory className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Real-Time Asset Tracking',
    description: 'Monitor asset locations, status, and usage in real time across facilities.',
    icon: <FaMapMarkedAlt className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Maintenance Scheduling',
    description: 'Automate preventive maintenance schedules and avoid costly downtime.',
    icon: <FaTools className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Asset Transfers & Audits',
    description: 'Handle inter-department asset transfers and perform audits with accurate logs.',
    icon: <FaExchangeAlt className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Centralized Asset Repository',
    description: 'Maintain detailed records of all assets in one place with easy access and categorization.',
    icon: <FaCubes className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Custom Asset Attributes',
    description: 'Configure fields and metadata to suit your organization’s specific asset types.',
    icon: <FaRegChartBar className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Security & Access Control',
    description: 'Ensure that only authorized personnel can view or modify asset information.',
    icon: <FaShieldAlt className="text-blue-600 text-4xl mb-4" />,
  },
];

const AssetManagementPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://facilitymanagement.com/wp-content/uploads/Asset-Management-1.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Asset Management</h1>
          <p className="text-xl text-gray-200">Gain full control over your organization's assets with real-time tracking, scheduling, and auditing tools.</p>
        </div>
      </section>

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

      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Track & Optimize Assets</h2>
          <p className="mb-8 text-lg">Explore how our Asset Management module can improve visibility, accountability, and performance across your infrastructure.</p>
          <a
            href="mailto:sales@yourcompany.com"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            Schedule Your Demo
          </a>
        </div>
      </section>
    </div>
  );
};

export default AssetManagementPage;
