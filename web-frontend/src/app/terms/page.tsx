import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Kisaan Mela',
  description: 'Terms of Service for Kisaan Mela livestock trading platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Kisaan Mela, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please 
                do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Platform Description</h2>
              <p className="text-gray-700 mb-4">
                Kisaan Mela is a digital platform that connects livestock farmers, buyers, and 
                service providers across India. We facilitate the buying, selling, and trading 
                of livestock and related services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and truthful information about livestock and services</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the rights and property of other users</li>
                <li>Maintain the security of your account credentials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Prohibited Activities</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Posting false or misleading information</li>
                <li>Engaging in fraudulent transactions</li>
                <li>Violating animal welfare laws</li>
                <li>Harassing or threatening other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Payment and Fees</h2>
              <p className="text-gray-700 mb-4">
                Kisaan Mela may charge fees for certain services. All fees will be clearly 
                disclosed before you incur them. Payment processing is handled by secure 
                third-party providers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Kisaan Mela acts as a platform connecting users and is not responsible for 
                the quality, safety, or legality of livestock or services offered by users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@kisaanmela.com
                <br />
                Phone: +91-XXXX-XXXXXX
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
