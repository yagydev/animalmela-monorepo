const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Listing, Order, Lead, TransportJob, VetRequest, InsuranceLead, Review, AdminAction } = require('./models');
const connectDB = require('./lib/mongodb');

// Connect to database
connectDB();

// Sample data
const sampleUsers = [
  {
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    email: 'rajesh@example.com',
    password: 'password123',
    role: 'buyer',
    kyc: {
      aadhaar: '123456789012',
      pan: 'ABCDE1234F',
      verified: true
    },
    rating: 4.5,
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      lat: 30.9010,
      lng: 75.8573
    },
    languages: ['Hindi', 'Punjabi', 'English']
  },
  {
    name: 'Priya Sharma',
    mobile: '9876543211',
    email: 'priya@example.com',
    password: 'password123',
    role: 'seller',
    kyc: {
      aadhaar: '123456789013',
      pan: 'ABCDE1235F',
      verified: true
    },
    rating: 4.8,
    location: {
      state: 'Haryana',
      district: 'Karnal',
      pincode: '132001',
      lat: 29.6857,
      lng: 76.9905
    },
    languages: ['Hindi', 'Haryanvi', 'English']
  },
  {
    name: 'Amit Singh',
    mobile: '9876543212',
    email: 'amit@example.com',
    password: 'password123',
    role: 'service',
    kyc: {
      aadhaar: '123456789014',
      pan: 'ABCDE1236F',
      verified: true
    },
    rating: 4.7,
    location: {
      state: 'Uttar Pradesh',
      district: 'Meerut',
      pincode: '250001',
      lat: 28.9845,
      lng: 77.7064
    },
    languages: ['Hindi', 'English']
  },
  {
    name: 'Admin User',
    mobile: '9876543213',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    kyc: {
      aadhaar: '123456789015',
      pan: 'ABCDE1237F',
      verified: true
    },
    rating: 5.0,
    location: {
      state: 'Delhi',
      district: 'New Delhi',
      pincode: '110001',
      lat: 28.6139,
      lng: 77.2090
    },
    languages: ['Hindi', 'English']
  }
];

const sampleListings = [
  {
    species: 'Cow',
    breed: 'Holstein Friesian',
    sex: 'female',
    age: 24,
    teeth: 8,
    weight: 450,
    milkYield: 25,
    lactationNo: 2,
    pregnancyMonths: 0,
    price: 85000,
    negotiable: true,
    description: 'Healthy Holstein Friesian cow with excellent milk production record. Vaccinated and dewormed regularly.',
    media: ['https://example.com/cow1.jpg', 'https://example.com/cow2.jpg'],
    docs: ['https://example.com/health_cert.pdf'],
    health: 'Excellent',
    verified: true,
    status: 'active'
  },
  {
    species: 'Buffalo',
    breed: 'Murrah',
    sex: 'female',
    age: 36,
    teeth: 8,
    weight: 550,
    milkYield: 18,
    lactationNo: 3,
    pregnancyMonths: 2,
    price: 120000,
    negotiable: true,
    description: 'Premium Murrah buffalo with high milk fat content. Pregnant with expected delivery in 7 months.',
    media: ['https://example.com/buffalo1.jpg'],
    docs: ['https://example.com/pregnancy_cert.pdf'],
    health: 'Good',
    verified: true,
    status: 'active'
  },
  {
    species: 'Goat',
    breed: 'Boer',
    sex: 'male',
    age: 12,
    teeth: 4,
    weight: 45,
    milkYield: 0,
    lactationNo: 0,
    pregnancyMonths: 0,
    price: 15000,
    negotiable: true,
    description: 'Healthy Boer goat buck for breeding purposes. Excellent genetics and good temperament.',
    media: ['https://example.com/goat1.jpg'],
    docs: ['https://example.com/breeding_cert.pdf'],
    health: 'Excellent',
    verified: false,
    status: 'active'
  },
  {
    species: 'Sheep',
    breed: 'Dorper',
    sex: 'female',
    age: 18,
    teeth: 6,
    weight: 35,
    milkYield: 0,
    lactationNo: 0,
    pregnancyMonths: 0,
    price: 12000,
    negotiable: true,
    description: 'Dorper sheep ewe, good for meat production. Hardy breed suitable for Indian climate.',
    media: ['https://example.com/sheep1.jpg'],
    docs: [],
    health: 'Good',
    verified: false,
    status: 'active'
  }
];

const sampleOrders = [
  {
    amount: 85000,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    amount: 120000,
    paymentStatus: 'pending',
    deliveryStatus: 'initiated'
  }
];

const sampleLeads = [
  {
    message: 'I am interested in purchasing this cow. Can you provide more details about its health records?',
    channel: 'chat',
    status: 'responded'
  },
  {
    message: 'What is the best price you can offer for this buffalo?',
    channel: 'whatsapp',
    status: 'new'
  }
];

const sampleTransportJobs = [
  {
    quote: 5000,
    status: 'delivered',
    tracking: 'TRK123456789'
  },
  {
    quote: 7500,
    status: 'in-transit',
    tracking: 'TRK987654321'
  }
];

const sampleVetRequests = [
  {
    issue: 'My cow is showing signs of mastitis. Need urgent veterinary consultation.',
    attachments: ['https://example.com/mastitis_photo.jpg'],
    status: 'resolved'
  },
  {
    issue: 'Vaccination schedule for my new buffalo',
    attachments: [],
    status: 'in-progress'
  }
];

const sampleInsuranceLeads = [
  {
    animalInfo: 'Holstein Friesian cow, 24 months old, insured value: Rs. 85,000',
    status: 'follow-up'
  },
  {
    animalInfo: 'Murrah buffalo, 36 months old, insured value: Rs. 120,000',
    status: 'new'
  }
];

const sampleReviews = [
  {
    rating: 5,
    comment: 'Excellent service and healthy animal. Very satisfied with the purchase.'
  },
  {
    rating: 4,
    comment: 'Good quality animal, delivery was on time. Would recommend.'
  }
];

const sampleAdminActions = [
  {
    type: 'moderation',
    reason: 'Verified listing after checking all documents'
  },
  {
    type: 'approve',
    reason: 'Approved user registration after KYC verification'
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Order.deleteMany({});
    await Lead.deleteMany({});
    await TransportJob.deleteMany({});
    await VetRequest.deleteMany({});
    await InsuranceLead.deleteMany({});
    await Review.deleteMany({});
    await AdminAction.deleteMany({});

    console.log('Cleared existing data');

    // Hash passwords
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Create users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create listings with seller references
    const listingsWithSellers = sampleListings.map((listing, index) => ({
      ...listing,
      sellerId: createdUsers[1]._id // Priya Sharma is the seller
    }));

    const createdListings = await Listing.insertMany(listingsWithSellers);
    console.log(`Created ${createdListings.length} listings`);

    // Create orders with references
    const ordersWithRefs = sampleOrders.map((order, index) => ({
      ...order,
      listingId: createdListings[index]._id,
      buyerId: createdUsers[0]._id, // Rajesh Kumar is the buyer
      sellerId: createdUsers[1]._id // Priya Sharma is the seller
    }));

    const createdOrders = await Order.insertMany(ordersWithRefs);
    console.log(`Created ${createdOrders.length} orders`);

    // Create leads with references
    const leadsWithRefs = sampleLeads.map((lead, index) => ({
      ...lead,
      listingId: createdListings[index]._id,
      buyerId: createdUsers[0]._id // Rajesh Kumar is the buyer
    }));

    const createdLeads = await Lead.insertMany(leadsWithRefs);
    console.log(`Created ${createdLeads.length} leads`);

    // Create transport jobs with references
    const transportJobsWithRefs = sampleTransportJobs.map((job, index) => ({
      ...job,
      orderId: createdOrders[index]._id,
      transporterId: createdUsers[2]._id // Amit Singh is the transporter
    }));

    const createdTransportJobs = await TransportJob.insertMany(transportJobsWithRefs);
    console.log(`Created ${createdTransportJobs.length} transport jobs`);

    // Create vet requests with references
    const vetRequestsWithRefs = sampleVetRequests.map((request) => ({
      ...request,
      userId: createdUsers[0]._id // Rajesh Kumar
    }));

    const createdVetRequests = await VetRequest.insertMany(vetRequestsWithRefs);
    console.log(`Created ${createdVetRequests.length} vet requests`);

    // Create insurance leads with references
    const insuranceLeadsWithRefs = sampleInsuranceLeads.map((lead) => ({
      ...lead,
      userId: createdUsers[0]._id // Rajesh Kumar
    }));

    const createdInsuranceLeads = await InsuranceLead.insertMany(insuranceLeadsWithRefs);
    console.log(`Created ${createdInsuranceLeads.length} insurance leads`);

    // Create reviews with references
    const reviewsWithRefs = sampleReviews.map((review, index) => ({
      ...review,
      fromUser: createdUsers[0]._id, // Rajesh Kumar
      toUser: createdUsers[1]._id, // Priya Sharma
      orderId: createdOrders[index]._id
    }));

    const createdReviews = await Review.insertMany(reviewsWithRefs);
    console.log(`Created ${createdReviews.length} reviews`);

    // Create admin actions with references
    const adminActionsWithRefs = sampleAdminActions.map((action) => ({
      ...action,
      actor: createdUsers[3]._id, // Admin User
      targetId: createdListings[0]._id
    }));

    const createdAdminActions = await AdminAction.insertMany(adminActionsWithRefs);
    console.log(`Created ${createdAdminActions.length} admin actions`);

    console.log('Database seeding completed successfully!');
    console.log('\nSample data created:');
    console.log('- Users: 4 (1 buyer, 1 seller, 1 service provider, 1 admin)');
    console.log('- Listings: 4 (2 verified, 2 unverified)');
    console.log('- Orders: 2 (1 paid, 1 pending)');
    console.log('- Leads: 2 (1 responded, 1 new)');
    console.log('- Transport Jobs: 2 (1 delivered, 1 in-transit)');
    console.log('- Vet Requests: 2 (1 resolved, 1 in-progress)');
    console.log('- Insurance Leads: 2 (1 follow-up, 1 new)');
    console.log('- Reviews: 2');
    console.log('- Admin Actions: 2');

    console.log('\nTest credentials:');
    console.log('Buyer: rajesh@example.com / password123');
    console.log('Seller: priya@example.com / password123');
    console.log('Service Provider: amit@example.com / password123');
    console.log('Admin: admin@example.com / admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;