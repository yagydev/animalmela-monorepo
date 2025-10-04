import { NextApiRequest, NextApiResponse } from 'next';
import { Cart, Listing } from '../../models';
import connectDB from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

// Connect to database
connectDB();

// Middleware to authenticate user
const authenticateUser = (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'fallback-secret') as any;
  return decoded.userId;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { cart } = req.query;
  
  try {
    const userId = authenticateUser(req);
    
    switch (method) {
      case 'GET':
        if (cart && cart[0] === 'items') {
          return await getCartItems(req, res, userId);
        }
        return await getCart(req, res, userId);
        
      case 'POST':
        if (cart && cart[0] === 'add') {
          return await addToCart(req, res, userId);
        } else if (cart && cart[0] === 'update') {
          return await updateCartItem(req, res, userId);
        }
        break;
        
      case 'PUT':
        if (cart && cart[0] === 'clear') {
          return await clearCart(req, res, userId);
        }
        break;
        
      case 'DELETE':
        if (cart && cart[0] === 'remove' && cart[1]) {
          return await removeFromCart(req, res, userId, cart[1]);
        }
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Cart API error:', error);
    res.status(401).json({ success: false, error: error.message });
  }
}

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
async function getCart(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    let cart = await Cart.findOne({ userId }).populate('items.listingId');
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0, itemCount: 0 });
    }
    
    // Calculate totals
    let totalAmount = 0;
    let itemCount = 0;
    
    cart.items.forEach((item: any) => {
      totalAmount += item.totalPrice;
      itemCount += item.quantity;
    });
    
    cart.totalAmount = totalAmount;
    cart.itemCount = itemCount;
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Get cart items with listing details
// @route   GET /api/cart/items
// @access  Private
async function getCartItems(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.listingId',
      populate: {
        path: 'sellerId',
        select: 'name mobile location'
      }
    });
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        totalAmount: 0,
        itemCount: 0
      });
    }
    
    res.status(200).json({
      success: true,
      items: cart.items,
      totalAmount: cart.totalAmount,
      itemCount: cart.itemCount
    });
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
async function addToCart(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { listingId, quantity } = req.body;
    
    if (!listingId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Listing ID and quantity are required'
      });
    }
    
    // Get listing details
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }
    
    if (listing.sellerId.toString() === userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot add your own listing to cart'
      });
    }
    
    if (quantity < listing.minimumOrder) {
      return res.status(400).json({
        success: false,
        error: `Minimum order quantity is ${listing.minimumOrder}`
      });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0, itemCount: 0 });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.listingId.toString() === listingId
    );
    
    const unitPrice = listing.price;
    const totalPrice = unitPrice * quantity;
    
    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * unitPrice;
    } else {
      // Add new item
      cart.items.push({
        listingId,
        quantity,
        unitPrice,
        totalPrice,
        addedAt: new Date()
      });
    }
    
    // Recalculate totals
    let totalAmount = 0;
    let itemCount = 0;
    
    cart.items.forEach((item: any) => {
      totalAmount += item.totalPrice;
      itemCount += item.quantity;
    });
    
    cart.totalAmount = totalAmount;
    cart.itemCount = itemCount;
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart: {
        _id: cart._id,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Update cart item quantity
// @route   POST /api/cart/update
// @access  Private
async function updateCartItem(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { listingId, quantity } = req.body;
    
    if (!listingId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Listing ID and quantity are required'
      });
    }
    
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity cannot be negative'
      });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(
      (item: any) => item.listingId.toString() === listingId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    if (quantity === 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].totalPrice = cart.items[itemIndex].unitPrice * quantity;
    }
    
    // Recalculate totals
    let totalAmount = 0;
    let itemCount = 0;
    
    cart.items.forEach((item: any) => {
      totalAmount += item.totalPrice;
      itemCount += item.quantity;
    });
    
    cart.totalAmount = totalAmount;
    cart.itemCount = itemCount;
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: {
        _id: cart._id,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:listingId
// @access  Private
async function removeFromCart(req: NextApiRequest, res: NextApiResponse, userId: string, listingId: string) {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(
      (item: any) => item.listingId.toString() === listingId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    cart.items.splice(itemIndex, 1);
    
    // Recalculate totals
    let totalAmount = 0;
    let itemCount = 0;
    
    cart.items.forEach((item: any) => {
      totalAmount += item.totalPrice;
      itemCount += item.quantity;
    });
    
    cart.totalAmount = totalAmount;
    cart.itemCount = itemCount;
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: {
        _id: cart._id,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Clear entire cart
// @route   PUT /api/cart/clear
// @access  Private
async function clearCart(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    cart.itemCount = 0;
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: {
        _id: cart._id,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
