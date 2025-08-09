const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const router = require("../Router/router");

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.use(cors({
  origin: ["https://risun.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));

// Add a root route for health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'RISUN Backend API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', router);

// Export for Vercel serverless functions
module.exports = app;