// MongoDB initialization script for Kisaan Mela Production
// This script runs when MongoDB container starts for the first time

print('Starting Kisaan Mela database initialization...');

// Switch to the production database
db = db.getSiblingDB('kisaanmela_prod');

// Create collections with validation schemas
print('Creating collections...');

// Users collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'phone', 'role', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        phone: {
          bsonType: 'string',
          pattern: '^[+]?[0-9]{10,15}$'
        },
        role: {
          bsonType: 'string',
          enum: ['buyer', 'seller', 'service_provider', 'admin']
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'inactive', 'suspended', 'pending_verification']
        }
      }
    }
  }
});

// Listings collection
db.createCollection('listings', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'category', 'price', 'sellerId', 'status', 'createdAt'],
      properties: {
        category: {
          bsonType: 'string',
          enum: ['cattle', 'poultry', 'goats', 'sheep', 'horses', 'other']
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'sold', 'inactive', 'pending_approval']
        },
        price: {
          bsonType: 'number',
          minimum: 0
        }
      }
    }
  }
});

// Orders collection
db.createCollection('orders', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['buyerId', 'sellerId', 'listingId', 'status', 'totalAmount', 'createdAt'],
      properties: {
        status: {
          bsonType: 'string',
          enum: ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']
        },
        totalAmount: {
          bsonType: 'number',
          minimum: 0
        }
      }
    }
  }
});

// Chats collection
db.createCollection('chats', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['participants', 'createdAt'],
      properties: {
        participants: {
          bsonType: 'array',
          minItems: 2,
          maxItems: 2
        }
      }
    }
  }
});

// Services collection
db.createCollection('services', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'type', 'providerId', 'status', 'createdAt'],
      properties: {
        type: {
          bsonType: 'string',
          enum: ['veterinary', 'transport', 'insurance', 'breeding', 'training', 'other']
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'inactive', 'suspended']
        }
      }
    }
  }
});

// Payments collection
db.createCollection('payments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['orderId', 'amount', 'status', 'method', 'createdAt'],
      properties: {
        status: {
          bsonType: 'string',
          enum: ['pending', 'processing', 'completed', 'failed', 'refunded']
        },
        method: {
          bsonType: 'string',
          enum: ['stripe', 'razorpay', 'bank_transfer', 'cash']
        },
        amount: {
          bsonType: 'number',
          minimum: 0
        }
      }
    }
  }
});

// Reviews collection
db.createCollection('reviews', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['reviewerId', 'revieweeId', 'rating', 'createdAt'],
      properties: {
        rating: {
          bsonType: 'number',
          minimum: 1,
          maximum: 5
        }
      }
    }
  }
});

print('Collections created successfully');

// Create indexes for better performance
print('Creating indexes...');

// Users indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "location.coordinates": "2dsphere" });
db.users.createIndex({ "createdAt": -1 });

// Listings indexes
db.listings.createIndex({ "sellerId": 1 });
db.listings.createIndex({ "category": 1 });
db.listings.createIndex({ "status": 1 });
db.listings.createIndex({ "price": 1 });
db.listings.createIndex({ "location.coordinates": "2dsphere" });
db.listings.createIndex({ "createdAt": -1 });
db.listings.createIndex({ "title": "text", "description": "text" });
db.listings.createIndex({ "tags": 1 });

// Orders indexes
db.orders.createIndex({ "buyerId": 1 });
db.orders.createIndex({ "sellerId": 1 });
db.orders.createIndex({ "listingId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });
db.orders.createIndex({ "paymentStatus": 1 });

// Chats indexes
db.chats.createIndex({ "participants": 1 });
db.chats.createIndex({ "lastMessage.timestamp": -1 });
db.chats.createIndex({ "createdAt": -1 });

// Services indexes
db.services.createIndex({ "providerId": 1 });
db.services.createIndex({ "type": 1 });
db.services.createIndex({ "status": 1 });
db.services.createIndex({ "location.coordinates": "2dsphere" });
db.services.createIndex({ "createdAt": -1 });
db.services.createIndex({ "title": "text", "description": "text" });

// Payments indexes
db.payments.createIndex({ "orderId": 1 });
db.payments.createIndex({ "userId": 1 });
db.payments.createIndex({ "status": 1 });
db.payments.createIndex({ "method": 1 });
db.payments.createIndex({ "stripePaymentIntentId": 1 });
db.payments.createIndex({ "createdAt": -1 });

// Reviews indexes
db.reviews.createIndex({ "reviewerId": 1 });
db.reviews.createIndex({ "revieweeId": 1 });
db.reviews.createIndex({ "orderId": 1 });
db.reviews.createIndex({ "rating": 1 });
db.reviews.createIndex({ "createdAt": -1 });

// Compound indexes for common queries
db.listings.createIndex({ "category": 1, "status": 1, "createdAt": -1 });
db.listings.createIndex({ "sellerId": 1, "status": 1 });
db.orders.createIndex({ "buyerId": 1, "status": 1, "createdAt": -1 });
db.orders.createIndex({ "sellerId": 1, "status": 1, "createdAt": -1 });

print('Indexes created successfully');

// Create default admin user
print('Creating default admin user...');

const adminUser = {
  _id: ObjectId(),
  email: 'admin@kisaanmela.com',
  phone: '+919999999999',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  status: 'active',
  isVerified: true,
  permissions: [
    'user_management',
    'listing_management',
    'order_management',
    'service_management',
    'payment_management',
    'analytics_view',
    'system_settings'
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

try {
  db.users.insertOne(adminUser);
  print('Default admin user created: admin@kisaanmela.com');
} catch (e) {
  print('Admin user already exists or error creating: ' + e.message);
}

// Create sample categories
print('Creating sample categories...');

const categories = [
  {
    _id: ObjectId(),
    name: 'Cattle',
    slug: 'cattle',
    description: 'Cows, Bulls, Buffaloes',
    icon: 'cow',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Poultry',
    slug: 'poultry',
    description: 'Chickens, Ducks, Turkeys',
    icon: 'chicken',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Goats',
    slug: 'goats',
    description: 'All breeds of goats',
    icon: 'goat',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Sheep',
    slug: 'sheep',
    description: 'All breeds of sheep',
    icon: 'sheep',
    isActive: true,
    createdAt: new Date()
  }
];

db.createCollection('categories');
db.categories.createIndex({ "slug": 1 }, { unique: true });
db.categories.createIndex({ "isActive": 1 });

try {
  db.categories.insertMany(categories);
  print('Sample categories created');
} catch (e) {
  print('Categories already exist or error creating: ' + e.message);
}

// Create application settings
print('Creating application settings...');

const settings = {
  _id: ObjectId(),
  appName: 'Kisaan Mela',
  version: '1.0.0',
  maintenance: false,
  features: {
    chatEnabled: true,
    paymentsEnabled: true,
    servicesEnabled: true,
    reviewsEnabled: true,
    notificationsEnabled: true
  },
  limits: {
    maxListingsPerUser: 50,
    maxImagesPerListing: 10,
    maxFileSize: 10485760, // 10MB
    maxChatParticipants: 2
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

db.createCollection('settings');
try {
  db.settings.insertOne(settings);
  print('Application settings created');
} catch (e) {
  print('Settings already exist or error creating: ' + e.message);
}

print('✅ Kisaan Mela database initialization completed successfully!');
print('Database: kisaanmela_prod');
print('Collections created: users, listings, orders, chats, services, payments, reviews, categories, settings');
print('Indexes created for optimal performance');
print('Default admin user: admin@kisaanmela.com');
print('Ready for production use!');
