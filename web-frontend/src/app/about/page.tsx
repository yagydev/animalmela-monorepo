import {
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  TruckIcon,
  CalendarDaysIcon,
  SunIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const teamMembers = [
  {
    name: 'Arjun Sharma',
    role: 'CEO & Co-Founder',
    bio: '10+ years in agritech, passionate about transforming Indian agriculture through digital innovation.',
    linkedin: '#',
  },
  {
    name: 'Priya Nair',
    role: 'CTO',
    bio: 'Expert in precision farming and IoT, building scalable tech solutions for the farming community.',
    linkedin: '#',
  },
  {
    name: 'Rajan Patel',
    role: 'Head of Farmer Relations',
    bio: 'Former NABARD official with deep roots in rural finance and farmer welfare programmes.',
    linkedin: '#',
  },
  {
    name: 'Sunita Kumari',
    role: 'Head of Training & Skilling',
    bio: 'Dedicated to upskilling farmers in modern agri-practices, digital literacy, and market access.',
    linkedin: '#',
  },
];

const values = [
  {
    icon: UserGroupIcon,
    title: 'Farmer First',
    description:
      'Every feature, policy, and decision is made with the farmer\'s benefit and livelihood at the centre.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Transparency',
    description:
      'Fair pricing, open ratings, and honest information so every stakeholder can trust the platform.',
  },
  {
    icon: StarIcon,
    title: 'Technology for Good',
    description:
      'We harness IoT, AI, and mobile to solve real agricultural challenges — not just for profit.',
  },
  {
    icon: CheckCircleIcon,
    title: 'Community Driven',
    description:
      'Built with inputs from farmer cooperatives, SHGs, and agri-entrepreneurs across India.',
  },
];

const milestones = [
  { year: '2021', event: 'KisaanMela founded in Pune to bridge the farm-to-market gap' },
  { year: '2022', event: 'Launched in 8 states with 2,000+ farmer registrations' },
  { year: '2023', event: 'Integrated government scheme guidance and mela event management' },
  { year: '2024', event: '50,000+ products listed, ₹12 crore GMV milestone reached' },
  { year: '2025', event: 'Pan-India expansion with 28 states and 1 lakh+ farmers onboarded' },
];

const stats = [
  { number: '1,00,000+', label: 'Farmers', icon: UserGroupIcon },
  { number: '50,000+', label: 'Products Listed', icon: BuildingStorefrontIcon },
  { number: '500+', label: 'Mela Events', icon: CalendarDaysIcon },
  { number: '₹12 Cr+', label: 'GMV Achieved', icon: ChartBarIcon },
];

const services = [
  {
    icon: BuildingStorefrontIcon,
    title: 'Marketplace',
    description: 'Buy and sell agri produce, equipment, seeds, and inputs directly — no middlemen.',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Mela Events',
    description: 'Discover and participate in agricultural melas, exhibitions, and trade fairs near you.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Training & Schemes',
    description: 'Access government scheme guidance, subsidies, and skilling programmes in one place.',
  },
  {
    icon: SunIcon,
    title: 'Weather & Crop Advisory',
    description: 'Hyper-local weather forecasts and AI-powered crop advisory for better farm decisions.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">About KisaanMela</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Empowering Indian farmers through a digital marketplace, direct market access, and
              comprehensive government scheme guidance — so every farmer can thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At KisaanMela, we believe that every Indian farmer deserves fair prices, broader markets,
                and the tools to compete in a modern economy. Our mission is to remove the friction between
                farm and market — connecting farmers directly with buyers, vendors, and the government
                support they are entitled to.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether it is selling a harvest, booking a stall at a kisan mela, or finding the right
                subsidy scheme, KisaanMela makes it simple, transparent, and accessible from any device.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/marketplace"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                >
                  Explore Marketplace
                </a>
                <a
                  href="/contact"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why KisaanMela?</h3>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <value.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-gray-900">{value.title}</h4>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that reflect our commitment to Indian agriculture
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Agriculture enthusiasts and technologists working to transform India&apos;s farming ecosystem
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <UserGroupIcon className="h-16 w-16 text-green-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <a
                    href={member.linkedin}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Connect on LinkedIn →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a Pune startup to a pan-India agricultural platform
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}
                  >
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="text-green-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end solutions for the Indian agricultural ecosystem
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <service.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the KisaanMela Community?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Whether you are a farmer looking for better prices, a buyer sourcing fresh produce, or a
            vendor offering agri-services — KisaanMela is your platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
