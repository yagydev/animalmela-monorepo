const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  role: { type: String, enum: ['admin', 'farmer', 'buyer'], default: 'buyer' },
  user_type: { type: String, enum: ['admin', 'farmer', 'buyer'], default: 'buyer' },
  verified: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Demo users to create
const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@kisaanmela.com',
    password: 'admin123',
    role: 'admin',
    user_type: 'admin',
    mobile: '+919876543210'
  },
  {
    name: 'Demo Farmer',
    email: 'farmer@kisaanmela.com',
    password: 'farmer123',
    role: 'farmer',
    user_type: 'farmer',
    mobile: '+919876543211'
  },
  {
    name: 'Demo Buyer',
    email: 'buyer@kisaanmela.com',
    password: 'buyer123',
    role: 'buyer',
    user_type: 'buyer',
    mobile: '+919876543212'
  },
  {
    name: 'Demo User',
    email: 'demo@kisaanmela.com',
    password: 'demo123',
    role: 'farmer',
    user_type: 'farmer',
    mobile: '+919876543213'
  }
];

// Create demo users
const createDemoUsers = async () => {
  try {
    console.log('🔧 Creating demo users...');
    
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }
    
    console.log('🎉 Demo users creation completed!');
    
    // List all users
    const users = await User.find({}, 'name email role user_type verified');
    console.log('\n📋 Current users in database:');
    users.forEach(user => {
      console.log(`  • ${user.name} (${user.email}) - ${user.role} - Verified: ${user.verified}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createDemoUsers();
  mongoose.connection.close();
  console.log('\n✅ Database connection closed');
};

// Run the script
main().catch(console.error);
