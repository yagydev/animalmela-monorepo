'use client';

import { useEffect, useState } from 'react';
import { 
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);

  const features: Feature[] = [
    {
      icon: HeartIcon,
      title: 'Trusted Pet Care',
      description: 'Verified pet sitters and walkers with background checks and insurance coverage.',
      color: 'text-red-500'
    },
    {
      icon: MapPinIcon,
      title: 'Local Services',
      description: 'Find pet care services in your neighborhood with real-time availability.',
      color: 'text-blue-500'
    },
    {
      icon: ClockIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for peace of mind.',
      color: 'text-green-500'
    },
    {
      icon: StarIcon,
      title: 'Verified Reviews',
      description: 'Real reviews from real pet owners to help you make the best choice.',
      color: 'text-yellow-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Pet Insurance',
      description: 'Comprehensive insurance coverage for your pets during their care.',
      color: 'text-purple-500'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Updates',
      description: 'Stay connected with photo updates and messages from your pet sitter.',
      color: 'text-indigo-500'
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

    const element = document.getElementById('features-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose AnimalMela?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing the best pet care experience with safety, 
            reliability, and love at the heart of everything we do.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`text-center p-6 rounded-xl hover:shadow-lg transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              } hover:-translate-y-2`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-50 rounded-full group-hover:bg-primary-50 transition-colors duration-200">
                  <feature.icon className={`h-12 w-12 ${feature.color} group-hover:text-primary-600 transition-colors duration-200`} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of pet owners who have discovered the peace of mind that comes with trusted, 
              professional pet care services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/services"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Find Services Now
              </a>
              <a
                href="/about"
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
