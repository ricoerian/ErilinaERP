import React from 'react';
import {
  FaDatabase,
  FaChartLine,
  FaServer,
  FaProjectDiagram,
  FaBrain,
  FaCogs,
  FaCheckCircle,
  FaGlobe,
} from 'react-icons/fa';

const stats = [
  {
    title: '90%',
    description: 'Faster Insight Discovery',
    icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '100TB+',
    description: 'Data Processed Daily',
    icon: <FaDatabase className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '70%',
    description: 'Improved Forecast Accuracy',
    icon: <FaBrain className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '99.99%',
    description: 'System Uptime',
    icon: <FaCheckCircle className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Real-time Data Processing',
    description: 'Ingest and analyze data in real-time to power faster decision-making and alerts.',
    icon: <FaServer className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Predictive Maintenance',
    description: 'Anticipate equipment failures using sensor data and predictive models.',
    icon: <FaProjectDiagram className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Customer Behavior Analysis',
    description: 'Uncover hidden patterns in customer behavior to optimize marketing strategies.',
    icon: <FaBrain className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Market Trend Forecasting',
    description: 'Leverage historical data to accurately predict future trends and demand.',
    icon: <FaChartLine className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Scalable Architecture',
    description: 'Process massive datasets across distributed computing environments.',
    icon: <FaGlobe className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Machine Learning Integration',
    description: 'Incorporate advanced ML models into your analytics pipeline with ease.',
    icon: <FaCogs className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Data Lake Support',
    description: 'Store structured and unstructured data in a unified repository for analysis.',
    icon: <FaDatabase className="text-blue-600 text-4xl mb-4" />,
  },
];

const BigDataAnalyticsPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://smtcenter.net/wp-content/uploads/2022/11/Big-Data-Advanced-Analytics-scaled-1.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Big Data Analytics</h1>
          <p className="text-xl text-gray-200">Transform massive data into meaningful insights to drive impactful decisions at scale.</p>
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
          <h2 className="text-4xl font-bold mb-4">Harness the Power of Big Data</h2>
          <p className="mb-8 text-lg">Let your data work for you — unlock advanced insights with our Big Data Analytics solution.</p>
          <a
            href="mailto:sales@yourcompany.com"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
};

export default BigDataAnalyticsPage;
