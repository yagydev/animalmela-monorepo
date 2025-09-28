// Frontend API proxy to backend OTP send endpoint
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { mobile } = req.body;

    // Validate required fields
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    // Validate mobile format (basic validation)
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number'
      });
    }

    // Proxy request to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${backendUrl}/auth/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile }),
    });

    const data = await response.json();

    // Return the response from backend
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Send OTP proxy error:', error);

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}
