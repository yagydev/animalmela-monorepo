// Shared farmers data for demo purposes
// In production, this would be replaced with database operations

let farmers = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    mobile: '9876543210',
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      village: 'Village A'
    },
    products: ['Wheat', 'Rice', 'Corn'],
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    mobile: '9876543211',
    location: {
      state: 'Haryana',
      district: 'Karnal',
      pincode: '132001',
      village: 'Village B'
    },
    products: ['Rice', 'Vegetables', 'Fruits'],
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'
    ],
    createdAt: new Date().toISOString()
  }
];

// Helper functions
export const getFarmers = () => farmers;

export const getFarmerById = (id) => farmers.find(f => f._id === id);

export const addFarmer = (farmerData) => {
  const newFarmer = {
    _id: Math.random().toString(36).substr(2, 9),
    ...farmerData,
    createdAt: new Date().toISOString()
  };
  farmers.push(newFarmer);
  return newFarmer;
};

export const updateFarmer = (id, farmerData) => {
  const farmerIndex = farmers.findIndex(f => f._id === id);
  if (farmerIndex === -1) {
    return null;
  }
  
  farmers[farmerIndex] = {
    ...farmers[farmerIndex],
    ...farmerData,
    _id: id // Ensure ID doesn't change
  };
  
  return farmers[farmerIndex];
};

export const deleteFarmer = (id) => {
  const farmerIndex = farmers.findIndex(f => f._id === id);
  if (farmerIndex === -1) {
    return false;
  }
  
  farmers.splice(farmerIndex, 1);
  return true;
};
