import React from 'react';
import {
  FaChartBar,
  FaBrain,
  FaChartPie,
  FaTable,
  FaLightbulb,
  FaTachometerAlt,
  FaRegObjectGroup,
  FaCheckCircle,
} from 'react-icons/fa';

const stats = [
  {
    title: '95%',
    description: 'Faster Decision Making',
    icon: <FaTachometerAlt className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '50K+',
    description: 'Reports Generated Monthly',
    icon: <FaTable className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '40%',
    description: 'Increase in Operational Efficiency',
    icon: <FaChartBar className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '99.9%',
    description: 'Data Accuracy',
    icon: <FaCheckCircle className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Data Visualization',
    description: 'Transform raw data into insightful dashboards and visual charts for easier interpretation.',
    icon: <FaChartPie className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Predictive Analytics',
    description: 'Utilize historical data and AI-driven insights to forecast trends and behavior.',
    icon: <FaBrain className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Performance Tracking',
    description: 'Monitor KPIs in real-time and compare results against set goals or benchmarks.',
    icon: <FaTachometerAlt className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Interactive Reporting',
    description: 'Empower users to generate and customize reports without technical skills.',
    icon: <FaTable className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Unified Data Source',
    description: 'Connect data across departments into a single, consistent source of truth.',
    icon: <FaRegObjectGroup className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Self-Service BI',
    description: 'Enable all employees to explore data and find answers with intuitive tools.',
    icon: <FaLightbulb className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Custom Dashboards',
    description: 'Design personalized dashboards for different roles and departments.',
    icon: <FaChartBar className="text-blue-600 text-4xl mb-4" />,
  },
];

const BusinessIntelligencePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/559929f0e4b0e9cbf62bbbb4/1641827953410-M2LZ1F4CBHEU4URUYRGX/AdobeStock_447703909.jpeg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Business Intelligence</h1>
          <p className="text-xl text-gray-200">Turn your data into actionable insights and strategic decisions with powerful BI tools.</p>
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
          <h2 className="text-4xl font-bold mb-4">Empower Your Decisions with Data</h2>
          <p className="mb-8 text-lg">Discover how our Business Intelligence platform helps you gain clarity and take the right steps forward.</p>
          <a
            href="mailto:sales@yourcompany.com"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            Request a Demo
          </a>
        </div>
      </section>
    </div>
  );
};

export default BusinessIntelligencePage;
