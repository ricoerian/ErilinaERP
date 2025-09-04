import React from 'react';
import {
  FaTasks,
  FaUsersCog,
  FaCalendarCheck,
  FaChartLine,
  FaClipboardList,
  FaBullseye,
  FaCogs,
  FaProjectDiagram,
} from 'react-icons/fa';

const stats = [
  {
    title: '1,500+',
    description: 'Projects Delivered',
    icon: <FaProjectDiagram className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '98%',
    description: 'On-Time Completion Rate',
    icon: <FaCalendarCheck className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '80%',
    description: 'Improved Team Efficiency',
    icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '100K+',
    description: 'Tasks Managed Monthly',
    icon: <FaTasks className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Agile Sprint Planning',
    description: 'Manage backlog, assign tasks, and track sprint velocity effortlessly.',
    icon: <FaClipboardList className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Team Collaboration',
    description: 'Enable real-time collaboration and updates across departments.',
    icon: <FaUsersCog className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Milestone Tracking',
    description: 'Set goals, track progress, and ensure deadlines are met.',
    icon: <FaBullseye className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Resource Allocation',
    description: 'Optimize resource usage and prevent overloading teams.',
    icon: <FaCogs className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Integrated Timeline & Gantt Charts',
    description: 'Visualize project timelines, dependencies, and deadlines in one view.',
    icon: <FaCalendarCheck className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Task & Issue Management',
    description: 'Assign, prioritize, and resolve tasks seamlessly.',
    icon: <FaTasks className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Progress & KPI Dashboard',
    description: 'Monitor overall health, budget, and team performance in real time.',
    icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
  },
];

const ProjectManagementPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://www.openaccessgovernment.org/wp-content/uploads/2023/06/iStock-1317443847-scaled.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Project Management</h1>
          <p className="text-xl text-gray-200">Deliver projects faster with clear timelines, resource control, and seamless collaboration.</p>
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
          <h2 className="text-4xl font-bold mb-4">Start Delivering Better Projects</h2>
          <p className="mb-8 text-lg">Empower your team with intuitive project tools that keep everyone aligned and accountable.</p>
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

export default ProjectManagementPage;
