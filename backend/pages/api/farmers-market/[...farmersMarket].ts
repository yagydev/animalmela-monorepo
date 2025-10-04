// Enhanced Farmers' Market API Routes
// /backend/pages/api/farmers-market/[...farmersMarket].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/mongodb';
import { User, Listing, Order, Cart, Review, Notification } from '../../../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'farmers-market-secret';

// Middleware for authentication
const authenticateToken = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    throw new Error('Access token required');
  }
  
  return jwt.verify(token, JWT_SECRET) as any;
};

// Enhanced User Registration with OTP
async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email, mobile, password, role, otp } = req.body;
    
    // Validate OTP (in production, verify against stored OTP)
    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or mobile' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: role || 'buyer',
      isVerified: true,
      createdAt: new Date()
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced User Login
async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profileComplete: !!user.location?.state
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Send OTP for registration/login
async function sendOTP(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { mobile, type = 'registration' } = req.body;
    
    // In production, send actual SMS
    console.log(`OTP sent to ${mobile}: 123456`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: '123456' // Only for testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Update User Profile
async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const updateData = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { 
        ...updateData,
        profileComplete: true,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        location: updatedUser.location,
        paymentPreferences: updatedUser.paymentPreferences,
        profileComplete: updatedUser.profileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced Product Listing Management
async function createListing(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const listingData = {
      ...req.body,
      sellerId: user.userId,
      status: 'active',
      createdAt: new Date()
    };
    
    const listing = new Listing(listingData);
    await listing.save();
    
    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      listing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateListing(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const { id } = req.query;
    
    const listing = await Listing.findOne({ _id: id, sellerId: user.userId });
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: 'Listing not found' 
      });
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteListing(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const { id } = req.query;
    
    const listing = await Listing.findOne({ _id: id, sellerId: user.userId });
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: 'Listing not found' 
      });
    }
    
    await Listing.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced Marketplace Browsing
async function getMarketplaceListings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      category, 
      subcategory, 
      minPrice, 
      maxPrice, 
      location, 
      sortBy = 'newest',
      page = 1,
      limit = 20
    } = req.query;
    
    let filter: any = { status: 'active' };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (location) filter['location.state'] = new RegExp(location, 'i');
    
    let sort: any = { createdAt: -1 };
    if (sortBy === 'price_low') sort = { price: 1 };
    if (sortBy === 'price_high') sort = { price: -1 };
    if (sortBy === 'rating') sort = { rating: -1 };
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const listings = await Listing.find(filter)
      .populate('sellerId', 'name email mobile location')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Listing.countDocuments(filter);
    
    res.json({
      success: true,
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced Cart Management
async function addToCart(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const { listingId, quantity } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    let cart = await Cart.findOne({ userId: user.userId });
    
    if (!cart) {
      cart = new Cart({
        userId: user.userId,
        items: [],
        totalAmount: 0,
        itemCount: 0
      });
    }
    
    // Check if item already exists in cart
    const existingItem = cart.items.find(item => 
      item.listingId.toString() === listingId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
    } else {
      cart.items.push({
        listingId,
        quantity,
        unitPrice: listing.price,
        totalPrice: quantity * listing.price,
        addedAt: new Date()
      });
    }
    
    // Recalculate totals
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getCart(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    
    const cart = await Cart.findOne({ userId: user.userId })
      .populate('items.listingId', 'title price images category');
    
    if (!cart) {
      return res.json({
        success: true,
        cart: {
          items: [],
          totalAmount: 0,
          itemCount: 0
        }
      });
    }
    
    res.json({
      success: true,
      cart: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced Order Management
async function placeOrder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      paymentDetails 
    } = req.body;
    
    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }
    
    // Create orders for each seller
    const orders = [];
    const sellerGroups = new Map();
    
    for (const item of items) {
      const listing = await Listing.findById(item.listingId)
        .populate('sellerId', 'name email mobile');
      
      if (!listing) continue;
      
      const sellerId = listing.sellerId._id.toString();
      
      if (!sellerGroups.has(sellerId)) {
        sellerGroups.set(sellerId, {
          sellerId,
          seller: listing.sellerId,
          items: []
        });
      }
      
      sellerGroups.get(sellerId).items.push({
        listingId: item.listingId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      });
    }
    
    // Create order for each seller
    for (const [sellerId, group] of sellerGroups) {
      const orderTotal = group.items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      const order = new Order({
        buyerId: user.userId,
        sellerId: group.sellerId,
        items: group.items,
        totalAmount: orderTotal,
        shippingAddress,
        paymentMethod,
        paymentDetails,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date()
      });
      
      await order.save();
      orders.push(order);
    }
    
    // Clear cart
    await Cart.findByIdAndDelete(cart._id);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced Chat System
async function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const { receiverId, message, type = 'text' } = req.body;
    
    // Create message record (you'd use a proper chat service in production)
    const messageData = {
      senderId: user.userId,
      receiverId,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    // In production, you'd save to a messages collection
    console.log('Message sent:', messageData);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      messageData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced Rating System
async function submitRating(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    const { orderId, rating, comment, type = 'seller' } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    if (order.buyerId.toString() !== user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    const review = new Review({
      orderId,
      reviewerId: user.userId,
      revieweeId: type === 'seller' ? order.sellerId : order.buyerId,
      rating,
      comment,
      type,
      createdAt: new Date()
    });
    
    await review.save();
    
    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Enhanced Admin Panel
async function getAdminDashboard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = authenticateToken(req);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    const stats = {
      totalUsers: await User.countDocuments(),
      totalListings: await Listing.countDocuments(),
      totalOrders: await Order.countDocuments(),
      pendingOrders: await Order.countDocuments({ status: 'pending' }),
      totalRevenue: await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Main handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { farmersMarket } = req.query;
  const route = Array.isArray(farmersMarket) ? farmersMarket[0] : farmersMarket;
  
  try {
    await connectDB();
    
    switch (method) {
      case 'POST':
        switch (route) {
          case 'register':
            return await registerUser(req, res);
          case 'login':
            return await loginUser(req, res);
          case 'send-otp':
            return await sendOTP(req, res);
          case 'profile':
            return await updateProfile(req, res);
          case 'listings':
            return await createListing(req, res);
          case 'cart':
            return await addToCart(req, res);
          case 'orders':
            return await placeOrder(req, res);
          case 'messages':
            return await sendMessage(req, res);
          case 'ratings':
            return await submitRating(req, res);
          default:
            res.status(404).json({ success: false, message: 'Route not found' });
        }
        break;
        
      case 'GET':
        switch (route) {
          case 'marketplace':
            return await getMarketplaceListings(req, res);
          case 'cart':
            return await getCart(req, res);
          case 'admin':
            return await getAdminDashboard(req, res);
          default:
            res.status(404).json({ success: false, message: 'Route not found' });
        }
        break;
        
      case 'PUT':
        switch (route) {
          case 'listings':
            return await updateListing(req, res);
          default:
            res.status(404).json({ success: false, message: 'Route not found' });
        }
        break;
        
      case 'DELETE':
        switch (route) {
          case 'listings':
            return await deleteListing(req, res);
          default:
            res.status(404).json({ success: false, message: 'Route not found' });
        }
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
