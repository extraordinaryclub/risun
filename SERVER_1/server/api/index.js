// Health check endpoint for Vercel
export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'RISUN Backend API is running!', 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      endpoints: [
        '/api/register - POST',
        '/api/login - POST', 
        '/api/visualizations - GET, POST, DELETE'
      ]
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}