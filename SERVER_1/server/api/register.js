const { register } = require('../appcontroller/controller');

// CORS configuration
const corsOptions = {
  origin: ["https://risun.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = async function handler(req, res) {
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

  if (req.method === 'POST') {
    try {
      // Create a mock Express-like request/response for the controller
      const mockReq = {
        body: req.body,
        method: req.method,
        headers: req.headers
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

      await register(mockReq, mockRes);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}