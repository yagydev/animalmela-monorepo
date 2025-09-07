'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon,
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
  EyeIcon
} from '@heroicons/react/24/outline';
import PetModal from '@/components/PetModal';
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

export default function PetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [filterType, setFilterType] = useState('all');

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
      description: 'Friendly and energetic dog who loves playing fetch and going for walks.',
      medicalNotes: 'Allergic to chicken. Takes medication for hip dysplasia.',
      specialNeeds: ['Daily medication', 'Hip support', 'Low-impact exercise'],
      vaccinations: [
        { name: 'Rabies', date: '2023-01-15', nextDue: '2024-01-15' },
        { name: 'DHPP', date: '2023-01-15', nextDue: '2024-01-15' },
        { name: 'Bordetella', date: '2023-06-15', nextDue: '2024-06-15' }
      ],
      owner: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0123'
      },
      createdAt: '2023-01-01',
      lastUpdated: '2023-12-01',
      gallery: ['/images/pets/buddy-1.jpg', '/images/pets/buddy-2.jpg'],
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
      description: 'Calm and affectionate cat who enjoys quiet environments.',
      medicalNotes: 'Regular grooming required due to long fur.',
      specialNeeds: ['Daily grooming', 'Quiet environment'],
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
      gallery: ['/images/pets/whiskers-1.jpg'],
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
      description: 'Social bird who loves to sing and interact with people.',
      medicalNotes: 'Requires daily interaction and mental stimulation.',
      specialNeeds: ['Daily interaction', 'Mental stimulation', 'Special diet'],
      vaccinations: [],
      owner: {
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1-555-0789'
      },
      createdAt: '2023-03-10',
      lastUpdated: '2023-10-10',
      gallery: ['/images/pets/charlie-1.jpg', '/images/pets/charlie-2.jpg'],
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
    setPets(mockPets);
  }, []);

  const filteredPets = filterType === 'all' 
    ? pets 
    : pets.filter(pet => pet.type === filterType);

  // CRUD Operations
  const handleAddPet = (petData: Partial<Pet>) => {
    const newPet: Pet = {
      ...petData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      image: petData.image || '/images/pets/default.jpg',
      gallery: petData.gallery || []
    } as Pet;
    
    setPets(prev => [...prev, newPet]);
    toast.success('Pet added successfully!');
  };

  const handleEditPet = (petData: Partial<Pet>) => {
    setPets(prev => prev.map(pet => 
      pet.id === petData.id 
        ? { ...pet, ...petData, lastUpdated: new Date().toISOString() }
        : pet
    ));
    toast.success('Pet updated successfully!');
  };

  const handleDeletePet = (petId: string) => {
    setPets(prev => prev.filter(pet => pet.id !== petId));
    toast.success('Pet deleted successfully!');
  };

  const handlePetClick = (petId: string) => {
    router.push(`/pets/${petId}`);
  };

  const openEditModal = (pet: Pet) => {
    setSelectedPet(pet);
    setShowEditModal(true);
  };

  const openDeleteModal = (pet: Pet) => {
    setSelectedPet(pet);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedPet(null);
  };

  const petTypes = [
    { id: 'all', name: 'All Pets', icon: UserIcon },
    { id: 'dog', name: 'Dogs', icon: UserIcon },
    { id: 'cat', name: 'Cats', icon: UserIcon },
    { id: 'bird', name: 'Birds', icon: UserIcon },
    { id: 'fish', name: 'Fish', icon: UserIcon },
    { id: 'rabbit', name: 'Rabbits', icon: UserIcon },
    { id: 'other', name: 'Other', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Pets</h1>
              <p className="text-gray-600">Manage your pet profiles and information</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Pet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {petTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filterType === type.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div 
              key={pet.id} 
              onClick={() => handlePetClick(pet.id)}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
            >
              {/* Pet Image */}
              <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                <PhotoIcon className="h-16 w-16 text-primary-600" />
                <div className="absolute top-4 right-4 flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => openEditModal(pet)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <PencilIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(pet)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Pet Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                    <p className="text-gray-600 capitalize">{pet.breed} • {pet.type}</p>
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full capitalize">
                    {pet.gender}
                  </span>
                </div>

                {/* Pet Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CakeIcon className="h-4 w-4 mr-2" />
                    <span>{pet.age} years old</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ScaleIcon className="h-4 w-4 mr-2" />
                    <span>{pet.weight} lbs</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TagIcon className="h-4 w-4 mr-2" />
                    <span>{pet.color}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pet.description}</p>

                {/* Special Needs */}
                {pet.specialNeeds.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {pet.specialNeeds.slice(0, 2).map((need, index) => (
                        <span
                          key={index}
                          className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                        >
                          {need}
                        </span>
                      ))}
                      {pet.specialNeeds.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{pet.specialNeeds.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Vaccination Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Vaccinations</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pet.vaccinations.length > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pet.vaccinations.length > 0 ? 'Up to date' : 'Needs attention'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                  <button 
                    onClick={() => openEditModal(pet)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterType === 'all' ? 'No pets added yet' : `No ${filterType}s found`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filterType === 'all' 
                ? 'Add your first pet to get started with pet care services'
                : `Try adding a ${filterType} or switch to view all pets`
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add Pet
            </button>
          </div>
        )}
      </div>

      {/* Add Pet Modal */}
      <PetModal
        isOpen={showAddModal}
        onClose={closeModals}
        onSave={handleAddPet}
        mode="add"
      />

      {/* Edit Pet Modal */}
      <PetModal
        isOpen={showEditModal}
        onClose={closeModals}
        pet={selectedPet}
        onSave={handleEditPet}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Delete Pet Profile</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedPet.name}</strong>'s profile? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeModals}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeletePet(selectedPet.id);
                  closeModals();
                }}
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
