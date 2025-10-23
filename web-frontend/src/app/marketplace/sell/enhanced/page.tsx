'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  PhotoIcon, 
  MapPinIcon, 
  TagIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  description: string;
  category: 'equipment' | 'livestock' | 'product';
  condition: 'new' | 'used' | 'reconditioned';
  price: number;
  images: string[];
  location: string;
  sellerId: string;
  tags: string[];
  quantity?: number;
  unit?: string;
  specifications: Record<string, any>;
  // Enhanced fields
  brandBreedVariety?: string;
  yearOfPurchase?: number;
  conditionSummary?: string;
  deliveryOptions?: string[];
  paymentMethods?: string[];
  warrantyDocs?: string[];
  seoTags?: string[];
  safetyChecklist?: Record<string, boolean>;
}

const categories = [
  { id: 'equipment', name: 'Agricultural Equipment', icon: '🚜', description: 'Farm machinery, tools, and equipment' },
  { id: 'livestock', name: 'Livestock & Cattle', icon: '🐄', description: 'Cattle, poultry, and other farm animals' },
  { id: 'product', name: 'Agricultural Produce', icon: '🌾', description: 'Fresh fruits, vegetables, grains, and produce' },
];

const conditions = [
  { id: 'new', name: 'New', description: 'Brand new, never used' },
  { id: 'used', name: 'Used', description: 'Previously owned, good condition' },
  { id: 'reconditioned', name: 'Reconditioned', description: 'Refurbished to like-new condition' },
];

const units = [
  { id: 'kg', name: 'Kilogram' },
  { id: 'quintal', name: 'Quintal' },
  { id: 'ton', name: 'Ton' },
  { id: 'piece', name: 'Piece' },
  { id: 'dozen', name: 'Dozen' },
  { id: 'box', name: 'Box' },
  { id: 'bag', name: 'Bag' },
];

const deliveryOptions = [
  { id: 'local-pickup', name: 'Local Pickup' },
  { id: 'delivery-available', name: 'Delivery Available' },
  { id: 'on-request', name: 'On Request' },
];

const paymentMethods = [
  { id: 'upi', name: 'UPI' },
  { id: 'cash', name: 'Cash' },
  { id: 'transporter-payment', name: 'Transporter Payment' },
  { id: 'bank-transfer', name: 'Bank Transfer' },
];

const safetyChecklistItems = [
  { id: 'accurate-pricing', label: 'Accurate pricing and ownership proof uploaded' },
  { id: 'photos-match', label: 'Photos and description match real item' },
  { id: 'contact-verified', label: 'Contact details verified via OTP' },
  { id: 'public-meeting', label: 'Meet in public location for trade if possible' },
];

const categorySpecs = {
  equipment: [
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., Mahindra, John Deere' },
    { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g., 605 DI, 5050' },
    { key: 'year', label: 'Year of Purchase', type: 'number', placeholder: 'YYYY' },
    { key: 'hours', label: 'Operating Hours', type: 'number', placeholder: 'Total hours used' },
    { key: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Diesel', 'Petrol', 'Electric', 'CNG'] },
    { key: 'power', label: 'Power (HP)', type: 'number', placeholder: 'Engine power' },
    { key: 'maintenance', label: 'Last Service', type: 'date', placeholder: 'Last maintenance date' },
  ],
  livestock: [
    { key: 'breed', label: 'Breed', type: 'text', placeholder: 'e.g., Gir, Holstein, Cross-bred' },
    { key: 'age', label: 'Age', type: 'text', placeholder: 'e.g., 3 years, 18 months' },
    { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Current weight' },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
    { key: 'vaccinated', label: 'Vaccinated', type: 'select', options: ['Yes', 'No'] },
    { key: 'healthStatus', label: 'Health Status', type: 'text', placeholder: 'e.g., Excellent, Good' },
    { key: 'pregnancy', label: 'Pregnancy Status', type: 'select', options: ['Not Pregnant', 'Pregnant', 'Unknown'] },
  ],
  product: [
    { key: 'variety', label: 'Variety', type: 'text', placeholder: 'e.g., Basmati, IR64, Alphonso' },
    { key: 'grade', label: 'Grade', type: 'select', options: ['A', 'B', 'C', 'Premium'] },
    { key: 'harvestDate', label: 'Harvest Date', type: 'date', placeholder: 'When was it harvested?' },
    { key: 'storage', label: 'Storage Method', type: 'text', placeholder: 'e.g., Dry storage, Cold storage' },
    { key: 'organic', label: 'Organic Certified', type: 'select', options: ['Yes', 'No'] },
    { key: 'pesticideFree', label: 'Pesticide Free', type: 'select', options: ['Yes', 'No'] },
    { key: 'moisture', label: 'Moisture Content (%)', type: 'number', placeholder: 'Moisture percentage' },
  ],
};

export default function EnhancedSellListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: (categoryParam as 'equipment' | 'livestock' | 'product') || 'equipment',
    condition: 'new',
    price: 0,
    images: [],
    location: '',
    sellerId: 'temp-seller-id',
    tags: [],
    quantity: undefined,
    unit: '',
    specifications: {},
    brandBreedVariety: '',
    yearOfPurchase: undefined,
    conditionSummary: '',
    deliveryOptions: [],
    paymentMethods: [],
    warrantyDocs: [],
    seoTags: [],
    safetyChecklist: {},
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle tag input
  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle specification changes
  const handleSpecChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  // AI-assisted description generation
  const generateAIDescription = async () => {
    if (!formData.name || !formData.category) {
      setError('Please fill in the item name and category first');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/marketplace/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: formData.name,
          category: formData.category,
          condition: formData.condition,
          price: formData.price,
          quantity: formData.quantity,
          location: formData.location,
          brandBreedVariety: formData.brandBreedVariety,
          conditionSummary: formData.conditionSummary,
          specifications: formData.specifications
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          name: result.data.title,
          description: result.data.description,
          seoTags: result.data.tags,
          tags: [...prev.tags, ...result.data.tags.filter((tag: string) => !prev.tags.includes(tag))]
        }));
      } else {
        setError(result.error || 'Failed to generate AI description');
      }
    } catch (error) {
      setError('Failed to generate AI description. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    if (imageFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const imageUrls = imagePreviews;
      const listingData = {
        ...formData,
        images: imageUrls,
        price: Number(formData.price),
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
      };

      const response = await fetch(`/api/marketplace/${formData.category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/marketplace/${formData.category}`);
        }, 2000);
      } else {
        setError(result.error || 'Failed to create listing');
      }
    } catch (err) {
      setError('Failed to create listing');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Created!</h2>
            <p className="text-gray-600 mb-6">
              Your listing has been submitted for review. It will be published once approved.
            </p>
            <button
              onClick={() => router.push(`/marketplace/${formData.category}`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              View Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Perfect Listing</h1>
              <p className="mt-2 text-gray-600">
                Use our AI-assisted template to create compelling marketplace listings
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">1. Basic Details</h2>
                <LightBulbIcon className="h-5 w-5 text-yellow-500 ml-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Mahindra Arjun 605 DI Tractor (Used)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id as any }))}
                        className={`p-4 rounded-lg border-2 text-left transition-colors duration-200 ${
                          formData.category === category.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    {conditions.map((condition) => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name} - {condition.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter price"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter quantity"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Village, District, State"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: AI-Assisted Description */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">2. AI-Assisted Description</h2>
                <SparklesIcon className="h-5 w-5 text-purple-500 ml-2" />
              </div>
              
              <div className="mb-4">
                <button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={aiGenerating}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  {aiGenerating ? 'Generating...' : 'Generate AI Description'}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Let AI help you create a compelling description that attracts buyers
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Describe your item in detail. Include key features, benefits, and why buyers should choose your item."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand/Breed/Variety
                  </label>
                  <input
                    type="text"
                    value={formData.brandBreedVariety || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandBreedVariety: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Mahindra, Gir Cow, Basmati Rice"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition Summary
                  </label>
                  <input
                    type="text"
                    value={formData.conditionSummary || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, conditionSummary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Used for 2 years, new tyres, regular maintenance"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos & Videos */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">3. Photos & Videos</h2>
                <PhotoIcon className="h-5 w-5 text-blue-500 ml-2" />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {imagePreviews.length < 8 && (
                    <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                      <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Upload 3-5 clear, well-lit images from different angles. First image will be the main photo.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Key Attributes */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">4. Key Attributes</h2>
                <DocumentTextIcon className="h-5 w-5 text-indigo-500 ml-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCategory && categorySpecs[formData.category] && 
                  categorySpecs[formData.category].map((spec) => (
                    <div key={spec.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {spec.label}
                      </label>
                      {spec.type === 'select' ? (
                        <select
                          value={formData.specifications[spec.key] || ''}
                          onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select {spec.label}</option>
                          {spec.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={spec.type}
                          value={formData.specifications[spec.key] || ''}
                          onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder={spec.placeholder}
                        />
                      )}
                    </div>
                  ))
                }
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Options
                  </label>
                  <div className="space-y-2">
                    {deliveryOptions.map((option) => (
                      <label key={option.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.deliveryOptions?.includes(option.id) || false}
                          onChange={(e) => {
                            const options = formData.deliveryOptions || [];
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, deliveryOptions: [...options, option.id] }));
                            } else {
                              setFormData(prev => ({ ...prev, deliveryOptions: options.filter(o => o !== option.id) }));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Methods
                  </label>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label key={method.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods?.includes(method.id) || false}
                          onChange={(e) => {
                            const methods = formData.paymentMethods || [];
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, paymentMethods: [...methods, method.id] }));
                            } else {
                              setFormData(prev => ({ ...prev, paymentMethods: methods.filter(m => m !== method.id) }));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: SEO & Discovery */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">5. SEO & Discovery</h2>
                <TagIcon className="h-5 w-5 text-orange-500 ml-2" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Add tags (press Enter to add)"
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">SEO Tips:</h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Include location-based tags (e.g., "Pune-farm-market")</li>
                    <li>• Add category-specific keywords (e.g., "tractor", "dairy-cow")</li>
                    <li>• Use condition tags (e.g., "used-equipment", "organic-produce")</li>
                    <li>• Include brand names and model numbers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Safety & Transparency */}
          {currentStep === 6 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">6. Safety & Transparency</h2>
                <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2" />
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Safety Checklist</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please confirm these safety measures to ensure a secure transaction
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {safetyChecklistItems.map((item) => (
                    <label key={item.id} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.safetyChecklist?.[item.id] || false}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            safetyChecklist: {
                              ...prev.safetyChecklist,
                              [item.id]: e.target.checked
                            }
                          }));
                        }}
                        className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Trust Building Tips:</h3>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Upload clear, honest photos that show the actual condition</li>
                    <li>• Provide accurate pricing based on market rates</li>
                    <li>• Be responsive to buyer inquiries</li>
                    <li>• Meet in safe, public locations for transactions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
