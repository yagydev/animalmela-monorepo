'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  HeartIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  CakeIcon,
  ScaleIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'other';
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color: string;
  image: string;
  description: string;
  medicalNotes: string;
  specialNeeds: string[];
  vaccinations: {
    name: string;
    date: string;
    nextDue: string;
  }[];
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  lastUpdated: string;
  gallery: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  vetInfo: {
    name: string;
    clinic: string;
    phone: string;
    address: string;
  };
}

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - in real app, this would come from API
  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'Buddy',
      type: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      weight: 65,
      gender: 'male',
      color: 'Golden',
      image: '/images/pets/buddy.jpg',
      description: 'Friendly and energetic dog who loves playing fetch and going for walks. Buddy is very social and gets along well with other dogs and people. He enjoys outdoor activities and is always ready for an adventure.',
      medicalNotes: 'Allergic to chicken. Takes medication for hip dysplasia. Regular check-ups every 6 months. Sensitive to certain cleaning products.',
      specialNeeds: ['Daily medication', 'Hip support', 'Low-impact exercise', 'Special diet'],
      vaccinations: [
        { name: 'Rabies', date: '2023-01-15', nextDue: '2024-01-15' },
        { name: 'DHPP', date: '2023-01-15', nextDue: '2024-01-15' },
        { name: 'Bordetella', date: '2023-06-15', nextDue: '2024-06-15' },
        { name: 'Lyme Disease', date: '2023-04-10', nextDue: '2024-04-10' }
      ],
      owner: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0123'
      },
      createdAt: '2023-01-01',
      lastUpdated: '2023-12-01',
      gallery: [
        '/images/pets/buddy-1.jpg',
        '/images/pets/buddy-2.jpg',
        '/images/pets/buddy-3.jpg'
      ],
      emergencyContact: {
        name: 'Sarah Smith',
        phone: '+1-555-0124',
        relationship: 'Spouse'
      },
      vetInfo: {
        name: 'Dr. Emily Johnson',
        clinic: 'Downtown Veterinary Clinic',
        phone: '+1-555-0900',
        address: '123 Main St, Downtown'
      }
    },
    {
      id: '2',
      name: 'Whiskers',
      type: 'cat',
      breed: 'Persian',
      age: 5,
      weight: 12,
      gender: 'female',
      color: 'White',
      image: '/images/pets/whiskers.jpg',
      description: 'Calm and affectionate cat who enjoys quiet environments. Whiskers is very gentle and loves to be pampered. She prefers indoor activities and enjoys watching birds from the window.',
      medicalNotes: 'Regular grooming required due to long fur. Prone to hairballs. Annual dental cleaning recommended.',
      specialNeeds: ['Daily grooming', 'Quiet environment', 'Hairball prevention'],
      vaccinations: [
        { name: 'Rabies', date: '2023-03-20', nextDue: '2024-03-20' },
        { name: 'FVRCP', date: '2023-03-20', nextDue: '2024-03-20' }
      ],
      owner: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-0456'
      },
      createdAt: '2023-02-15',
      lastUpdated: '2023-11-15',
      gallery: [
        '/images/pets/whiskers-1.jpg',
        '/images/pets/whiskers-2.jpg'
      ],
      emergencyContact: {
        name: 'Mike Johnson',
        phone: '+1-555-0457',
        relationship: 'Brother'
      },
      vetInfo: {
        name: 'Dr. Robert Chen',
        clinic: 'Cat Care Center',
        phone: '+1-555-0901',
        address: '456 Oak Ave, Midtown'
      }
    },
    {
      id: '3',
      name: 'Charlie',
      type: 'bird',
      breed: 'Cockatiel',
      age: 2,
      weight: 0.1,
      gender: 'male',
      color: 'Yellow/Gray',
      image: '/images/pets/charlie.jpg',
      description: 'Social bird who loves to sing and interact with people. Charlie is very intelligent and can learn tricks. He enjoys being out of his cage and socializing with family members.',
      medicalNotes: 'Requires daily interaction and mental stimulation. Sensitive to temperature changes. Regular wing clipping needed.',
      specialNeeds: ['Daily interaction', 'Mental stimulation', 'Special diet', 'Temperature control'],
      vaccinations: [],
      owner: {
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1-555-0789'
      },
      createdAt: '2023-03-10',
      lastUpdated: '2023-10-10',
      gallery: [
        '/images/pets/charlie-1.jpg',
        '/images/pets/charlie-2.jpg',
        '/images/pets/charlie-3.jpg'
      ],
      emergencyContact: {
        name: 'Lisa Chen',
        phone: '+1-555-0790',
        relationship: 'Sister'
      },
      vetInfo: {
        name: 'Dr. Amanda Wilson',
        clinic: 'Avian Veterinary Services',
        phone: '+1-555-0902',
        address: '789 Pine St, Uptown'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchPet = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundPet = mockPets.find(p => p.id === petId);
        if (foundPet) {
          setPet(foundPet);
        } else {
          toast.error('Pet not found');
          router.push('/pets');
        }
      } catch (error) {
        toast.error('Failed to load pet details');
        router.push('/pets');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, router]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleDelete = () => {
    toast.success('Pet deleted successfully');
    setShowDeleteModal(false);
    router.push('/pets');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pet?.name}'s Profile`,
        text: `Check out ${pet?.name}'s pet profile on Animall`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const getPetTypeIcon = (type: string) => {
    switch (type) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🐦';
      case 'fish': return '🐠';
      case 'rabbit': return '🐰';
      default: return '🐾';
    }
  };

  const getVaccinationStatus = (vaccinations: Pet['vaccinations']) => {
    const now = new Date();
    const upcoming = vaccinations.filter(v => new Date(v.nextDue) <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
    const overdue = vaccinations.filter(v => new Date(v.nextDue) < now);
    
    if (overdue.length > 0) return { status: 'overdue', count: overdue.length };
    if (upcoming.length > 0) return { status: 'upcoming', count: upcoming.length };
    return { status: 'current', count: 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h2>
          <p className="text-gray-600 mb-4">The pet you're looking for doesn't exist.</p>
          <Link
            href="/pets"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Pets
          </Link>
        </div>
      </div>
    );
  }

  const vaccinationStatus = getVaccinationStatus(pet.vaccinations);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/pets"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Pets
              </Link>
              <div className="h-6 w-px bg-gray-300 mr-4"></div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getPetTypeIcon(pet.type)}</span>
                <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
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
            {/* Pet Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <div className="h-96 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <PhotoIcon className="h-24 w-24 text-primary-600" />
                </div>
              </div>
              {pet.gallery && pet.gallery.length > 0 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {pet.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-primary-500' : ''
                        }`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <PhotoIcon className="h-8 w-8 text-primary-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pet Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pet Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg text-gray-900">{pet.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Breed</label>
                    <p className="text-gray-900">{pet.breed}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">{pet.age} years old</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Weight</label>
                    <p className="text-gray-900">{pet.weight} lbs</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900 capitalize">{pet.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Color</label>
                    <p className="text-gray-900">{pet.color}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900 capitalize">{pet.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Added</label>
                    <p className="text-gray-900">{new Date(pet.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{pet.description}</p>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Medical Notes</label>
                  <p className="text-gray-600 mt-1">{pet.medicalNotes}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Special Needs</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pet.specialNeeds.map((need, index) => (
                      <span
                        key={index}
                        className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full"
                      >
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vaccinations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Vaccinations</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vaccinationStatus.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  vaccinationStatus.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {vaccinationStatus.status === 'overdue' ? `${vaccinationStatus.count} Overdue` :
                   vaccinationStatus.status === 'upcoming' ? `${vaccinationStatus.count} Due Soon` :
                   'Up to Date'}
                </span>
              </div>
              {pet.vaccinations.length > 0 ? (
                <div className="space-y-3">
                  {pet.vaccinations.map((vaccination, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{vaccination.name}</p>
                        <p className="text-sm text-gray-600">
                          Last: {new Date(vaccination.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Next Due: {new Date(vaccination.nextDue).toLocaleDateString()}
                        </p>
                        {new Date(vaccination.nextDue) < new Date() && (
                          <span className="text-xs text-red-600 font-medium">Overdue</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No vaccination records available</p>
              )}
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Owner Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{pet.owner.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{pet.owner.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{pet.owner.phone}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{pet.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{pet.emergencyContact.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="text-gray-900">{pet.emergencyContact.relationship}</p>
                </div>
              </div>
            </div>

            {/* Veterinarian Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Veterinarian</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Veterinarian</label>
                  <p className="text-gray-900">{pet.vetInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Clinic</label>
                  <p className="text-gray-900">{pet.vetInfo.clinic}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{pet.vetInfo.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{pet.vetInfo.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Pet
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    Call Vet
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    Message Owner
                  </button>
                </div>
              </div>

              {/* Health Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vaccinations</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vaccinationStatus.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      vaccinationStatus.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {vaccinationStatus.status === 'overdue' ? 'Overdue' :
                       vaccinationStatus.status === 'upcoming' ? 'Due Soon' :
                       'Current'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Special Needs</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {pet.specialNeeds.length} Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {new Date(pet.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete a pet profile, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Delete Pet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Delete Pet Profile</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{pet.name}</strong>'s profile? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Delete Pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


