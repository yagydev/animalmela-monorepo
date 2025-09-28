import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety & Security - Kisaan Mela',
  description: 'Learn about safety measures and security features on Kisaan Mela platform',
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety & Security</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your safety and security are our top priorities. Learn about the measures we take 
            to protect you and your transactions.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Platform Security */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Security</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>SSL encryption for all data transmission</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>Secure payment processing with trusted providers</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>Regular security audits and updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>Two-factor authentication available</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>Data backup and recovery systems</span>
              </li>
            </ul>
          </div>

          {/* User Verification */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Verification</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Identity verification for all users</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Phone number and email verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Document verification for sellers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Rating and review system</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>Fraud detection and prevention</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Safety Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Buyers */}
            <div>
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">For Buyers</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Before Purchase</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Verify seller's identity and ratings</li>
                    <li>• Ask for recent photos and health certificates</li>
                    <li>• Arrange for veterinary inspection</li>
                    <li>• Confirm all details before payment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">During Transaction</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Use platform's secure payment system</li>
                    <li>• Meet in safe, public locations</li>
                    <li>• Bring a knowledgeable companion</li>
                    <li>• Document the transaction</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="text-2xl font-semibold text-green-600 mb-6">For Sellers</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Listing Guidelines</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Provide accurate animal information</li>
                    <li>• Upload clear, recent photos</li>
                    <li>• Include health and vaccination records</li>
                    <li>• Set fair and competitive prices</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Meeting Buyers</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Verify buyer's identity before meeting</li>
                    <li>• Meet in well-lit, accessible locations</li>
                    <li>• Have proper documentation ready</li>
                    <li>• Use secure payment methods only</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animal Welfare */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Animal Welfare</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 text-center">
              We are committed to ensuring the highest standards of animal welfare on our platform.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Health Standards</h3>
                <p className="text-gray-600">All animals must have proper health certificates and vaccination records</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚛</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Safe Transport</h3>
                <p className="text-gray-600">Transportation must meet animal welfare standards with proper ventilation and space</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Legal Compliance</h3>
                <p className="text-gray-600">All transactions must comply with local and national animal welfare laws</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Issues */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Report Safety Concerns</h2>
          <p className="text-xl mb-8">
            If you encounter any safety issues or suspicious activity, please report it immediately.
          </p>
          <div className="space-x-4">
            <a 
              href="/contact" 
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Report Issue
            </a>
            <a 
              href="tel:+91-XXXX-XXXXXX" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors inline-block"
            >
              Emergency Hotline
            </a>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Emergency Contacts</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Platform Support</h3>
              <p className="text-gray-600">support@kisaanmela.com</p>
              <p className="text-gray-600">+91-XXXX-XXXXXX</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Animal Welfare</h3>
              <p className="text-gray-600">welfare@kisaanmela.com</p>
              <p className="text-gray-600">+91-XXXX-XXXXXX</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Security Issues</h3>
              <p className="text-gray-600">security@kisaanmela.com</p>
              <p className="text-gray-600">+91-XXXX-XXXXXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
