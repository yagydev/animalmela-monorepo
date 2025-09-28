// Frontend API proxy to backend settings endpoint
export default async function handler(req, res) {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header required'
      });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    if (req.method === 'GET') {
      // Get user settings
      const response = await fetch(`${backendUrl}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
      });

      const data = await response.json();
      return res.status(response.status).json(data);

    } else if (req.method === 'PUT') {
      // Update user settings
      const { notifications, privacy, security } = req.body;

      const response = await fetch(`${backendUrl}/settings/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({ notifications, privacy, security }),
      });

      const data = await response.json();
      return res.status(response.status).json(data);

    } else {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Settings proxy error:', error);

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}
