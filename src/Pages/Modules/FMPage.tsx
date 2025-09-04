import React from 'react';
import {
  FaMoneyBillWave,
  FaChartPie,
  FaWallet,
  FaFileInvoiceDollar,
  FaCalculator,
  FaCreditCard,
  FaUniversity,
  FaRegChartBar
} from 'react-icons/fa';

const stats = [
  {
    title: '$50M+',
    description: 'Annual Transactions',
    icon: <FaMoneyBillWave className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '99.9%',
    description: 'Accuracy in Financial Reporting',
    icon: <FaCalculator className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '300+',
    description: 'Accounts Managed',
    icon: <FaWallet className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '24/7',
    description: 'Real-time Financial Monitoring',
    icon: <FaChartPie className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Automated Invoicing',
    description: 'Generate and send invoices automatically based on transactions.',
    icon: <FaFileInvoiceDollar className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Expense Tracking',
    description: 'Monitor spending across departments with centralized dashboards.',
    icon: <FaCreditCard className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Budget Planning',
    description: 'Create and track budgets aligned with company goals.',
    icon: <FaRegChartBar className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Compliance Management',
    description: 'Ensure financial operations comply with regulatory standards.',
    icon: <FaUniversity className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Real-Time Dashboards',
    description: 'Track KPIs and financial health with up-to-date dashboards.',
    icon: <FaChartPie className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Bank Reconciliation',
    description: 'Easily reconcile transactions with bank statements.',
    icon: <FaMoneyBillWave className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Audit Trail',
    description: 'Maintain transparency with complete audit logs of financial activities.',
    icon: <FaCalculator className="text-blue-600 text-4xl mb-4" />,
  },
];

const FinancialManagementPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative" style={{ backgroundImage: `url('https://www.alphajwc.com/wp-content/uploads/2022/05/business-man-accounting-calculating-cost-economic-budget-investment-saving.jpg')` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Financial Management</h1>
          <p className="text-xl text-gray-200">Gain full control of your company's finances with accuracy, automation, and insights.</p>
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
          <h2 className="text-4xl font-bold mb-4">Ready to Streamline Your Financial Operations?</h2>
          <p className="mb-8 text-lg">Let our finance module empower your organization with actionable insights and automation.</p>
          <a href="mailto:sales@yourcompany.com" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition">Request a Demo</a>
        </div>
      </section>
    </div>
  );
};

export default FinancialManagementPage;
