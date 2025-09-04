import React from 'react';
import {
  FaChartLine,
  FaRegHandshake,
  FaFileInvoice,
  FaBullhorn,
  FaRegChartBar,
  FaUserTie,
  FaRocket,
} from 'react-icons/fa';

const stats = [
  {
    title: '30%',
    description: 'Increase in Deal Closure Rate',
    icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '50K+',
    description: 'Sales Orders Processed',
    icon: <FaFileInvoice className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '25%',
    description: 'Reduction in Sales Cycle Time',
    icon: <FaRegChartBar className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '3x',
    description: 'Boost in Sales Rep Productivity',
    icon: <FaUserTie className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Quotation & Order Management',
    description: 'Simplify creation, tracking, and approval of sales quotations and orders.',
    icon: <FaFileInvoice className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Sales Forecasting & Pipeline',
    description: 'Get real-time insights into pipelines and accurately forecast revenue.',
    icon: <FaChartLine className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Incentive & Target Tracking',
    description: 'Motivate your team with performance-based target tracking.',
    icon: <FaRocket className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Campaign to Conversion Insights',
    description: 'Track lead-to-order performance with integrated marketing analytics.',
    icon: <FaBullhorn className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Real-time Sales Analytics',
    description: 'Monitor performance, pipeline stages, and deal health with live dashboards.',
    icon: <FaRegChartBar className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Integrated Quotation Builder',
    description: 'Create professional, customized quotes in minutes with approval workflows.',
    icon: <FaFileInvoice className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Sales Funnel Automation',
    description: 'Automate lead qualification, nurturing, and follow-ups.',
    icon: <FaRegHandshake className="text-blue-600 text-4xl mb-4" />,
  },
];

const SalesManagementPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://markplusinstitute.com/explore/storage/2023/07/pexels-pixabay-416405-scaled.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Sales Management</h1>
          <p className="text-xl text-gray-200">Drive revenue growth through optimized sales processes and performance tracking.</p>
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
          <h2 className="text-4xl font-bold mb-4">Maximize Sales Performance</h2>
          <p className="mb-8 text-lg">Streamline your entire sales journey from lead to cash with our powerful sales management solution.</p>
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

export default SalesManagementPage;
