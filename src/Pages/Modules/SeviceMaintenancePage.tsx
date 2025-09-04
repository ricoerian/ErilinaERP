import React from 'react';
import {
  FaTools,
  FaHistory,
  FaClipboardList,
  FaUserCog,
  FaCalendarCheck,
  FaClock,
  FaWrench,
  FaCheckCircle,
} from 'react-icons/fa';

const stats = [
  {
    title: '40%',
    description: 'Faster Service Response Time',
    icon: <FaClock className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '99.8%',
    description: 'On-Time Maintenance Rate',
    icon: <FaCalendarCheck className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '25%',
    description: 'Reduction in Equipment Downtime',
    icon: <FaWrench className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '100K+',
    description: 'Tickets Managed Annually',
    icon: <FaClipboardList className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Preventive Maintenance Scheduling',
    description: 'Automate your maintenance routines and reduce breakdown risks.',
    icon: <FaCalendarCheck className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Work Order & Ticket Tracking',
    description: 'Streamline ticketing workflows with assignment and tracking systems.',
    icon: <FaClipboardList className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Field Service Coordination',
    description: 'Efficiently dispatch and monitor service agents on the field.',
    icon: <FaUserCog className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Asset Repair History',
    description: 'Maintain complete repair logs and service records for all equipment.',
    icon: <FaHistory className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Real-Time Service Monitoring',
    description: 'Track service progress, issue status, and team workload live.',
    icon: <FaCheckCircle className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Integrated Spare Part Management',
    description: 'Monitor usage, availability, and procurement of spare parts.',
    icon: <FaTools className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'SLA Compliance Tools',
    description: 'Ensure every service meets agreed response and resolution times.',
    icon: <FaClipboardList className="text-blue-600 text-4xl mb-4" />,
  },
];

const ServiceMaintenancePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://assets.new.siemens.com/siemens/assets/api/uuid:2db183d8-971d-4529-a39d-0af967cfdc53/width:2000/quality:high/Plant-Maintenance-Services.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Service & Maintenance</h1>
          <p className="text-xl text-gray-200">Ensure operational continuity with efficient service delivery and maintenance scheduling.</p>
        </div>
      </section>

      {/* Stats */}
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

      {/* Features */}
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

      {/* Use Cases */}
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

      {/* CTA */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Optimize Uptime, Reduce Downtime</h2>
          <p className="mb-8 text-lg">Digitize and automate your entire service operation with our integrated maintenance solution.</p>
          <a
            href="mailto:sales@yourcompany.com"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            Book a Free Demo
          </a>
        </div>
      </section>
    </div>
  );
};

export default ServiceMaintenancePage;
