# Farmers Market API Testing Guide

This guide provides comprehensive instructions for setting up and testing the Farmers Market API with MongoDB integration.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 1. Setup Local Environment

### Install MongoDB
```bash
# macOS (using Homebrew)
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongod --version
ps aux | grep mongod
```

### Verify MongoDB Connection
```bash
# Connect to MongoDB shell
mongosh

# Check databases
show dbs

# Exit MongoDB shell
exit
```

## 2. Install Dependencies

```bash
# Install test dependencies
npm install express mongoose cors bcryptjs mocha chai supertest nyc

# Or install from package.json
npm install --package-lock-only
```

## 3. Start API Test Server

```bash
# Start the test server
node api-test-server.js

# Server will start on http://localhost:3001
# Health check: http://localhost:3001/health
```

## 4. API Testing Methods

### Method 1: Automated Tests with Mocha

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Method 2: Manual Testing with Postman

1. **Import Collection**: Import `postman-collection.json` into Postman
2. **Set Environment Variables**:
   - `baseUrl`: `http://localhost:3001`
   - `farmerId`: (will be set automatically)
   - `productId`: (will be set automatically)

3. **Test Sequence**:
   - Health Check
   - Seed Data
   - Create Farmer
   - Get All Farmers
   - Create Product
   - Get All Products
   - Add to Cart
   - Create Order

### Method 3: Manual Testing with curl

```bash
# Health check
curl http://localhost:3001/health

# Create seed data
curl -X POST http://localhost:3001/api/seed

# Create farmer
curl -X POST http://localhost:3001/api/farmers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "location": {
      "state": "Punjab",
      "district": "Ludhiana",
      "pincode": "141001",
      "village": "Village A"
    },
    "products": ["wheat", "corn"]
  }'

# Get all farmers
curl http://localhost:3001/api/farmers

# Create product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fresh Organic Wheat",
    "description": "Premium quality organic wheat",
    "price": 2500,
    "unit": "quintal",
    "quantity": 10,
    "category": "crops",
    "images": ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop"],
    "sellerId": "FARMER_ID_HERE",
    "location": {
      "state": "Punjab",
      "district": "Ludhiana"
    },
    "negotiable": true,
    "minimumOrder": 1
  }'

# Get all products
curl http://localhost:3001/api/products

# Filter products by category
curl "http://localhost:3001/api/products?category=crops"

# Filter products by price range
curl "http://localhost:3001/api/products?minPrice=1000&maxPrice=3000"

# Sort products by price
curl "http://localhost:3001/api/products?sortBy=price_low"

# Add to cart
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "FARMER_ID_HERE",
    "productId": "PRODUCT_ID_HERE",
    "quantity": 2
  }'

# Get cart
curl "http://localhost:3001/api/cart/FARMER_ID_HERE"

# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "buyerId": "FARMER_ID_HERE",
    "sellerId": "FARMER_ID_HERE",
    "items": [{
      "productId": "PRODUCT_ID_HERE",
      "quantity": 2,
      "unitPrice": 2500,
      "totalPrice": 5000
    }],
    "totalAmount": 5000,
    "shippingAddress": {
      "name": "John Doe",
      "address": "123 Main Street",
      "city": "Ludhiana",
      "state": "Punjab",
      "pincode": "141001",
      "mobile": "9876543210"
    },
    "paymentMethod": "cod"
  }'

# Get orders
curl "http://localhost:3001/api/orders/FARMER_ID_HERE"
```

## 5. Test Scenarios

### Basic Functionality Tests
- ✅ Health check endpoint
- ✅ Database connection
- ✅ CRUD operations for farmers
- ✅ CRUD operations for products
- ✅ Cart functionality
- ✅ Order management

### Filtering and Sorting Tests
- ✅ Filter products by category
- ✅ Filter products by price range
- ✅ Filter products by location
- ✅ Sort products by price (low to high)
- ✅ Sort products by price (high to low)
- ✅ Sort products by rating
- ✅ Sort products by newest

### Error Handling Tests
- ✅ Invalid farmer data
- ✅ Invalid product data
- ✅ Non-existent resources (404)
- ✅ Duplicate email addresses
- ✅ Missing required fields

### Integration Tests
- ✅ Farmer creation → Product creation → Cart addition
- ✅ Cart → Order creation workflow
- ✅ Order status management
- ✅ Data relationships and population

## 6. Database Schema

### Farmers Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  mobile: String,
  location: {
    state: String,
    district: String,
    pincode: String,
    village: String
  },
  products: [String],
  createdAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  unit: String,
  quantity: Number,
  category: String,
  images: [String],
  sellerId: ObjectId (ref: Farmer),
  location: {
    state: String,
    district: String
  },
  rating: Number,
  totalRatings: Number,
  negotiable: Boolean,
  minimumOrder: Number,
  createdAt: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Farmer),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  totalAmount: Number,
  itemCount: Number,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId (ref: Farmer),
  sellerId: ObjectId (ref: Farmer),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  totalAmount: Number,
  status: String (pending|confirmed|shipped|delivered|cancelled),
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    mobile: String
  },
  paymentMethod: String (cod|online|upi),
  createdAt: Date
}
```

## 7. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/seed` | Create seed data |
| POST | `/api/farmers` | Create farmer |
| GET | `/api/farmers` | Get all farmers |
| GET | `/api/farmers/:id` | Get farmer by ID |
| POST | `/api/products` | Create product |
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/cart` | Add item to cart |
| GET | `/api/cart/:userId` | Get user cart |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:userId` | Get user orders |

## 8. Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod
   
   # Start MongoDB if not running
   brew services start mongodb-community
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

3. **Test Failures**
   ```bash
   # Clear test database
   mongosh farmers_market_test --eval "db.dropDatabase()"
   
   # Run tests again
   npm test
   ```

4. **Dependencies Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 9. Performance Testing

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/health"
      - get:
          url: "/api/farmers"
      - get:
          url: "/api/products"
EOF

# Run load test
artillery run load-test.yml
```

## 10. Monitoring and Logging

### Enable Detailed Logging
```javascript
// Add to api-test-server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request Body:', req.body);
  next();
});
```

### Database Monitoring
```bash
# Monitor MongoDB operations
mongosh --eval "db.setProfilingLevel(2)"

# View slow operations
mongosh farmers_market_test --eval "db.system.profile.find().sort({ts: -1}).limit(5).pretty()"
```

This comprehensive testing setup ensures your Farmers Market API is robust, reliable, and ready for production use!
