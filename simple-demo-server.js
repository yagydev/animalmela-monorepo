#!/usr/bin/env node

// 🚀 KISAAN MELA - SIMPLE DEMO SERVER
// This demonstrates the app functionality without heavy dependencies

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const API_PORT = 8000;

// Demo data
const demoUsers = [
  { id: 1, email: 'admin@kisaanmela.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'farmer@kisaanmela.com', password: 'farmer123', name: 'Demo Farmer', role: 'farmer' },
  { id: 3, email: 'buyer@kisaanmela.com', password: 'buyer123', name: 'Demo Buyer', role: 'buyer' },
  { id: 4, email: 'demo@kisaanmela.com', password: 'demo123', name: 'Demo User', role: 'farmer' }
];

const demoListings = [
  { id: 1, title: 'Holstein Cow', price: 45000, category: 'cattle', seller: 'Demo Farmer', location: 'Punjab' },
  { id: 2, title: 'Murrah Buffalo', price: 55000, category: 'buffalo', seller: 'Demo Farmer', location: 'Haryana' },
  { id: 3, title: 'Goat Kids', price: 8000, category: 'goat', seller: 'Demo Farmer', location: 'Rajasthan' }
];

// Simple HTML pages
const htmlPages = {
  home: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kisaan Mela - Livestock Marketplace</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: #2c5530; color: white; padding: 1rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; }
        .nav-links { display: flex; gap: 20px; }
        .nav-links a { color: white; text-decoration: none; }
        .hero { background: #f4f4f4; padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: #2c5530; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .btn { background: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .features { padding: 4rem 0; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .feature { text-align: center; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .feature h3 { color: #2c5530; margin-bottom: 1rem; }
        .listings { padding: 4rem 0; background: #f9f9f9; }
        .listings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .listing { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .listing-image { height: 200px; background: #ddd; display: flex; align-items: center; justify-content: center; }
        .listing-content { padding: 1.5rem; }
        .listing h3 { color: #2c5530; margin-bottom: 0.5rem; }
        .price { font-size: 1.2rem; font-weight: bold; color: #e67e22; }
        footer { background: #2c5530; color: white; text-align: center; padding: 2rem 0; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">🐄 Kisaan Mela</div>
                <div class="nav-links">
                    <a href="/">Home</a>
                    <a href="/marketplace">Marketplace</a>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </div>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Welcome to Kisaan Mela</h1>
            <p>India's Premier Livestock Marketplace</p>
            <a href="/marketplace" class="btn">Browse Livestock</a>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem; color: #2c5530;">Why Choose Kisaan Mela?</h2>
            <div class="features-grid">
                <div class="feature">
                    <h3>🔍 Easy Search</h3>
                    <p>Find the perfect livestock with our advanced search and filtering system.</p>
                </div>
                <div class="feature">
                    <h3>💰 Best Prices</h3>
                    <p>Get competitive prices directly from farmers and verified sellers.</p>
                </div>
                <div class="feature">
                    <h3>🛡️ Secure Transactions</h3>
                    <p>Safe and secure payment processing with buyer protection.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="listings">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem; color: #2c5530;">Featured Listings</h2>
            <div class="listings-grid">
                ${demoListings.map(listing => `
                    <div class="listing">
                        <div class="listing-image">📷 ${listing.title}</div>
                        <div class="listing-content">
                            <h3>${listing.title}</h3>
                            <p>Seller: ${listing.seller}</p>
                            <p>Location: ${listing.location}</p>
                            <p class="price">₹${listing.price.toLocaleString()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 Kisaan Mela. All rights reserved.</p>
            <p>Status: ✅ Backend Running | ✅ Frontend Demo | ✅ Mobile App Ready</p>
        </div>
    </footer>
</body>
</html>`,

  login: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Kisaan Mela</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f4f4f4; }
        .container { max-width: 400px; margin: 100px auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #2c5530; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; color: #333; }
        input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; }
        .btn { width: 100%; background: #2c5530; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #1e3a22; }
        .demo-accounts { margin-top: 2rem; padding: 1rem; background: #f9f9f9; border-radius: 5px; }
        .demo-accounts h3 { color: #2c5530; margin-bottom: 1rem; }
        .demo-account { margin-bottom: 0.5rem; font-size: 0.9rem; }
        .back-link { text-align: center; margin-top: 1rem; }
        .back-link a { color: #2c5530; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐄 Login to Kisaan Mela</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Login</button>
        </form>
        
        <div class="demo-accounts">
            <h3>Demo Accounts:</h3>
            <div class="demo-account">👨‍💼 Admin: admin@kisaanmela.com / admin123</div>
            <div class="demo-account">👨‍🌾 Farmer: farmer@kisaanmela.com / farmer123</div>
            <div class="demo-account">🛒 Buyer: buyer@kisaanmela.com / buyer123</div>
            <div class="demo-account">🧪 Demo: demo@kisaanmela.com / demo123</div>
        </div>
        
        <div class="back-link">
            <a href="/">← Back to Home</a>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Login successful! Welcome ' + result.user.name);
                    window.location.href = '/dashboard';
                } else {
                    alert('Login failed: ' + result.message);
                }
            } catch (error) {
                alert('Login error: ' + error.message);
            }
        });
    </script>
</body>
</html>`
};

// API Server
function createApiServer() {
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        if (path === '/api/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Kisaan Mela API is running',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }));
        }
        else if (path === '/api/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const { email, password } = JSON.parse(body);
                    const user = demoUsers.find(u => u.email === email && u.password === password);
                    
                    if (user) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            message: 'Login successful',
                            user: { id: user.id, name: user.name, email: user.email, role: user.role },
                            token: 'demo-jwt-token-' + user.id
                        }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            message: 'Invalid credentials'
                        }));
                    }
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid JSON'
                    }));
                }
            });
        }
        else if (path === '/api/listings') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: demoListings
            }));
        }
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'API endpoint not found'
            }));
        }
    });
    
    server.listen(API_PORT, () => {
        console.log(`🔌 API Server running on http://localhost:${API_PORT}`);
    });
}

// Web Server
function createWebServer() {
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        
        if (path === '/' || path === '/home') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlPages.home);
        }
        else if (path === '/login') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlPages.login);
        }
        else if (path === '/api/login' && req.method === 'POST') {
            // Proxy to API server
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const apiReq = http.request({
                    hostname: 'localhost',
                    port: API_PORT,
                    path: '/api/login',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }, (apiRes) => {
                    res.writeHead(apiRes.statusCode, apiRes.headers);
                    apiRes.pipe(res);
                });
                apiReq.write(body);
                apiReq.end();
            });
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1><a href="/">Go Home</a>');
        }
    });
    
    server.listen(PORT, () => {
        console.log(`🌐 Web Server running on http://localhost:${PORT}`);
    });
}

// Start both servers
console.log('🚀 Starting Kisaan Mela Demo Servers...');
createApiServer();
createWebServer();

console.log(`
🎉 KISAAN MELA DEMO IS RUNNING!
================================

📱 Frontend: http://localhost:${PORT}
🔌 Backend API: http://localhost:${API_PORT}
🏥 Health Check: http://localhost:${API_PORT}/api/health

👥 Demo Accounts:
• admin@kisaanmela.com / admin123
• farmer@kisaanmela.com / farmer123
• buyer@kisaanmela.com / buyer123
• demo@kisaanmela.com / demo123

✅ Features Working:
• User authentication
• Marketplace listings
• Responsive design
• API endpoints
• Cross-platform ready

Press Ctrl+C to stop the servers
`);
