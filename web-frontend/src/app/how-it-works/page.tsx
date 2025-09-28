import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works - Kisaan Mela',
  description: 'Learn how Kisaan Mela connects farmers, buyers, and service providers for livestock trading',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Kisaan Mela Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting India's farming community through a simple, secure, and efficient platform
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-green-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Account</h3>
            <p className="text-gray-600">
              Sign up as a farmer, buyer, or service provider. Complete your profile with 
              necessary details and verification documents.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">List or Browse</h3>
            <p className="text-gray-600">
              Farmers can list their livestock with photos and details. Buyers can browse 
              and search for animals based on location, breed, and price.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Trade</h3>
            <p className="text-gray-600">
              Use our secure messaging system to negotiate. Complete transactions with 
              built-in payment protection and delivery coordination.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Platform Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Farmers */}
            <div>
              <h3 className="text-2xl font-semibold text-green-600 mb-6">For Farmers</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">List unlimited livestock with photos and details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Reach buyers across India</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Get fair market prices for your animals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Access veterinary and transport services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Secure payment processing</span>
                </li>
              </ul>
            </div>

            {/* For Buyers */}
            <div>
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">For Buyers</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <span className="text-gray-700">Browse verified livestock listings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <span className="text-gray-700">Filter by location, breed, age, and price</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <span className="text-gray-700">Direct communication with farmers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <span className="text-gray-700">Arrange transport and insurance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">✓</span>
                  <span className="text-gray-700">Purchase protection guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Additional Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Veterinary Services */}
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Veterinary Care</h3>
              <p className="text-gray-600">
                Connect with qualified veterinarians for health checkups, vaccinations, 
                and emergency care for your livestock.
              </p>
            </div>

            {/* Transport Services */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚛</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transport</h3>
              <p className="text-gray-600">
                Arrange safe and reliable transportation for your livestock with 
                experienced drivers and proper vehicles.
              </p>
            </div>

            {/* Insurance */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Insurance</h3>
              <p className="text-gray-600">
                Protect your investment with comprehensive livestock insurance 
                covering health, transport, and market risks.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of farmers and buyers already using Kisaan Mela
          </p>
          <div className="space-x-4">
            <a 
              href="/register" 
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Sign Up Now
            </a>
            <a 
              href="/marketplace" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-block"
            >
              Browse Marketplace
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
