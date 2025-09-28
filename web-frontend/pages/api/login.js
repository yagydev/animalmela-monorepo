// Temporary standalone login API for kisaanmela.com
// This provides basic authentication until full backend is deployed

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Demo authentication - In production, this would connect to your database
    const demoUsers = [
      { email: 'admin@kisaanmela.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      { email: 'farmer@kisaanmela.com', password: 'farmer123', role: 'farmer', name: 'Demo Farmer' },
      { email: 'buyer@kisaanmela.com', password: 'buyer123', role: 'buyer', name: 'Demo Buyer' },
      { email: 'demo@kisaanmela.com', password: 'demo123', role: 'farmer', name: 'Demo User' }
    ];

    // Check if user exists and password matches
    const user = demoUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create a simple JWT-like token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      id: user.email,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64');

    // Successful login
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.email,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}
