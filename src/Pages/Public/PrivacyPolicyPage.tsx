import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      <section className="bg-blue-700 py-20 text-white text-center px-6">
        <h1 className="text-5xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Your privacy is important to us. This page explains how we collect, use, and protect your personal data.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-800">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We may collect personal identification information (Name, email address, phone number, etc.) when users interact with our services or visit our site. We also collect non-personal information like browser type, device, and usage data.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-800">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            The information we collect is used to improve user experience, personalize content, send periodic emails, respond to inquiries, and improve our services and platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-800">3. How We Protect Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            We adopt appropriate data collection, storage, and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-800">4. Sharing Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            We do not sell, trade, or rent users’ personal identification information to others. We may share generic aggregated demographic information not linked to any personal information with partners, trusted affiliates, or advertisers.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-800">5. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-800">6. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy at any time. We encourage users to check this page frequently for any changes. Your continued use of the site constitutes acceptance of those changes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-800">7. Contacting Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with us, please contact us at:
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Email:</strong> owner@ricoeri.my.id
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> +62-851-5844-2031
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
