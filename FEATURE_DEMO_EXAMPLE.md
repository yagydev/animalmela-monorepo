# 🎯 Complete Feature Demo: Livestock Auction System

This is a practical example showing how to implement a complete feature end-to-end across your Kisaan Mela platform.

## 🏗️ **Feature: Live Livestock Auctions**

Let's implement a complete auction system where farmers can auction their livestock and buyers can bid in real-time.

---

## 📡 **Step 1: Backend API Implementation**

### **Database Model**
```javascript
// backend/models/Auction.js
import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  // Basic auction info
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Livestock details
  livestockId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Listing', 
    required: true 
  },
  
  // Seller info
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Auction pricing
  startingPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  reservePrice: { type: Number }, // Minimum acceptable price
  
  // Auction timing
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  
  // Auction status
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  // Bidding info
  bids: [{
    bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    isAutomatic: { type: Boolean, default: false } // For auto-bidding
  }],
  
  // Winner info
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  winningBid: { type: Number },
  
  // Auction settings
  bidIncrement: { type: Number, default: 1000 }, // Minimum bid increment
  allowAutoBidding: { type: Boolean, default: true },
  
  // Metadata
  viewCount: { type: Number, default: 0 },
  participantCount: { type: Number, default: 0 },
  
}, {
  timestamps: true,
});

// Indexes for performance
auctionSchema.index({ status: 1, startTime: 1 });
auctionSchema.index({ sellerId: 1 });
auctionSchema.index({ 'bids.bidderId': 1 });

export default mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
```

### **API Endpoints**
```javascript
// backend/pages/api/auctions/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/database';
import Auction from '../../../models/Auction';
import { authenticate } from '../../../middleware/auth';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getAuctions(req, res);
    case 'POST':
      return await createAuction(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// Get all auctions with filtering
async function getAuctions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      status = 'active', 
      category, 
      location, 
      priceMin, 
      priceMax,
      page = 1, 
      limit = 20 
    } = req.query;

    const query: any = {};
    
    // Filter by status
    if (status !== 'all') {
      query.status = status;
    }
    
    // Price range filter
    if (priceMin || priceMax) {
      query.currentPrice = {};
      if (priceMin) query.currentPrice.$gte = Number(priceMin);
      if (priceMax) query.currentPrice.$lte = Number(priceMax);
    }

    const auctions = await Auction.find(query)
      .populate('livestockId', 'title images breed category location')
      .populate('sellerId', 'name avatar rating')
      .populate('winnerId', 'name')
      .sort({ startTime: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Auction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: auctions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Create new auction
async function createAuction(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await authenticate(req);
    
    const {
      title,
      description,
      livestockId,
      startingPrice,
      reservePrice,
      duration,
      startTime
    } = req.body;

    // Validate livestock ownership
    const livestock = await Listing.findOne({ 
      _id: livestockId, 
      sellerId: user.id 
    });
    
    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: 'Livestock not found or not owned by user'
      });
    }

    const endTime = new Date(new Date(startTime).getTime() + duration * 60000);

    const auction = await Auction.create({
      title,
      description,
      livestockId,
      sellerId: user.id,
      startingPrice,
      currentPrice: startingPrice,
      reservePrice,
      startTime: new Date(startTime),
      endTime,
      duration,
      status: new Date(startTime) <= new Date() ? 'active' : 'scheduled'
    });

    await auction.populate('livestockId sellerId');

    res.status(201).json({
      success: true,
      data: auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

### **Bidding API**
```javascript
// backend/pages/api/auctions/[id]/bid.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../lib/database';
import Auction from '../../../../models/Auction';
import { authenticate } from '../../../../middleware/auth';
import { io } from '../../../../lib/websocket';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const user = await authenticate(req);
    const { id } = req.query;
    const { amount, isAutomatic = false } = req.body;

    const auction = await Auction.findById(id);
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Validate auction status
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Auction is not active'
      });
    }

    // Check if auction has ended
    if (new Date() > auction.endTime) {
      return res.status(400).json({
        success: false,
        message: 'Auction has ended'
      });
    }

    // Validate bid amount
    const minBidAmount = auction.currentPrice + auction.bidIncrement;
    if (amount < minBidAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum bid amount is ₹${minBidAmount.toLocaleString()}`
      });
    }

    // Prevent seller from bidding on own auction
    if (auction.sellerId.toString() === user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot bid on your own auction'
      });
    }

    // Add bid to auction
    const newBid = {
      bidderId: user.id,
      amount,
      timestamp: new Date(),
      isAutomatic
    };

    auction.bids.push(newBid);
    auction.currentPrice = amount;
    
    // Update participant count if new bidder
    const existingBidder = auction.bids.find(
      bid => bid.bidderId.toString() === user.id && bid._id !== newBid._id
    );
    if (!existingBidder) {
      auction.participantCount += 1;
    }

    await auction.save();

    // Populate bid with user info
    await auction.populate('bids.bidderId', 'name avatar');
    
    // Emit real-time update
    io.to(`auction-${id}`).emit('new-bid', {
      auctionId: id,
      bid: newBid,
      currentPrice: amount,
      bidder: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    });

    res.status(200).json({
      success: true,
      data: {
        auction,
        newBid
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

## 🎨 **Step 2: Web Frontend Implementation**

### **Auction List Page**
```tsx
// web-frontend/src/app/auctions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuctionCard } from '@/components/auctions/AuctionCard';
import { AuctionFilters } from '@/components/auctions/AuctionFilters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Auction {
  _id: string;
  title: string;
  description: string;
  livestockId: {
    title: string;
    images: string[];
    breed: string;
    category: string;
  };
  sellerId: {
    name: string;
    avatar: string;
    rating: number;
  };
  currentPrice: number;
  startingPrice: number;
  endTime: string;
  status: string;
  bids: any[];
  participantCount: number;
}

export default function AuctionsPage() {
  const [filters, setFilters] = useState({
    status: 'active',
    category: '',
    priceMin: '',
    priceMax: '',
    location: ''
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['auctions', filters],
    queryFn: () => fetchAuctions(filters),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const fetchAuctions = async (filters: any) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    const response = await fetch(`/api/auctions?${params}`);
    if (!response.ok) throw new Error('Failed to fetch auctions');
    return response.json();
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading auctions</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Livestock Auctions
          </h1>
          <p className="text-gray-600">
            Bid on premium livestock from verified sellers
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <AuctionFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
          </div>

          {/* Auction Grid */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {data?.data?.map((auction: Auction) => (
                <AuctionCard 
                  key={auction._id} 
                  auction={auction} 
                />
              ))}
            </div>

            {data?.data?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No active auctions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### **Auction Card Component**
```tsx
// web-frontend/src/components/auctions/AuctionCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatTimeRemaining } from '@/utils/helpers';
import { ClockIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';

interface AuctionCardProps {
  auction: {
    _id: string;
    title: string;
    livestockId: {
      title: string;
      images: string[];
      breed: string;
      category: string;
    };
    sellerId: {
      name: string;
      avatar: string;
      rating: number;
    };
    currentPrice: number;
    startingPrice: number;
    endTime: string;
    status: string;
    bids: any[];
    participantCount: number;
  };
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
        setIsEnded(false);
      } else {
        setTimeRemaining('Auction Ended');
        setIsEnded(true);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const priceIncrease = ((auction.currentPrice - auction.startingPrice) / auction.startingPrice) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={auction.livestockId.images[0] || '/images/placeholder-livestock.jpg'}
          alt={auction.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            auction.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {auction.status === 'active' ? 'Live' : auction.status}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
            {auction.livestockId.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {auction.title}
          </h3>
          <p className="text-sm text-gray-600">
            {auction.livestockId.breed} • {auction.livestockId.category}
          </p>
        </div>

        {/* Seller Info */}
        <div className="flex items-center mb-3">
          <Image
            src={auction.sellerId.avatar || '/images/default-avatar.jpg'}
            alt={auction.sellerId.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="ml-2 text-sm text-gray-600">
            {auction.sellerId.name}
          </span>
          <div className="ml-auto flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">
              {auction.sellerId.rating?.toFixed(1) || 'New'}
            </span>
          </div>
        </div>

        {/* Price Info */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">Current Bid</span>
            <span className="text-sm text-gray-500">
              {auction.bids.length} bids
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(auction.currentPrice)}
            </span>
            {priceIncrease > 0 && (
              <span className="text-sm text-green-600 font-medium">
                +{priceIncrease.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Starting: {formatCurrency(auction.startingPrice)}
          </div>
        </div>

        {/* Time and Stats */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span className={isEnded ? 'text-red-600' : 'text-orange-600'}>
              {timeRemaining}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{auction.participantCount} bidders</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/auctions/${auction._id}`}
          className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${
            isEnded
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEnded ? 'View Results' : 'Place Bid'}
        </Link>
      </div>
    </div>
  );
};
```

---

## 📱 **Step 3: Mobile App Implementation**

### **Auction List Screen**
```tsx
// mobile/src/screens/auctions/AuctionListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency, formatTimeRemaining } from '../../utils/helpers';

interface Auction {
  _id: string;
  title: string;
  livestockId: {
    title: string;
    images: string[];
    breed: string;
    category: string;
  };
  currentPrice: number;
  endTime: string;
  status: string;
  bids: any[];
  participantCount: number;
}

export const AuctionListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchAuctions,
    refetchInterval: 30000,
  });

  const fetchAuctions = async () => {
    const response = await fetch('/api/auctions?status=active');
    if (!response.ok) throw new Error('Failed to fetch auctions');
    return response.json();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderAuctionItem = ({ item }: { item: Auction }) => (
    <AuctionCard 
      auction={item} 
      onPress={() => navigation.navigate('AuctionDetail', { id: item._id })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Auctions</Text>
        <Text style={styles.subtitle}>Bid on premium livestock</Text>
      </View>

      <FlatList
        data={data?.data || []}
        renderItem={renderAuctionItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const AuctionCard: React.FC<{
  auction: Auction;
  onPress: () => void;
}> = ({ auction, onPress }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining('Ended');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [auction.endTime]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: auction.livestockId.images[0] }}
        style={styles.cardImage}
      />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {auction.title}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>LIVE</Text>
          </View>
        </View>

        <Text style={styles.cardSubtitle}>
          {auction.livestockId.breed} • {auction.livestockId.category}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Current Bid</Text>
          <Text style={styles.price}>
            {formatCurrency(auction.currentPrice)}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>⏰ {timeRemaining}</Text>
          </View>
          <View style={styles.bidsContainer}>
            <Text style={styles.bidsText}>
              👥 {auction.participantCount} bidders
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '500',
  },
  bidsContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bidsText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default AuctionListScreen;
```

---

## 🔄 **Step 4: Real-time WebSocket Integration**

### **WebSocket Server Setup**
```javascript
// backend/lib/websocket.js
import { Server } from 'socket.io';

export const initializeAuctionWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected to auctions:', socket.id);

    // Join auction room
    socket.on('join-auction', (auctionId) => {
      socket.join(`auction-${auctionId}`);
      console.log(`User ${socket.id} joined auction ${auctionId}`);
    });

    // Leave auction room
    socket.on('leave-auction', (auctionId) => {
      socket.leave(`auction-${auctionId}`);
      console.log(`User ${socket.id} left auction ${auctionId}`);
    });

    // Handle new bid (server-side validation done in API)
    socket.on('place-bid', async (data) => {
      try {
        // Emit bid update to all users in the auction room
        io.to(`auction-${data.auctionId}`).emit('bid-update', {
          auctionId: data.auctionId,
          newBid: data.bid,
          currentPrice: data.amount,
          bidder: data.bidder,
          timestamp: new Date(),
        });

        // Emit bid confirmation to the bidder
        socket.emit('bid-confirmed', {
          success: true,
          bid: data.bid,
        });
      } catch (error) {
        socket.emit('bid-error', {
          success: false,
          message: error.message,
        });
      }
    });

    // Handle auction end
    socket.on('auction-ended', (data) => {
      io.to(`auction-${data.auctionId}`).emit('auction-completed', {
        auctionId: data.auctionId,
        winner: data.winner,
        winningBid: data.winningBid,
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from auctions:', socket.id);
    });
  });

  return io;
};
```

### **Frontend WebSocket Hook**
```tsx
// web-frontend/src/hooks/useAuctionWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface BidUpdate {
  auctionId: string;
  newBid: any;
  currentPrice: number;
  bidder: any;
  timestamp: string;
}

export const useAuctionWebSocket = (auctionId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastBid, setLastBid] = useState<BidUpdate | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000');

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-auction', auctionId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('bid-update', (data: BidUpdate) => {
      setLastBid(data);
    });

    socket.on('auction-completed', (data) => {
      console.log('Auction completed:', data);
      // Handle auction completion
    });

    return () => {
      if (socket) {
        socket.emit('leave-auction', auctionId);
        socket.disconnect();
      }
    };
  }, [auctionId]);

  const placeBid = (amount: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('place-bid', {
        auctionId,
        amount,
      });
    }
  };

  return {
    isConnected,
    lastBid,
    placeBid,
  };
};
```

---

## 🎯 **Complete Feature Flow**

### **User Journey: Participating in an Auction**

1. **Discovery**
   - User opens mobile app or web browser
   - Navigates to "Auctions" section
   - Sees list of active auctions with real-time updates

2. **Auction Details**
   - Clicks on an auction card
   - Views detailed livestock information
   - Sees current bid, time remaining, bidding history
   - Joins auction room via WebSocket

3. **Bidding Process**
   - User enters bid amount
   - Frontend validates minimum bid increment
   - API processes bid and updates database
   - WebSocket broadcasts update to all participants
   - Real-time price and timer updates

4. **Auction Completion**
   - Timer reaches zero
   - System determines winner
   - Winner notification sent
   - Payment process initiated
   - Livestock transfer arranged

### **Technical Flow**
```
Mobile/Web → API Endpoint → Database Update → WebSocket Broadcast → Real-time UI Update
```

---

## 📊 **Performance Considerations**

1. **Database Optimization**
   - Indexed queries for fast auction retrieval
   - Efficient bid storage and retrieval
   - Cached auction data for popular listings

2. **Real-time Performance**
   - WebSocket connection pooling
   - Rate limiting for bid submissions
   - Optimistic UI updates

3. **Scalability**
   - Horizontal scaling for WebSocket servers
   - Database sharding for high-volume auctions
   - CDN for auction images

---

This complete example shows how a single feature (livestock auctions) is implemented end-to-end across your entire platform, demonstrating the integration between backend APIs, web frontend, mobile app, and real-time functionality. 🚀🐄
