// Frontend API proxy to backend logout endpoint
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    // Proxy request to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${backendUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const data = await response.json();

    // Return the response from backend
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Logout proxy error:', error);

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}
