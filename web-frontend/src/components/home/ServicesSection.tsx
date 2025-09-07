'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon,
  HeartIcon,
  ScissorsIcon,
  AcademicCapIcon,
  HomeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface Service {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  features: string[];
}

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);

  const services: Service[] = [
    {
      name: 'Pet Sitting',
      description: 'In-home pet sitting for when you\'re away',
      icon: HomeIcon,
      href: '/services/pet-sitting',
      color: 'bg-blue-500',
      features: ['In-home care', '24/7 supervision', 'Daily updates']
    },
    {
      name: 'Dog Walking',
      description: 'Regular walks to keep your dog healthy and happy',
      icon: UserGroupIcon,
      href: '/services/dog-walking',
      color: 'bg-green-500',
      features: ['Exercise & play', 'Socialization', 'GPS tracking']
    },
    {
      name: 'Pet Grooming',
      description: 'Professional grooming services for all pets',
      icon: ScissorsIcon,
      href: '/services/grooming',
      color: 'bg-purple-500',
      features: ['Bath & brush', 'Nail trimming', 'Styling']
    },
    {
      name: 'Pet Training',
      description: 'Expert training for behavioral issues',
      icon: AcademicCapIcon,
      href: '/services/training',
      color: 'bg-orange-500',
      features: ['Behavioral training', 'Obedience classes', 'Puppy training']
    },
    {
      name: 'Pet Transportation',
      description: 'Safe and comfortable pet transportation services',
      icon: TruckIcon,
      href: '/services/transportation',
      color: 'bg-indigo-500',
      features: ['Vet visits', 'Airport pickup', 'Emergency transport']
    },
    {
      name: 'Pet Health',
      description: 'Comprehensive health and wellness services',
      icon: HeartIcon,
      href: '/services/health',
      color: 'bg-red-500',
      features: ['Health checkups', 'Vaccinations', 'Emergency care']
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('services-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From daily walks to overnight stays, we offer a comprehensive range of 
            pet care services to meet all your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={service.name}
              href={service.href}
              className={`group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              } hover:-translate-y-2`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Service Icon */}
              <div className={`${service.color} p-8 text-center`}>
                <service.icon className="h-16 w-16 text-white mx-auto" />
              </div>
              
              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Learn More */}
                <div className="mt-4 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-200">
                  Learn More →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Service Categories */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Service Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Daily Care</h4>
              <p className="text-gray-600 text-sm">Walking, feeding, and basic care services</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Overnight Care</h4>
              <p className="text-gray-600 text-sm">Extended stays and 24/7 supervision</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Specialized Services</h4>
              <p className="text-gray-600 text-sm">Grooming, training, and health services</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
