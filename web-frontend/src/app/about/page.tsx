'use client';

import { 
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  TruckIcon,
  ScissorsIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/images/team/sarah.jpg',
      bio: 'Passionate about animal welfare with 15+ years in pet care industry.',
      linkedin: '#'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      image: '/images/team/mike.jpg',
      bio: 'Tech enthusiast building the future of pet care services.',
      linkedin: '#'
    },
    {
      name: 'Emma Davis',
      role: 'Head of Operations',
      image: '/images/team/emma.jpg',
      bio: 'Ensuring quality and safety across all our pet care services.',
      linkedin: '#'
    },
    {
      name: 'David Wilson',
      role: 'Head of Training',
      image: '/images/team/david.jpg',
      bio: 'Certified animal behaviorist with expertise in pet training.',
      linkedin: '#'
    }
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Compassion',
      description: 'We treat every pet with the love and care they deserve, as if they were our own.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Safety',
      description: 'All our sitters undergo rigorous background checks and are fully insured.'
    },
    {
      icon: StarIcon,
      title: 'Excellence',
      description: 'We maintain the highest standards in pet care through continuous training and feedback.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community',
      description: 'Building a supportive network of pet owners and care providers.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Kisaanmela founded with a mission to connect pet owners with trusted caregivers' },
    { year: '2021', event: 'Launched in 5 major cities with 500+ verified pet sitters' },
    { year: '2022', event: 'Reached 10,000+ happy pets milestone' },
    { year: '2023', event: 'Expanded to 25 cities nationwide' },
    { year: '2024', event: 'Introduced AI-powered matching and 24/7 support' }
  ];

  const stats = [
    { number: '50,000+', label: 'Services Completed', icon: CheckCircleIcon },
    { number: '10,000+', label: 'Happy Pets', icon: HeartIcon },
    { number: '5,000+', label: 'Trusted Sitters', icon: UserGroupIcon },
    { number: '4.9/5', label: 'Average Rating', icon: StarIcon }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About Kisaanmela
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              We're passionate about connecting pet owners with trusted, professional caregivers 
              who share our love for animals and commitment to their wellbeing.
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
                At Kisaanmela, we believe that every pet deserves the best care possible. Our mission is to 
                create a trusted platform that connects pet owners with verified, professional caregivers 
                who are passionate about animal welfare.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We're committed to ensuring peace of mind for pet owners while providing loving, 
                reliable care for their furry, feathered, and scaled family members.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/services"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                >
                  Find Services
                </a>
                <a
                  href="/contact"
                  className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Kisaanmela?</h3>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <value.icon className="h-6 w-6 text-primary-600" />
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
              Numbers that reflect our commitment to excellence in pet care
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-primary-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
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
              Passionate professionals dedicated to revolutionizing pet care
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <UserGroupIcon className="h-16 w-16 text-primary-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <a
                    href={member.linkedin}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
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
              From startup to industry leader in pet care services
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="text-primary-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Pet Care</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From daily walks to specialized care, we offer everything your pet needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <UserGroupIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pet Sitting</h3>
              <p className="text-gray-600">In-home care with 24/7 supervision</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <ClockIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dog Walking</h3>
              <p className="text-gray-600">Regular exercise and socialization</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <ScissorsIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pet Grooming</h3>
              <p className="text-gray-600">Professional grooming services</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <AcademicCapIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pet Training</h3>
              <p className="text-gray-600">Expert behavioral training</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Whether you're a pet owner looking for care or a caregiver wanting to help pets, 
            we'd love to have you as part of the Kisaanmela family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
