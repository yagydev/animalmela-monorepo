const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../api-test-server');

// Test configuration
const MONGODB_TEST_URI = 'mongodb://127.0.0.1:27017/farmers_market_test';

describe('Farmers Market API Tests', () => {
  before(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_TEST_URI);
    console.log('✅ Connected to test database');
  });

  after(async () => {
    // Clean up and disconnect
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    console.log('✅ Test database cleaned up');
  });

  describe('Health Check', () => {
    it('should return health status', (done) => {
      request(app)
        .get('/health')
        .expect(200)
        .expect((res) => {
          if (!res.body.status || res.body.status !== 'OK') {
            throw new Error('Health check failed');
          }
          if (!res.body.mongodb || res.body.mongodb !== 'connected') {
            throw new Error('MongoDB not connected');
          }
        })
        .end(done);
    });
  });

  describe('Seed Data', () => {
    it('should create seed data successfully', (done) => {
      request(app)
        .post('/api/seed')
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Seed data creation failed');
          }
          if (res.body.farmers !== 3) {
            throw new Error('Expected 3 farmers, got ' + res.body.farmers);
          }
          if (res.body.products !== 3) {
            throw new Error('Expected 3 products, got ' + res.body.products);
          }
        })
        .end(done);
    });
  });

  describe('Farmer API', () => {
    it('should create a new farmer', (done) => {
      const farmerData = {
        name: 'Test Farmer',
        email: 'test@example.com',
        mobile: '9876543210',
        location: {
          state: 'Test State',
          district: 'Test District',
          pincode: '123456',
          village: 'Test Village'
        },
        products: ['wheat', 'rice']
      };

      request(app)
        .post('/api/farmers')
        .send(farmerData)
        .expect(201)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Farmer creation failed');
          }
          if (res.body.farmer.name !== farmerData.name) {
            throw new Error('Farmer name mismatch');
          }
          if (res.body.farmer.email !== farmerData.email) {
            throw new Error('Farmer email mismatch');
          }
        })
        .end(done);
    });

    it('should get all farmers', (done) => {
      request(app)
        .get('/api/farmers')
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to get farmers');
          }
          if (!Array.isArray(res.body.farmers)) {
            throw new Error('Farmers should be an array');
          }
          if (res.body.farmers.length < 3) {
            throw new Error('Expected at least 3 farmers from seed data');
          }
        })
        .end(done);
    });

    it('should get farmer by ID', (done) => {
      request(app)
        .get('/api/farmers')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          const farmerId = res.body.farmers[0]._id;
          request(app)
            .get(`/api/farmers/${farmerId}`)
            .expect(200)
            .expect((res) => {
              if (!res.body.success) {
                throw new Error('Failed to get farmer by ID');
              }
              if (!res.body.farmer._id) {
                throw new Error('Farmer ID missing');
              }
            })
            .end(done);
        });
    });

    it('should return 404 for non-existent farmer', (done) => {
      const fakeId = new mongoose.Types.ObjectId();
      request(app)
        .get(`/api/farmers/${fakeId}`)
        .expect(404)
        .expect((res) => {
          if (res.body.success) {
            throw new Error('Should return success: false for non-existent farmer');
          }
        })
        .end(done);
    });
  });

  describe('Product API', () => {
    let farmerId;

    before((done) => {
      request(app)
        .get('/api/farmers')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          farmerId = res.body.farmers[0]._id;
          done();
        });
    });

    it('should create a new product', (done) => {
      const productData = {
        title: 'Test Product',
        description: 'Test product description',
        price: 1000,
        unit: 'kg',
        quantity: 10,
        category: 'crops',
        images: ['https://example.com/image.jpg'],
        sellerId: farmerId,
        location: {
          state: 'Test State',
          district: 'Test District'
        },
        negotiable: true,
        minimumOrder: 1
      };

      request(app)
        .post('/api/products')
        .send(productData)
        .expect(201)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Product creation failed');
          }
          if (res.body.product.title !== productData.title) {
            throw new Error('Product title mismatch');
          }
          if (res.body.product.price !== productData.price) {
            throw new Error('Product price mismatch');
          }
        })
        .end(done);
    });

    it('should get all products', (done) => {
      request(app)
        .get('/api/products')
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to get products');
          }
          if (!Array.isArray(res.body.products)) {
            throw new Error('Products should be an array');
          }
          if (res.body.products.length < 3) {
            throw new Error('Expected at least 3 products from seed data');
          }
        })
        .end(done);
    });

    it('should filter products by category', (done) => {
      request(app)
        .get('/api/products?category=crops')
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to filter products by category');
          }
          res.body.products.forEach(product => {
            if (product.category !== 'crops') {
              throw new Error('All products should have category "crops"');
            }
          });
        })
        .end(done);
    });

    it('should filter products by price range', (done) => {
      request(app)
        .get('/api/products?minPrice=1000&maxPrice=2000')
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to filter products by price');
          }
          res.body.products.forEach(product => {
            if (product.price < 1000 || product.price > 2000) {
              throw new Error('All products should be within price range');
            }
          });
        })
        .end(done);
    });

    it('should sort products by price (low to high)', (done) => {
      request(app)
        .get('/api/products?sortBy=price_low')
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to sort products by price');
          }
          for (let i = 1; i < res.body.products.length; i++) {
            if (res.body.products[i-1].price > res.body.products[i].price) {
              throw new Error('Products not sorted by price (low to high)');
            }
          }
        })
        .end(done);
    });
  });

  describe('Cart API', () => {
    let userId, productId;

    before((done) => {
      Promise.all([
        request(app).get('/api/farmers').expect(200),
        request(app).get('/api/products').expect(200)
      ]).then(([farmersRes, productsRes]) => {
        userId = farmersRes.body.farmers[0]._id;
        productId = productsRes.body.products[0]._id;
        done();
      }).catch(done);
    });

    it('should add item to cart', (done) => {
      const cartData = {
        userId: userId,
        productId: productId,
        quantity: 2
      };

      request(app)
        .post('/api/cart')
        .send(cartData)
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to add item to cart');
          }
          if (!res.body.cart.items || res.body.cart.items.length === 0) {
            throw new Error('Cart should have items');
          }
          if (res.body.cart.totalAmount <= 0) {
            throw new Error('Cart total amount should be greater than 0');
          }
        })
        .end(done);
    });

    it('should get cart for user', (done) => {
      request(app)
        .get(`/api/cart/${userId}`)
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to get cart');
          }
          if (!res.body.cart) {
            throw new Error('Cart should exist');
          }
        })
        .end(done);
    });

    it('should update cart when adding same item again', (done) => {
      const cartData = {
        userId: userId,
        productId: productId,
        quantity: 1
      };

      request(app)
        .post('/api/cart')
        .send(cartData)
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to update cart');
          }
          const item = res.body.cart.items.find(item => 
            item.productId._id === productId
          );
          if (!item || item.quantity !== 3) {
            throw new Error('Item quantity should be updated to 3');
          }
        })
        .end(done);
    });
  });

  describe('Order API', () => {
    let buyerId, sellerId, productId;

    before((done) => {
      Promise.all([
        request(app).get('/api/farmers').expect(200),
        request(app).get('/api/products').expect(200)
      ]).then(([farmersRes, productsRes]) => {
        buyerId = farmersRes.body.farmers[0]._id;
        sellerId = farmersRes.body.farmers[1]._id;
        productId = productsRes.body.products[0]._id;
        done();
      }).catch(done);
    });

    it('should create a new order', (done) => {
      const orderData = {
        buyerId: buyerId,
        sellerId: sellerId,
        items: [{
          productId: productId,
          quantity: 2,
          unitPrice: 2500,
          totalPrice: 5000
        }],
        totalAmount: 5000,
        shippingAddress: {
          name: 'Test Buyer',
          address: 'Test Address',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          mobile: '9876543210'
        },
        paymentMethod: 'cod'
      };

      request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Order creation failed');
          }
          if (res.body.order.totalAmount !== orderData.totalAmount) {
            throw new Error('Order total amount mismatch');
          }
          if (res.body.order.status !== 'pending') {
            throw new Error('Order status should be pending');
          }
        })
        .end(done);
    });

    it('should get orders for user', (done) => {
      request(app)
        .get(`/api/orders/${buyerId}`)
        .expect(200)
        .expect((res) => {
          if (!res.body.success) {
            throw new Error('Failed to get orders');
          }
          if (!Array.isArray(res.body.orders)) {
            throw new Error('Orders should be an array');
          }
          if (res.body.orders.length === 0) {
            throw new Error('Should have at least one order');
          }
        })
        .end(done);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid farmer data', (done) => {
      const invalidFarmerData = {
        // Missing required fields
        name: 'Test'
      };

      request(app)
        .post('/api/farmers')
        .send(invalidFarmerData)
        .expect(400)
        .expect((res) => {
          if (res.body.success) {
            throw new Error('Should return success: false for invalid data');
          }
        })
        .end(done);
    });

    it('should handle invalid product data', (done) => {
      const invalidProductData = {
        title: 'Test Product'
        // Missing required fields
      };

      request(app)
        .post('/api/products')
        .send(invalidProductData)
        .expect(400)
        .expect((res) => {
          if (res.body.success) {
            throw new Error('Should return success: false for invalid data');
          }
        })
        .end(done);
    });

    it('should handle 404 for non-existent routes', (done) => {
      request(app)
        .get('/api/non-existent-route')
        .expect(404)
        .expect((res) => {
          if (res.body.success) {
            throw new Error('Should return success: false for 404');
          }
        })
        .end(done);
    });
  });
});
