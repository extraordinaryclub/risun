const { addLocation, getUserLocations, deleteLocation } = require('../appcontroller/controller');

// CORS configuration
const corsOptions = {
  origin: ["https://risun.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'User-Email', 'user-email']
};

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin.join(','));
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  // Set CORS headers for actual request
  res.setHeader('Access-Control-Allow-Origin', corsOptions.origin.includes(req.headers.origin) ? req.headers.origin : corsOptions.origin[0]);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  try {
    // Create a mock Express-like request/response for the controller
    const mockReq = {
      body: req.body,
      method: req.method,
      headers: req.headers,
      query: req.query
    };

    const mockRes = {
      status: (code) => ({
        json: (data) => {
          res.status(code).json(data);
        }
      }),
      json: (data) => {
        res.json(data);
      }
    };

    if (req.method === 'POST') {
      await addLocation(mockReq, mockRes);
    } else if (req.method === 'GET') {
      await getUserLocations(mockReq, mockRes);
    } else if (req.method === 'DELETE') {
      await deleteLocation(mockReq, mockRes);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Visualizations error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}