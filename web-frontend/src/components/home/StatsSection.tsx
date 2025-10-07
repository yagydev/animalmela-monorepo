'use client';

import { useEffect, useState } from 'react';

interface StatItem {
  number: string;
  label: string;
  icon?: string;
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  const stats: StatItem[] = [
    { number: '10,000+', label: 'Happy Pets', icon: '🐾' },
    { number: '5,000+', label: 'Trusted Sitters', icon: '👥' },
    { number: '50,000+', label: 'Services Completed', icon: '✅' },
    { number: '4.9/5', label: 'Average Rating', icon: '⭐' },
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

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`text-center transform transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">
                <span className="text-4xl">{stat.icon}</span>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of pet owners who trust Kisaanmela for their pet care needs. 
            Our verified sitters have completed over 50,000 successful bookings with an average rating of 4.9/5 stars.
          </p>
        </div>
      </div>
    </section>
  );
}
