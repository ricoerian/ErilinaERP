import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section
        aria-label="Contact Hero"
        className="relative bg-center bg-cover bg-no-repeat min-h-[60vh]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=60')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-gray-200 max-w-2xl leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            We're here to answer any questions you may have about our ERP solutions. Reach out and we'll respond as soon as we can.
          </motion.p>
        </div>
      </section>

      <main className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-black">Contact Details</h2>
              <div className="flex items-start space-x-4">
                <FaMapMarkerAlt size={24} className="text-blue-600 mt-1" />
                <p className="text-gray-700">Jl. Purnawarman No.45, Purwakarta, Indonesia</p>
              </div>
              <div className="flex items-start space-x-4">
                <FaPhoneAlt size={24} className="text-blue-600 mt-1" />
                <p className="text-gray-700">+62 851 5844 2031</p>
              </div>
              <div className="flex items-start space-x-4">
                <FaEnvelope size={24} className="text-blue-600 mt-1" />
                <a href='mailto:owner@ricoeri.my.id' className="text-gray-700">owner@ricoeri.my.id</a>
              </div>
            </div>

            <div>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">Thank you!</h3>
                  <p className="text-gray-700">Your message has been received. We will get back to you shortly.</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.938123456789!2d107.440000!3d-6.563000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzMnMTYuOCJTIDEwN8KwMjYnMTUuMCJF!5e0!3m2!1sen!2sid!4v1620000000000"
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen={false}
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default ContactPage;
