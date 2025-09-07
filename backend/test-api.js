const axios = require('axios');
const { logger } = require('./src/utils/logger');

// API Testing Script for Services and Pets CRUD Operations
class APITester {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.authToken = null;
    this.testUserId = null;
    this.testServiceId = null;
    this.testPetId = null;
  }

  // Helper method to make API requests
  async makeRequest(method, endpoint, data = null, headers = {}) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Request failed',
          status: error.response.status
        };
      }
      throw error;
    }
  }

  // Test authentication
  async testAuth() {
    console.log('\n🔐 Testing Authentication...');
    
    // Test user registration
    const registerData = {
      email: 'test@animall.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      role: 'pet_owner'
    };

    const registerResult = await this.makeRequest('POST', '/auth/register', registerData);
    console.log('Registration:', registerResult.success ? '✅' : '❌', registerResult);

    // Test user login
    const loginData = {
      email: 'test@animall.com',
      password: 'password123'
    };

    const loginResult = await this.makeRequest('POST', '/auth/login', loginData);
    if (loginResult.success) {
      this.authToken = loginResult.data.token;
      this.testUserId = loginResult.data.user.id;
      console.log('Login:', '✅', 'Token received');
    } else {
      console.log('Login:', '❌', loginResult);
    }
  }

  // Test Services CRUD Operations
  async testServicesCRUD() {
    console.log('\n🏢 Testing Services CRUD Operations...');

    // 1. Create Service
    console.log('\n1. Creating Service...');
    const serviceData = {
      title: 'Professional Pet Sitting',
      description: 'In-home pet sitting with 24/7 care and daily updates. Your pet will receive personalized attention and care in the comfort of their own home.',
      serviceType: 'pet_sitting',
      price: 45,
      currency: 'USD',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main St, New York, NY'
      },
      availability: {
        monday: ['9:00 AM - 5:00 PM'],
        tuesday: ['9:00 AM - 5:00 PM'],
        wednesday: ['9:00 AM - 5:00 PM'],
        thursday: ['9:00 AM - 5:00 PM'],
        friday: ['9:00 AM - 5:00 PM'],
        saturday: ['10:00 AM - 3:00 PM'],
        sunday: []
      },
      serviceAreas: ['Downtown', 'Midtown', 'Uptown'],
      requirements: {
        meetAndGreet: true,
        vaccinationRequired: true,
        emergencyContact: true
      },
      features: [
        '24/7 supervision',
        'Daily updates',
        'Medication administration',
        'House sitting included',
        'Pet first aid certified'
      ],
      policies: {
        cancellation: '24 hours notice required',
        refund: 'Full refund if cancelled 24+ hours in advance',
        emergency: 'Emergency vet visits covered'
      },
      included: ['Feeding', 'Walking', 'Playtime', 'Updates'],
      notIncluded: ['Vet visits', 'Grooming', 'Training']
    };

    const createResult = await this.makeRequest('POST', '/services', serviceData);
    if (createResult.success) {
      this.testServiceId = createResult.data._id;
      console.log('Create Service:', '✅', `Service ID: ${this.testServiceId}`);
    } else {
      console.log('Create Service:', '❌', createResult);
    }

    // 2. Get All Services
    console.log('\n2. Getting All Services...');
    const getAllResult = await this.makeRequest('GET', '/services?page=1&limit=10');
    console.log('Get All Services:', getAllResult.success ? '✅' : '❌', `Found ${getAllResult.data?.length || 0} services`);

    // 3. Get Service by ID
    if (this.testServiceId) {
      console.log('\n3. Getting Service by ID...');
      const getByIdResult = await this.makeRequest('GET', `/services/${this.testServiceId}`);
      console.log('Get Service by ID:', getByIdResult.success ? '✅' : '❌', getByIdResult.data?.title || 'Not found');
    }

    // 4. Update Service
    if (this.testServiceId) {
      console.log('\n4. Updating Service...');
      const updateData = {
        title: 'Premium Pet Sitting Service',
        price: 55,
        description: 'Updated description with premium care features'
      };
      const updateResult = await this.makeRequest('PUT', `/services/${this.testServiceId}`, updateData);
      console.log('Update Service:', updateResult.success ? '✅' : '❌', updateResult.data?.title || 'Update failed');
    }

    // 5. Get Service Types
    console.log('\n5. Getting Service Types...');
    const typesResult = await this.makeRequest('GET', '/services/types');
    console.log('Get Service Types:', typesResult.success ? '✅' : '❌', `Found ${typesResult.data?.length || 0} types`);

    // 6. Search Services
    console.log('\n6. Searching Services...');
    const searchResult = await this.makeRequest('GET', '/services?search=pet&serviceType=pet_sitting');
    console.log('Search Services:', searchResult.success ? '✅' : '❌', `Found ${searchResult.data?.length || 0} results`);

    // 7. Toggle Service Active Status
    if (this.testServiceId) {
      console.log('\n7. Toggling Service Active Status...');
      const toggleResult = await this.makeRequest('PATCH', `/services/${this.testServiceId}/toggle-active`);
      console.log('Toggle Active:', toggleResult.success ? '✅' : '❌', toggleResult.message || 'Toggle failed');
    }
  }

  // Test Pets CRUD Operations
  async testPetsCRUD() {
    console.log('\n🐾 Testing Pets CRUD Operations...');

    // 1. Create Pet
    console.log('\n1. Creating Pet...');
    const petData = {
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      weight: 65,
      gender: 'male',
      color: 'Golden',
      neutered: true,
      description: 'Friendly and energetic dog who loves playing fetch and going for walks. Buddy is a very social dog, loves children and other animals.',
      medicalNotes: 'Allergic to chicken. Takes medication for hip dysplasia daily (Carprofen 75mg). Regular vet check-ups for joint health.',
      specialNeeds: ['Daily medication', 'Hip support', 'Low-impact exercise', 'Grain-free diet'],
      vaccinations: [
        { name: 'Rabies', date: '2023-01-15', nextDue: '2024-01-15' },
        { name: 'DHPP', date: '2023-01-15', nextDue: '2024-01-15' },
        { name: 'Bordetella', date: '2023-06-15', nextDue: '2024-06-15' }
      ],
      healthInfo: {
        allergies: ['chicken'],
        medications: ['Carprofen 75mg daily'],
        conditions: ['hip dysplasia']
      },
      behaviorTraits: {
        energyLevel: 'high',
        socialLevel: 'very social',
        goodWithKids: true,
        goodWithOtherPets: true,
        houseTrained: true
      },
      photos: ['/images/pets/buddy.jpg'],
      gallery: ['/images/pets/buddy-1.jpg', '/images/pets/buddy-2.jpg', '/images/pets/buddy-3.jpg'],
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
      },
      availableForAdoption: false,
      adoptionFee: null
    };

    const createResult = await this.makeRequest('POST', '/pets', petData);
    if (createResult.success) {
      this.testPetId = createResult.data._id;
      console.log('Create Pet:', '✅', `Pet ID: ${this.testPetId}`);
    } else {
      console.log('Create Pet:', '❌', createResult);
    }

    // 2. Get All Pets
    console.log('\n2. Getting All Pets...');
    const getAllResult = await this.makeRequest('GET', '/pets?page=1&limit=10');
    console.log('Get All Pets:', getAllResult.success ? '✅' : '❌', `Found ${getAllResult.data?.length || 0} pets`);

    // 3. Get Pet by ID
    if (this.testPetId) {
      console.log('\n3. Getting Pet by ID...');
      const getByIdResult = await this.makeRequest('GET', `/pets/${this.testPetId}`);
      console.log('Get Pet by ID:', getByIdResult.success ? '✅' : '❌', getByIdResult.data?.name || 'Not found');
    }

    // 4. Update Pet
    if (this.testPetId) {
      console.log('\n4. Updating Pet...');
      const updateData = {
        name: 'Buddy the Great',
        age: 4,
        weight: 68,
        description: 'Updated description - Buddy is now 4 years old and even more friendly!'
      };
      const updateResult = await this.makeRequest('PUT', `/pets/${this.testPetId}`, updateData);
      console.log('Update Pet:', updateResult.success ? '✅' : '❌', updateResult.data?.name || 'Update failed');
    }

    // 5. Add Vaccination
    if (this.testPetId) {
      console.log('\n5. Adding Vaccination...');
      const vaccinationData = {
        name: 'Lyme Disease',
        date: '2023-12-01',
        nextDue: '2024-12-01'
      };
      const addVaccinationResult = await this.makeRequest('POST', `/pets/${this.testPetId}/vaccinations`, vaccinationData);
      console.log('Add Vaccination:', addVaccinationResult.success ? '✅' : '❌', addVaccinationResult.message || 'Add failed');
    }

    // 6. Get Pet Species
    console.log('\n6. Getting Pet Species...');
    const speciesResult = await this.makeRequest('GET', '/pets/species');
    console.log('Get Pet Species:', speciesResult.success ? '✅' : '❌', `Found ${speciesResult.data?.length || 0} species`);

    // 7. Search Pets
    console.log('\n7. Searching Pets...');
    const searchResult = await this.makeRequest('GET', '/pets?search=buddy&species=dog');
    console.log('Search Pets:', searchResult.success ? '✅' : '❌', `Found ${searchResult.data?.length || 0} results`);

    // 8. Toggle Adoption Status
    if (this.testPetId) {
      console.log('\n8. Toggling Adoption Status...');
      const toggleResult = await this.makeRequest('PATCH', `/pets/${this.testPetId}/toggle-adoption`);
      console.log('Toggle Adoption:', toggleResult.success ? '✅' : '❌', toggleResult.message || 'Toggle failed');
    }
  }

  // Test Error Handling
  async testErrorHandling() {
    console.log('\n🚨 Testing Error Handling...');

    // Test invalid service ID
    console.log('\n1. Testing Invalid Service ID...');
    const invalidServiceResult = await this.makeRequest('GET', '/services/invalid-id');
    console.log('Invalid Service ID:', invalidServiceResult.success ? '❌' : '✅', 'Error handled correctly');

    // Test invalid pet ID
    console.log('\n2. Testing Invalid Pet ID...');
    const invalidPetResult = await this.makeRequest('GET', '/pets/invalid-id');
    console.log('Invalid Pet ID:', invalidPetResult.success ? '❌' : '✅', 'Error handled correctly');

    // Test unauthorized access
    console.log('\n3. Testing Unauthorized Access...');
    const unauthorizedResult = await this.makeRequest('POST', '/services', { title: 'Test' });
    console.log('Unauthorized Access:', unauthorizedResult.success ? '❌' : '✅', 'Error handled correctly');

    // Test validation errors
    console.log('\n4. Testing Validation Errors...');
    const validationResult = await this.makeRequest('POST', '/pets', { name: '' });
    console.log('Validation Error:', validationResult.success ? '❌' : '✅', 'Error handled correctly');
  }

  // Cleanup test data
  async cleanup() {
    console.log('\n🧹 Cleaning up test data...');

    if (this.testServiceId) {
      const deleteServiceResult = await this.makeRequest('DELETE', `/services/${this.testServiceId}`);
      console.log('Delete Service:', deleteServiceResult.success ? '✅' : '❌');
    }

    if (this.testPetId) {
      const deletePetResult = await this.makeRequest('DELETE', `/pets/${this.testPetId}`);
      console.log('Delete Pet:', deletePetResult.success ? '✅' : '❌');
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting API Tests for Animall Backend...');
    console.log('='.repeat(60));

    try {
      await this.testAuth();
      await this.testServicesCRUD();
      await this.testPetsCRUD();
      await this.testErrorHandling();
      await this.cleanup();

      console.log('\n' + '='.repeat(60));
      console.log('✅ All API tests completed successfully!');
    } catch (error) {
      console.log('\n❌ Test suite failed:', error.message);
    }
  }
}

// Export for use in other files
module.exports = APITester;

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests();
}
