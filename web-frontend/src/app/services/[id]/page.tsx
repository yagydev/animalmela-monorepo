'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HeartIcon,
  UserGroupIcon,
  ScissorsIcon,
  AcademicCapIcon,
  HomeIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  provider: {
    name: string;
    avatar: string;
    verified: boolean;
    email: string;
    phone: string;
    joinDate: string;
    totalServices: number;
    responseTime: string;
  };
  features: string[];
  detailedDescription: string;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  gallery: string[];
  policies: {
    cancellation: string;
    refund: string;
    emergency: string;
  };
  requirements: string[];
  included: string[];
  notIncluded: string[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Mock data - in real app, this would come from API
  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Professional Pet Sitting',
      description: 'In-home pet sitting with 24/7 care and daily updates',
      detailedDescription: 'Our professional pet sitting service provides comprehensive in-home care for your beloved pets. With over 5 years of experience, we ensure your pets receive the same love and attention they get at home. Our certified pet sitters are trained in pet first aid and behavior management.',
      price: 45,
      rating: 4.9,
      reviews: 127,
      location: 'Downtown',
      image: '/images/services/pet-sitting.jpg',
      icon: HomeIcon,
      category: 'sitting',
      provider: {
        name: 'Sarah Johnson',
        avatar: '/images/avatars/sarah.jpg',
        verified: true,
        email: 'sarah@kisaanmela.com',
        phone: '+1 (555) 123-4567',
        joinDate: '2020-03-15',
        totalServices: 450,
        responseTime: 'Within 2 hours'
      },
      features: ['24/7 supervision', 'Daily updates', 'Medication administration', 'Exercise & play', 'Feeding & watering', 'Emergency care'],
      availability: {
        monday: ['9:00 AM - 6:00 PM'],
        tuesday: ['9:00 AM - 6:00 PM'],
        wednesday: ['9:00 AM - 6:00 PM'],
        thursday: ['9:00 AM - 6:00 PM'],
        friday: ['9:00 AM - 6:00 PM'],
        saturday: ['10:00 AM - 4:00 PM'],
        sunday: ['10:00 AM - 4:00 PM']
      },
      gallery: [
        '/images/services/pet-sitting-1.jpg',
        '/images/services/pet-sitting-2.jpg',
        '/images/services/pet-sitting-3.jpg'
      ],
      policies: {
        cancellation: 'Free cancellation up to 24 hours before service',
        refund: 'Full refund if service is not satisfactory',
        emergency: '24/7 emergency contact available'
      },
      requirements: ['Pet must be up to date on vaccinations', 'Emergency contact information required', 'Pet must be socialized'],
      included: ['Feeding', 'Exercise', 'Medication administration', 'Daily updates', 'Emergency care'],
      notIncluded: ['Veterinary services', 'Grooming', 'Training sessions']
    },
    {
      id: '2',
      name: 'Daily Dog Walking',
      description: 'Regular walks to keep your dog healthy and happy',
      detailedDescription: 'Professional dog walking services designed to keep your furry friend healthy, happy, and well-exercised. Our experienced walkers provide personalized attention and ensure your dog gets the physical activity they need.',
      price: 25,
      rating: 4.8,
      reviews: 89,
      location: 'Midtown',
      image: '/images/services/dog-walking.jpg',
      icon: UserGroupIcon,
      category: 'walking',
      provider: {
        name: 'Mike Chen',
        avatar: '/images/avatars/mike.jpg',
        verified: true,
        email: 'mike@kisaanmela.com',
        phone: '+1 (555) 234-5678',
        joinDate: '2019-08-22',
        totalServices: 320,
        responseTime: 'Within 1 hour'
      },
      features: ['GPS tracking', 'Exercise & play', 'Socialization', 'Route customization', 'Weather protection', 'Photo updates'],
      availability: {
        monday: ['7:00 AM - 7:00 PM'],
        tuesday: ['7:00 AM - 7:00 PM'],
        wednesday: ['7:00 AM - 7:00 PM'],
        thursday: ['7:00 AM - 7:00 PM'],
        friday: ['7:00 AM - 7:00 PM'],
        saturday: ['8:00 AM - 6:00 PM'],
        sunday: ['8:00 AM - 6:00 PM']
      },
      gallery: [
        '/images/services/dog-walking-1.jpg',
        '/images/services/dog-walking-2.jpg',
        '/images/services/dog-walking-3.jpg'
      ],
      policies: {
        cancellation: 'Free cancellation up to 2 hours before walk',
        refund: 'Full refund if walk is cancelled due to weather',
        emergency: 'Emergency contact available during walk hours'
      },
      requirements: ['Dog must be leash trained', 'Current vaccination records', 'Emergency contact information'],
      included: ['30-60 minute walks', 'GPS tracking', 'Photo updates', 'Water breaks', 'Basic training reinforcement'],
      notIncluded: ['Off-leash activities', 'Training sessions', 'Multiple dogs (unless requested)']
    },
    {
      id: '3',
      name: 'Premium Pet Grooming',
      description: 'Professional grooming services for all pets',
      detailedDescription: 'Complete grooming services for dogs and cats of all sizes and breeds. Our certified groomers use premium products and gentle techniques to ensure your pet looks and feels their best.',
      price: 65,
      rating: 4.9,
      reviews: 156,
      location: 'Uptown',
      image: '/images/services/grooming.jpg',
      icon: ScissorsIcon,
      category: 'grooming',
      provider: {
        name: 'Emma Davis',
        avatar: '/images/avatars/emma.jpg',
        verified: true,
        email: 'emma@kisaanmela.com',
        phone: '+1 (555) 345-6789',
        joinDate: '2021-01-10',
        totalServices: 280,
        responseTime: 'Within 3 hours'
      },
      features: ['Bath & brush', 'Nail trimming', 'Styling', 'Ear cleaning', 'Teeth brushing', 'De-shedding treatment'],
      availability: {
        monday: ['8:00 AM - 5:00 PM'],
        tuesday: ['8:00 AM - 5:00 PM'],
        wednesday: ['8:00 AM - 5:00 PM'],
        thursday: ['8:00 AM - 5:00 PM'],
        friday: ['8:00 AM - 5:00 PM'],
        saturday: ['9:00 AM - 3:00 PM'],
        sunday: ['Closed']
      },
      gallery: [
        '/images/services/grooming-1.jpg',
        '/images/services/grooming-2.jpg',
        '/images/services/grooming-3.jpg'
      ],
      policies: {
        cancellation: 'Free cancellation up to 24 hours before appointment',
        refund: 'Full refund if grooming is unsatisfactory',
        emergency: 'Emergency grooming available for medical needs'
      },
      requirements: ['Pet must be healthy', 'Current vaccination records', 'Previous grooming history helpful'],
      included: ['Full bath', 'Brushing', 'Nail trimming', 'Ear cleaning', 'Styling', 'De-shedding'],
      notIncluded: ['Medical treatments', 'Flea/tick treatment', 'Specialty styling (extra charge)']
    },
    {
      id: '4',
      name: 'Expert Pet Training',
      description: 'Behavioral training and obedience classes',
      detailedDescription: 'Professional pet training services focusing on positive reinforcement techniques. Our certified trainers work with pets of all ages to address behavioral issues and teach essential commands.',
      price: 80,
      rating: 4.7,
      reviews: 73,
      location: 'Westside',
      image: '/images/services/training.jpg',
      icon: AcademicCapIcon,
      category: 'training',
      provider: {
        name: 'David Wilson',
        avatar: '/images/avatars/david.jpg',
        verified: true,
        email: 'david@kisaanmela.com',
        phone: '+1 (555) 456-7890',
        joinDate: '2018-11-05',
        totalServices: 190,
        responseTime: 'Within 4 hours'
      },
      features: ['Behavioral training', 'Obedience classes', 'Puppy training', 'Aggression management', 'House training', 'Socialization'],
      availability: {
        monday: ['9:00 AM - 5:00 PM'],
        tuesday: ['9:00 AM - 5:00 PM'],
        wednesday: ['9:00 AM - 5:00 PM'],
        thursday: ['9:00 AM - 5:00 PM'],
        friday: ['9:00 AM - 5:00 PM'],
        saturday: ['10:00 AM - 3:00 PM'],
        sunday: ['Closed']
      },
      gallery: [
        '/images/services/training-1.jpg',
        '/images/services/training-2.jpg',
        '/images/services/training-3.jpg'
      ],
      policies: {
        cancellation: 'Free cancellation up to 48 hours before session',
        refund: 'Full refund if training goals are not met',
        emergency: 'Emergency behavior consultation available'
      },
      requirements: ['Pet must be healthy', 'Owner participation required', 'Previous training history'],
      included: ['Training session', 'Follow-up support', 'Training materials', 'Progress reports', 'Owner education'],
      notIncluded: ['Training equipment', 'Follow-up sessions (extra charge)', 'Group classes (separate pricing)']
    },
    {
      id: '5',
      name: 'Pet Transportation',
      description: 'Safe and comfortable pet transportation services',
      detailedDescription: 'Professional pet transportation services for vet visits, airport pickups, and other travel needs. Our experienced drivers ensure your pet travels safely and comfortably.',
      price: 35,
      rating: 4.8,
      reviews: 45,
      location: 'Eastside',
      image: '/images/services/transport.jpg',
      icon: TruckIcon,
      category: 'transport',
      provider: {
        name: 'Lisa Rodriguez',
        avatar: '/images/avatars/lisa.jpg',
        verified: true,
        email: 'lisa@kisaanmela.com',
        phone: '+1 (555) 567-8901',
        joinDate: '2020-06-18',
        totalServices: 120,
        responseTime: 'Within 1 hour'
      },
      features: ['Vet visits', 'Airport pickup', 'Emergency transport', 'Climate controlled vehicles', 'Safety restraints', 'Real-time tracking'],
      availability: {
        monday: ['6:00 AM - 8:00 PM'],
        tuesday: ['6:00 AM - 8:00 PM'],
        wednesday: ['6:00 AM - 8:00 PM'],
        thursday: ['6:00 AM - 8:00 PM'],
        friday: ['6:00 AM - 8:00 PM'],
        saturday: ['7:00 AM - 6:00 PM'],
        sunday: ['7:00 AM - 6:00 PM']
      },
      gallery: [
        '/images/services/transport-1.jpg',
        '/images/services/transport-2.jpg',
        '/images/services/transport-3.jpg'
      ],
      policies: {
        cancellation: 'Free cancellation up to 2 hours before pickup',
        refund: 'Full refund if transport is cancelled',
        emergency: '24/7 emergency transport available'
      },
      requirements: ['Pet must be in carrier', 'Current vaccination records', 'Emergency contact information'],
      included: ['Safe transport', 'Climate control', 'Safety restraints', 'Real-time updates', 'Insurance coverage'],
      notIncluded: ['Pet carrier (if not provided)', 'Overnight stays', 'International transport']
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchService = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundService = mockServices.find(s => s.id === serviceId);
        if (foundService) {
          setService(foundService);
        } else {
          toast.error('Service not found');
          router.push('/services');
        }
      } catch (error) {
        toast.error('Failed to load service details');
        router.push('/services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, router]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    
    toast.success('Booking request sent! Provider will contact you soon.');
    setShowBookingModal(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.name,
        text: service?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <Link
            href="/services"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/services"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Services
              </Link>
              <div className="h-6 w-px bg-gray-300 mr-4"></div>
              <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleFavorite}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
              >
                {isFavorited ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <div className="h-96 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <service.icon className="h-24 w-24 text-primary-600" />
                </div>
              </div>
              {service.gallery && service.gallery.length > 0 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {service.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-primary-500' : ''
                        }`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <service.icon className="h-8 w-8 text-primary-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Service Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Service</h2>
              <p className="text-gray-600 leading-relaxed">{service.detailedDescription}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Provider</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{service.provider.name}</h3>
                    {service.provider.verified && (
                      <ShieldCheckIcon className="h-5 w-5 text-green-500 ml-2" />
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Total Services:</strong> {service.provider.totalServices}</p>
                      <p><strong>Response Time:</strong> {service.provider.responseTime}</p>
                    </div>
                    <div>
                      <p><strong>Member Since:</strong> {new Date(service.provider.joinDate).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {service.location}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex items-center px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Call
                    </button>
                    <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(service.availability).map(([day, times]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                    <span className="text-gray-600">
                      {times.length > 0 ? times.join(', ') : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Policies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Cancellation Policy</h3>
                  <p className="text-gray-600">{service.policies.cancellation}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Refund Policy</h3>
                  <p className="text-gray-600">{service.policies.refund}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Emergency Policy</h3>
                  <p className="text-gray-600">{service.policies.emergency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-primary-600">${service.price}</span>
                  <span className="text-gray-500">/service</span>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="text-lg font-semibold text-gray-900">{service.rating}</span>
                    <span className="text-gray-500 ml-1">({service.reviews} reviews)</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 mb-4"
                >
                  Book Now
                </button>

                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                  Message Provider
                </button>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {service.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Included/Not Included */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                <ul className="space-y-2 mb-4">
                  {service.included.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Not Included</h3>
                <ul className="space-y-2">
                  {service.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="h-4 w-4 border border-gray-300 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Service</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Choose time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Notes (Optional)
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
