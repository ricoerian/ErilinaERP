import React from 'react';
import { FaHistory, FaBullseye, FaUsers, FaMapMarkedAlt, FaHandshake, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const milestones = [
  { year: '2010', event: 'Founded by visionary entrepreneurs with a passion for innovation.' },
  { year: '2012', event: 'Launched our first SCM module and successfully onboarded 50 clients across various industries.' },
  { year: '2015', event: 'Expanded our product suite to include Financial Management & CRM modules to meet growing demands.' },
  { year: '2018', event: 'Opened a dedicated R&D center focused on IoT integrations and advanced analytics.' },
  { year: '2021', event: 'Achieved a milestone of 1,000 enterprise customers serving global markets.' },
  { year: '2024', event: 'Rolled out AI-powered Analytics & Big Data features to deliver deeper business insights.' },
];

const team = [
  { name: 'Rico Eriansyah', role: 'Founder & CTO', img: 'https://picsum.photos/id/1005/200/200' },
  { name: 'Sarah Anjelina', role: 'CEO', img: 'https://picsum.photos/id/1006/200/200' },
  { name: 'Budi Santoso', role: 'Head of R&D', img: 'https://picsum.photos/id/1008/200/200' },
];

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const CompanyPage: React.FC = () => (
  <>
    <section
      aria-label="Hero"
      className="relative bg-center bg-cover bg-no-repeat min-h-screen"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29ycG9yYXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-wide"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
        >
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300">
            Eri
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            Lina
          </span>ERP
        </motion.h1>
        <motion.p
          className="text-sm md:text-lg text-gray-200 max-w-3xl leading-relaxed mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          We deliver integrated ERP solutions designed to streamline workflows, boost productivity, and drive your business growth.
        </motion.p>
        <motion.a
          href="#contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Contact Us
        </motion.a>
      </div>
    </section>

    <main className="bg-white py-16 md:py-24 text-black">
      <div className="max-w-7xl mx-auto px-6 space-y-24">

        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Why Choose <span className="bg-clip-text text-transparent bg-yellow-400">Eri</span>
            <span className="bg-clip-text text-transparent bg-blue-400">Lina</span>ERP?</h2>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed mb-12">
            We combine deep industry expertise, cutting-edge technology, and local support to provide reliable and easy-to-implement ERP solutions.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              className="flex flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <FaLightbulb size={48} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">Continuous Innovation</h3>
              <p className="text-gray-600">Always delivering latest features and AI integrations for enhanced efficiency.</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <FaHandshake size={48} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">Strong Partnerships</h3>
              <p className="text-gray-600">24/7 support and comprehensive training at every implementation stage.</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <FaShieldAlt size={48} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">Security & Reliability</h3>
              <p className="text-gray-600">Cloud redundancy architecture and high-grade encryption to safeguard your data.</p>
            </motion.div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-16">
          <motion.div
            className="flex items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <FaBullseye size={48} className="text-blue-600 mr-4" />
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the world’s most trusted ERP provider, driving digital transformation across all industries.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <FaUsers size={48} className="text-blue-600 mr-4" />
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To deliver scalable, user-friendly, and intelligent ERP solutions that empower businesses to thrive.
              </p>
            </div>
          </motion.div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 flex justify-center items-center">
            <FaHistory className="text-blue-600 mr-2" /> Our Journey
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Over the years, we have continuously evolved to meet the changing needs of businesses worldwide. From our humble beginnings to the introduction of cutting-edge AI features, our journey reflects our commitment to excellence.
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.img
              src="https://www.probe.group/hs-fs/hubfs/probegroup_website/pages/about-us/our-journey/slide3.jpg?noresize&width=700&height=500&name=slide3.jpg"
              alt="Company journey"
              className="w-full rounded-2xl shadow-lg object-cover"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.ul
              className="relative border-l-4 border-blue-200 pl-10 space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              {milestones.map((m) => (
                <li key={m.year} className="ml-6">
                  <span className="absolute -left-6 top-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></span>
                  <span className="block text-xl font-bold text-blue-600">{m.year}</span>
                  <p className="text-gray-600 mt-1 leading-snug">{m.event}</p>
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center">
              <FaMapMarkedAlt className="text-blue-600 mr-2" /> Our Headquarters
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Jl. Purnawarman No.45, Purwakarta, Indonesia
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Serving clients in APAC, EMEA, and the Americas with 24/7 support.
            </p>
          </motion.div>
          <motion.img
            src="https://news.airbnb.com/wp-content/uploads/sites/4/2021/05/888_MReed_15.jpg?fit=2500%2C1667"
            alt="Headquarters Building"
            className="w-full rounded-2xl shadow-xl object-cover"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          />
        </section>

        <section>
          <h2 id="team" className="text-3xl md:text-4xl font-semibold text-center mb-10">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <motion.div
                key={member.name}
                className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center shadow hover:shadow-lg transition-shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="text-center bg-blue-50 py-16 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-700 max-w-md mx-auto mb-6 leading-relaxed">
            Reach out to our expert team for a free demo and a tailored ERP implementation consultation.
          </p>
          <a
            href="mailto:owner@ricoeri.my.id"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition"
          >
            Get a Free Demo
          </a>
        </section>
      </div>
    </main>
  </>
);

export default CompanyPage;