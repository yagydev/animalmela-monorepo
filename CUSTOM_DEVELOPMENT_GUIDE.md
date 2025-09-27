# 🚀 Custom Development Guide - Kisaan Mela Platform

Welcome to custom development on your Kisaan Mela platform! This guide will help you add new features to your existing livestock marketplace.

## 🏗️ Platform Architecture Overview

Your platform already includes:

### ✅ **Core Features Available:**
- 🐄 **Complete livestock marketplace** - Buy/sell cattle, goats, sheep, etc.
- 💬 **Real-time chat system** - Buyer-seller communication
- 💳 **Payment processing** - Stripe integration for secure payments
- 👨‍💼 **Admin dashboard** - Platform management and analytics
- 🔐 **Authentication system** - JWT-based user authentication
- 📱 **Mobile app foundation** - React Native with Expo
- 🚚 **Service marketplace** - Veterinary, transport, feed services
- 🔍 **Search & filtering** - Advanced livestock search
- ⭐ **Review system** - User ratings and feedback
- 📊 **Analytics** - Business insights and reporting

### 🎯 **Ready for Custom Development:**
- **Backend API**: `/backend/pages/api/` - Add new endpoints
- **Web Frontend**: `/web-frontend/src/` - Add new components
- **Mobile App**: `/mobile/src/` - Add new screens
- **Shared Code**: `/shared/` - Common utilities and types

## 🛠️ Development Environment Setup

### 1. Start Development Servers

```bash
# Start all development services
npm run dev

# Or start individually:
npm run dev:backend    # Backend API (port 5000)
npm run dev:web       # Web frontend (port 3000)
npm run dev:mobile    # Mobile app (port 8082)
```

### 2. Development URLs

- **Web App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mobile App**: http://localhost:8082
- **API Docs**: http://localhost:5000/api/docs

## 🔧 Adding Custom Features

### 📡 **1. Custom API Endpoints**

Create new API endpoints in `backend/pages/api/`:

#### Example: Livestock Auction System

```javascript
// backend/pages/api/auctions/create.js
import { connectDB } from '../../../lib/mongodb';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await authenticate(req);
    
    const {
      livestockId,
      startingPrice,
      duration,
      description
    } = req.body;

    const auction = await Auction.create({
      livestockId,
      sellerId: user.id,
      startingPrice,
      currentPrice: startingPrice,
      duration,
      description,
      status: 'active',
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 60 * 60 * 1000)
    });

    res.status(201).json({
      success: true,
      auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

#### Example: Weather API Integration

```javascript
// backend/pages/api/weather/forecast.js
import axios from 'axios';

export default async function handler(req, res) {
  const { location } = req.query;
  
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.WEATHER_API_KEY}`
    );
    
    res.status(200).json({
      success: true,
      forecast: weatherData.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Weather data unavailable'
    });
  }
}
```

### 🎨 **2. Custom Web Components**

Add new components in `web-frontend/src/components/`:

#### Example: Livestock Auction Component

```jsx
// web-frontend/src/components/auctions/AuctionCard.tsx
import React, { useState, useEffect } from 'react';
import { formatCurrency, formatTimeRemaining } from '../../utils/helpers';

interface AuctionCardProps {
  auction: {
    id: string;
    livestock: any;
    currentPrice: number;
    endTime: string;
    bidCount: number;
  };
  onBid: (auctionId: string, amount: number) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onBid }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [bidAmount, setBidAmount] = useState(auction.currentPrice + 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(auction.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const handleBid = () => {
    if (bidAmount > auction.currentPrice) {
      onBid(auction.id, bidAmount);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {auction.livestock.breed} {auction.livestock.type}
          </h3>
          <p className="text-sm text-gray-600">
            Age: {auction.livestock.age} months
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Bid</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(auction.currentPrice)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <img
          src={auction.livestock.images[0]}
          alt={auction.livestock.breed}
          className="w-full h-48 object-cover rounded-md"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Time Remaining</p>
          <p className="font-semibold text-red-600">{timeRemaining}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Bids</p>
          <p className="font-semibold">{auction.bidCount}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(Number(e.target.value))}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          min={auction.currentPrice + 1}
        />
        <button
          onClick={handleBid}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Place Bid
        </button>
      </div>
    </div>
  );
};
```

#### Example: Weather Widget

```jsx
// web-frontend/src/components/weather/WeatherWidget.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface WeatherWidgetProps {
  location: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {
  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetch(`/api/weather/forecast?location=${location}`).then(res => res.json()),
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Weather in {location}</h3>
      {weather?.forecast && (
        <div className="grid grid-cols-3 gap-4">
          {weather.forecast.list.slice(0, 3).map((day: any, index: number) => (
            <div key={index} className="text-center">
              <p className="text-sm opacity-90">
                {new Date(day.dt * 1000).toLocaleDateString('en-IN', { weekday: 'short' })}
              </p>
              <p className="text-2xl font-bold">{Math.round(day.main.temp - 273.15)}°C</p>
              <p className="text-xs opacity-75">{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 text-sm opacity-90">
        <p>💡 Good weather for livestock grazing today!</p>
      </div>
    </div>
  );
};
```

### 📱 **3. Custom Mobile Screens**

Add new screens in `mobile/src/screens/`:

#### Example: Auction Screen

```tsx
// mobile/src/screens/AuctionScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuctionCard } from '../components/AuctionCard';

export const AuctionScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: auctions, isLoading, refetch } = useQuery({
    queryKey: ['auctions'],
    queryFn: () => fetch('/api/auctions').then(res => res.json()),
  });

  const bidMutation = useMutation({
    mutationFn: ({ auctionId, amount }: { auctionId: string; amount: number }) =>
      fetch(`/api/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }).then(res => res.json()),
    onSuccess: () => {
      Alert.alert('Success', 'Your bid has been placed!');
      refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to place bid. Please try again.');
    },
  });

  const handleBid = (auctionId: string, amount: number) => {
    Alert.alert(
      'Confirm Bid',
      `Are you sure you want to bid ₹${amount.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => bidMutation.mutate({ auctionId, amount }) },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Auctions</Text>
      
      <FlatList
        data={auctions?.auctions || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AuctionCard
            auction={item}
            onBid={handleBid}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 16,
  },
});
```

## 🔄 **4. Real-time Features with WebSocket**

Add real-time functionality for auctions, chat, and notifications:

```javascript
// backend/lib/websocket.js
import { Server } from 'socket.io';

export const initializeWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join auction room
    socket.on('join-auction', (auctionId) => {
      socket.join(`auction-${auctionId}`);
    });

    // Handle new bid
    socket.on('new-bid', (data) => {
      io.to(`auction-${data.auctionId}`).emit('bid-update', data);
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
      io.to(`chat-${data.chatId}`).emit('new-message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
```

## 📊 **5. Custom Database Models**

Add new models in `backend/models/`:

```javascript
// backend/models/Auction.js
import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  livestockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livestock',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  bids: [{
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
```

## 🎨 **6. Custom Styling and Themes**

Customize the look and feel:

```css
/* web-frontend/src/styles/custom.css */
.kisaan-theme {
  --primary-color: #22c55e;
  --secondary-color: #16a34a;
  --accent-color: #fbbf24;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --background: #f9fafb;
}

.auction-card {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.auction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

.livestock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}
```

## 🧪 **7. Testing Your Custom Features**

```javascript
// backend/__tests__/auctions.test.js
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/auctions/create';

describe('/api/auctions/create', () => {
  it('creates a new auction', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        livestockId: '507f1f77bcf86cd799439011',
        startingPrice: 50000,
        duration: 24,
        description: 'Healthy Holstein cow for auction',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.auction).toBeDefined();
  });
});
```

## 🚀 **8. Deployment of Custom Features**

After developing your custom features:

```bash
# Test locally
npm run test

# Build for production
npm run build

# Deploy to production
./deploy-kisaanmela.sh
```

## 💡 **Custom Feature Ideas**

Here are some ideas for custom features you can add:

### 🐄 **Livestock-Specific Features:**
- **Breeding Records**: Track lineage and breeding history
- **Health Monitoring**: Vaccination schedules and health records
- **Feed Calculator**: Calculate optimal feed requirements
- **Pregnancy Tracker**: Monitor breeding and pregnancy cycles
- **Milk Production**: Track daily milk yield for dairy cattle

### 🌾 **Agriculture Features:**
- **Crop Calendar**: Seasonal planting and harvesting schedules
- **Soil Testing**: Integration with soil testing services
- **Irrigation Management**: Smart irrigation scheduling
- **Pest Control**: Disease and pest identification
- **Market Prices**: Real-time commodity price tracking

### 💼 **Business Features:**
- **Loan Calculator**: Agricultural loan calculations
- **Insurance**: Livestock and crop insurance integration
- **Accounting**: Farm expense and income tracking
- **Inventory**: Feed, medicine, and equipment management
- **Reports**: Business analytics and profit/loss reports

### 🤝 **Community Features:**
- **Farmer Groups**: Local farming community groups
- **Knowledge Sharing**: Tips and best practices sharing
- **Events**: Agricultural fairs and livestock shows
- **Mentorship**: Connect new farmers with experienced ones
- **Cooperative**: Group buying and selling features

## 📚 **Resources**

- **API Documentation**: http://localhost:5000/api/docs
- **Component Library**: `/web-frontend/src/components/`
- **Database Models**: `/backend/models/`
- **Shared Utilities**: `/shared/`
- **Mobile Components**: `/mobile/src/components/`

## 🆘 **Getting Help**

1. Check existing code in similar features
2. Review API documentation
3. Test with development environment
4. Use browser dev tools for debugging
5. Check logs: `npm run logs`

---

**Happy Coding! 🚀** Your Kisaan Mela platform is ready for unlimited customization. Build features that will help farmers and livestock traders across India! 🇮🇳🐄
