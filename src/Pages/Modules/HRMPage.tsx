import React from 'react';
import {
  FaUsers,
  FaRegCalendarAlt,
  FaUserTie,
  FaChalkboardTeacher,
  FaFileAlt,
  FaAward,
  FaRegChartBar,
  FaCheckCircle,
} from 'react-icons/fa';

const stats = [
  {
    title: '98%',
    description: 'Employee Retention Rate',
    icon: <FaCheckCircle className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '100K+',
    description: 'Employee Records Managed',
    icon: <FaUsers className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '40%',
    description: 'Reduction in Hiring Time',
    icon: <FaRegCalendarAlt className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '99.5%',
    description: 'Payroll Accuracy',
    icon: <FaFileAlt className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Recruitment & Onboarding',
    description: 'Streamline candidate tracking, selection, and onboarding workflows.',
    icon: <FaUserTie className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Performance Appraisal',
    description: 'Define goals, track KPIs, and evaluate employee performance with ease.',
    icon: <FaRegChartBar className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Training & Development',
    description: 'Organize training programs and track employee certifications.',
    icon: <FaChalkboardTeacher className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Leave & Attendance',
    description: 'Monitor employee attendance, leave balance, and requests efficiently.',
    icon: <FaRegCalendarAlt className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Centralized Employee Database',
    description: 'Manage employee information in a secure and accessible system.',
    icon: <FaUsers className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Automated Payroll Processing',
    description: 'Generate accurate payrolls and handle tax calculations automatically.',
    icon: <FaFileAlt className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Recognition & Rewards',
    description: 'Create a culture of excellence with automated recognition tools.',
    icon: <FaAward className="text-blue-600 text-4xl mb-4" />,
  },
];

const HumanResourcePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://lirp.cdn-website.com/537b6562/dms3rep/multi/opt/Information+Systems+in+Human+Resource+Management-1920w.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Human Resource Management</h1>
          <p className="text-xl text-gray-200">Empower your workforce with efficient HR tools for hiring, payroll, performance, and beyond.</p>
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
          <h2 className="text-4xl font-bold mb-4">Empower Your People</h2>
          <p className="mb-8 text-lg">Discover how our HRM module can simplify and elevate your human capital management process.</p>
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

export default HumanResourcePage;
