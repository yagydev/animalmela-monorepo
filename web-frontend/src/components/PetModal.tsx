'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
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

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet?: Pet | null;
  onSave: (petData: Partial<Pet>) => void;
  mode: 'add' | 'edit';
}

export default function PetModal({ isOpen, onClose, pet, onSave, mode }: PetModalProps) {
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: '',
    type: 'dog',
    breed: '',
    age: 0,
    weight: 0,
    gender: 'male',
    color: '',
    description: '',
    medicalNotes: '',
    specialNeeds: [],
    vaccinations: [],
    owner: {
      name: '',
      email: '',
      phone: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    vetInfo: {
      name: '',
      clinic: '',
      phone: '',
      address: ''
    }
  });

  const [newSpecialNeed, setNewSpecialNeed] = useState('');
  const [newVaccination, setNewVaccination] = useState({
    name: '',
    date: '',
    nextDue: ''
  });

  useEffect(() => {
    if (mode === 'edit' && pet) {
      setFormData(pet);
    } else {
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        age: 0,
        weight: 0,
        gender: 'male',
        color: '',
        description: '',
        medicalNotes: '',
        specialNeeds: [],
        vaccinations: [],
        owner: {
          name: '',
          email: '',
          phone: ''
        },
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        vetInfo: {
          name: '',
          clinic: '',
          phone: '',
          address: ''
        }
      });
    }
  }, [mode, pet, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof Pet],
        [field]: value
      }
    }));
  };

  const addSpecialNeed = () => {
    if (newSpecialNeed.trim()) {
      setFormData(prev => ({
        ...prev,
        specialNeeds: [...(prev.specialNeeds || []), newSpecialNeed.trim()]
      }));
      setNewSpecialNeed('');
    }
  };

  const removeSpecialNeed = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds?.filter((_, i) => i !== index) || []
    }));
  };

  const addVaccination = () => {
    if (newVaccination.name.trim() && newVaccination.date && newVaccination.nextDue) {
      setFormData(prev => ({
        ...prev,
        vaccinations: [...(prev.vaccinations || []), { ...newVaccination }]
      }));
      setNewVaccination({ name: '', date: '', nextDue: '' });
    }
  };

  const removeVaccination = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vaccinations: prev.vaccinations?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name?.trim()) {
      toast.error('Pet name is required');
      return;
    }
    if (!formData.breed?.trim()) {
      toast.error('Pet breed is required');
      return;
    }
    if (!formData.owner?.name?.trim()) {
      toast.error('Owner name is required');
      return;
    }

    const petData = {
      ...formData,
      id: mode === 'edit' ? pet?.id : Date.now().toString(),
      createdAt: mode === 'edit' ? pet?.createdAt : new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      image: formData.image || '/images/pets/default.jpg',
      gallery: formData.gallery || []
    };

    onSave(petData);
    toast.success(mode === 'add' ? 'Pet added successfully!' : 'Pet updated successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Pet' : 'Edit Pet'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter pet name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Type
                </label>
                <select
                  value={formData.type || 'dog'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="fish">Fish</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breed *
                </label>
                <input
                  type="text"
                  value={formData.breed || ''}
                  onChange={(e) => handleInputChange('breed', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter breed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender || 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.age || 0}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight || 0}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color || ''}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter color"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe your pet's personality and characteristics"
            />
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Notes
              </label>
              <textarea
                value={formData.medicalNotes || ''}
                onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any medical conditions, allergies, or special care instructions"
              />
            </div>

            {/* Special Needs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Needs
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSpecialNeed}
                  onChange={(e) => setNewSpecialNeed(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add special need"
                />
                <button
                  type="button"
                  onClick={addSpecialNeed}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialNeeds?.map((need, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {need}
                    <button
                      type="button"
                      onClick={() => removeSpecialNeed(index)}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Vaccinations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vaccinations
              </label>
              <div className="space-y-2 mb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newVaccination.name}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Vaccination name"
                  />
                  <input
                    type="date"
                    value={newVaccination.date}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, date: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="date"
                    value={newVaccination.nextDue}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, nextDue: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={addVaccination}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Vaccination
                </button>
              </div>
              <div className="space-y-2">
                {formData.vaccinations?.map((vaccination, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{vaccination.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(vaccination.date).toLocaleDateString()} - {new Date(vaccination.nextDue).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVaccination(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.owner?.name || ''}
                  onChange={(e) => handleNestedInputChange('owner', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter owner name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.owner?.email || ''}
                  onChange={(e) => handleNestedInputChange('owner', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.owner?.phone || ''}
                  onChange={(e) => handleNestedInputChange('owner', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Spouse, Parent, Friend"
                />
              </div>
            </div>
          </div>

          {/* Veterinarian Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Veterinarian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinarian Name
                </label>
                <input
                  type="text"
                  value={formData.vetInfo?.name || ''}
                  onChange={(e) => handleNestedInputChange('vetInfo', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter vet name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={formData.vetInfo?.clinic || ''}
                  onChange={(e) => handleNestedInputChange('vetInfo', 'clinic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter clinic name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.vetInfo?.phone || ''}
                  onChange={(e) => handleNestedInputChange('vetInfo', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.vetInfo?.address || ''}
                  onChange={(e) => handleNestedInputChange('vetInfo', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter clinic address"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              {mode === 'add' ? 'Add Pet' : 'Update Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


