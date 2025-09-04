import React from 'react';
import {
  FaCogs,
  FaIndustry,
  FaTools,
  FaProjectDiagram,
  FaBoxes,
  FaRobot,
  FaChartLine,
  FaClipboardCheck
} from 'react-icons/fa';

const stats = [
  {
    title: '1M+',
    description: 'Units Produced Annually',
    icon: <FaIndustry className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '35%',
    description: 'Reduction in Downtime',
    icon: <FaCogs className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '500+',
    description: 'Production Lines Managed',
    icon: <FaTools className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '99.5%',
    description: 'Production Accuracy Rate',
    icon: <FaClipboardCheck className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Production Scheduling',
    description: 'Plan, schedule, and monitor production activities for optimal output.',
    icon: <FaProjectDiagram className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Inventory Management',
    description: 'Ensure raw materials and finished goods are tracked in real time.',
    icon: <FaBoxes className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Automation Integration',
    description: 'Integrate with robotics and IoT devices for smart manufacturing.',
    icon: <FaRobot className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Quality Control',
    description: 'Monitor and improve product quality at every stage of production.',
    icon: <FaClipboardCheck className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Real-Time Production Monitoring',
    description: 'Track live production stats and identify bottlenecks instantly.',
    icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Work Order Management',
    description: 'Create, assign, and complete work orders efficiently.',
    icon: <FaTools className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Traceability',
    description: 'Maintain complete visibility from raw material to final product.',
    icon: <FaBoxes className="text-blue-600 text-4xl mb-4" />,
  },
];

const ManufacturingPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative" style={{ backgroundImage: `url('https://www.goodwin.edu/enews/wp-content/uploads/2024/12/homa-appliances-pWUyHVJgLhg-unsplash-scaled.jpg')` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Manufacturing</h1>
          <p className="text-xl text-gray-200">Optimize production, reduce waste, and scale operations with smart manufacturing tools.</p>
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

      {/* CTA */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Boost Manufacturing Efficiency?</h2>
          <p className="mb-8 text-lg">Discover how our platform helps you modernize operations and maximize productivity.</p>
          <a href="mailto:sales@yourcompany.com" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition">Request a Demo</a>
        </div>
      </section>
    </div>
  );
};

export default ManufacturingPage;
