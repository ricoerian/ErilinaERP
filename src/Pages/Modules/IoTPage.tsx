import React from 'react';
import {
  FaMicrochip,
  FaNetworkWired,
  FaCloud,
  FaWifi,
  FaSatelliteDish,
  FaMobileAlt,
  FaShieldAlt,
  FaChartBar,
} from 'react-icons/fa';

const stats = [
  {
    title: '2M+',
    description: 'Devices Connected',
    icon: <FaMicrochip className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '99.9%',
    description: 'Uptime Across Devices',
    icon: <FaWifi className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '120+',
    description: 'Integration Protocols',
    icon: <FaNetworkWired className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: '40%',
    description: 'Operational Cost Reduction',
    icon: <FaChartBar className="text-blue-600 text-4xl mb-4" />,
  },
];

const useCases = [
  {
    title: 'Smart Asset Monitoring',
    description: 'Track location, usage, and health of assets in real-time.',
    icon: <FaSatelliteDish className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Predictive Maintenance',
    description: 'Anticipate failures before they occur using live sensor data.',
    icon: <FaShieldAlt className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Remote Operations',
    description: 'Control and automate remote devices from a centralized dashboard.',
    icon: <FaCloud className="text-blue-500 text-4xl mb-4" />,
  },
  {
    title: 'Smart Environment',
    description: 'Manage energy, lighting, and climate through IoT sensors.',
    icon: <FaMobileAlt className="text-blue-500 text-4xl mb-4" />,
  },
];

const features = [
  {
    title: 'Real-Time Data Streaming',
    description: 'Collect and process sensor data instantly for immediate action.',
    icon: <FaNetworkWired className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Device Lifecycle Management',
    description: 'Provision, update, and retire devices securely at scale.',
    icon: <FaMicrochip className="text-blue-600 text-4xl mb-4" />,
  },
  {
    title: 'Cloud Integration',
    description: 'Connect your IoT network with cloud-based analytics and dashboards.',
    icon: <FaCloud className="text-blue-600 text-4xl mb-4" />,
  },
];

const IoTPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section
        className="bg-cover bg-center min-h-[80vh] flex items-center justify-center text-center px-6 relative"
        style={{
          backgroundImage: `url('https://dte.telkomuniversity.ac.id/wp-content/uploads/2025/03/Untitled-design-1024x576.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-white mb-4">Internet of Things (IoT)</h1>
          <p className="text-xl text-gray-200">Seamlessly connect devices, automate operations, and unlock data intelligence across your business.</p>
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
          <h2 className="text-4xl font-bold mb-4">Ready to Connect the Future?</h2>
          <p className="mb-8 text-lg">Explore how our IoT solutions enable intelligent automation and smarter decision-making.</p>
          <a
            href="mailto:sales@yourcompany.com"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            Schedule a Demo
          </a>
        </div>
      </section>
    </div>
  );
};

export default IoTPage;
