# 🚀 RISUN Deployment Guide - Vercel Setup

## 📋 Current Deployment Architecture

### **Frontend**: `risun.vercel.app`
- **Platform**: Vercel
- **Framework**: React 18 + Vite
- **Auto-deploy**: GitHub integration

### **Backend**: `risun-backend.vercel.app`
- **Platform**: Vercel Serverless Functions
- **Framework**: Node.js + Express
- **Database**: MongoDB Atlas

### **ML Services**: Railway.app
- **Fault Detection**: `faultdetmodel-production.up.railway.app`
- **Power Prediction**: `ppgmodel-production.up.railway.app`

---

## ⚙️ Environment Configuration

### **Frontend Environment Variables**

#### Production (`.env.production`)
```env
VITE_REACT_APP_SERVER_DOMAIN=https://risun-backend.vercel.app
```

#### Development (`.env`)
```env
VITE_REACT_APP_SERVER_DOMAIN=https://risun-backend.vercel.app
```

#### Local Development (`.env.local`)
```env
VITE_REACT_APP_SERVER_DOMAIN=http://localhost:3500
```

### **Backend Environment Variables (Vercel)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/risun
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=production
```

### **Required API Keys**
```env
# Weather Services
METEOMATICS_TOKEN=your_meteomatics_token
OPENWEATHER_API_KEY=your_openweather_api_key
OPENCAGE_API_KEY=your_opencage_api_key

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
```

---

## 🔧 Vercel Configuration Files

### **Frontend Vercel Config** (`CLIENT/vercel.json`)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "VITE_REACT_APP_SERVER_DOMAIN": "https://risun-backend.vercel.app"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **Backend Vercel Config** (`SERVER_1/server/vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "index.js": {
      "maxDuration": 30
    }
  }
}
```

---

## 📦 Package.json Scripts

### **Frontend Scripts** (`CLIENT/package.json`)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### **Backend Scripts** (`SERVER_1/server/package.json`)
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "echo 'No build step required'",
    "vercel-build": "echo 'No build step required'"
  }
}
```

---

## 🚀 Deployment Steps

### **1. Frontend Deployment**
```bash
# Navigate to frontend directory
cd CLIENT

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Vercel (if using CLI)
vercel --prod
```

### **2. Backend Deployment**
```bash
# Navigate to backend directory
cd SERVER_1/server

# Install dependencies
npm install

# Deploy to Vercel
vercel --prod
```

### **3. Environment Variables Setup**

#### **Vercel Dashboard Setup**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required environment variables

#### **Frontend Environment Variables**
- `VITE_REACT_APP_SERVER_DOMAIN` = `https://risun-backend.vercel.app`

#### **Backend Environment Variables**
- `MONGODB_URI` = Your MongoDB Atlas connection string
- `JWT_SECRET` = Your secure JWT secret
- `NODE_ENV` = `production`

---

## 🔍 Verification Checklist

### **Frontend Checks**
- [ ] `https://risun.vercel.app` loads successfully
- [ ] Navigation works between all pages
- [ ] Authentication redirects to backend correctly
- [ ] API calls reach backend at `risun-backend.vercel.app`

### **Backend Checks**
- [ ] `https://risun-backend.vercel.app/api/` responds
- [ ] CORS allows requests from `risun.vercel.app`
- [ ] MongoDB connection established
- [ ] JWT authentication working

### **Integration Checks**
- [ ] User registration/login works
- [ ] Location management (add/delete) functions
- [ ] Weather data fetching works
- [ ] ML model predictions work (fault detection & power prediction)

---

## 🐛 Common Issues & Solutions

### **CORS Issues**
```javascript
// Ensure backend CORS includes your frontend domain
app.use(cors({
  origin: ["https://risun.vercel.app", "http://localhost:5173"],
  credentials: true,
}));
```

### **Environment Variable Issues**
```bash
# Check if environment variables are loaded
console.log('Backend URL:', import.meta.env.VITE_REACT_APP_SERVER_DOMAIN);
```

### **API Endpoint Issues**
```javascript
// Ensure all API calls use relative paths
// ✅ Correct
const response = await Axios.post('/api/login', credentials);

// ❌ Incorrect
const response = await Axios.post('http://localhost:3500/api/login', credentials);
```

### **Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Performance Optimization

### **Frontend Optimizations**
- **Code Splitting**: Implemented with React.lazy()
- **Image Optimization**: Vercel automatic image optimization
- **Caching**: Browser caching for static assets
- **Bundle Analysis**: Use `npm run build` to check bundle size

### **Backend Optimizations**
- **Serverless Functions**: Automatic scaling with Vercel
- **Database Connection**: MongoDB Atlas connection pooling
- **Response Compression**: Gzip compression enabled
- **Error Handling**: Proper error responses for debugging

---

## 🔐 Security Configuration

### **Frontend Security Headers**
```json
{
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options", 
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    }
  ]
}
```

### **Backend Security**
- JWT token validation
- CORS configuration
- Input sanitization
- Rate limiting (recommended to add)

---

## 📈 Monitoring & Analytics

### **Vercel Analytics**
- Enable Vercel Analytics in dashboard
- Monitor page load times
- Track user interactions
- Performance insights

### **Error Tracking**
```javascript
// Add error boundary for React components
// Implement proper error logging
console.error('API Error:', error);
```

---

## 🔄 CI/CD Pipeline

### **Automatic Deployments**
1. **Frontend**: Push to `main` branch → Auto-deploy to `risun.vercel.app`
2. **Backend**: Push to `main` branch → Auto-deploy to `risun-backend.vercel.app`
3. **Preview Deployments**: Pull requests create preview URLs

### **Deployment Workflow**
```bash
# Development workflow
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create PR → Preview deployment created
# Merge PR → Production deployment triggered
```

---

## 📞 Support & Troubleshooting

### **Vercel Support**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Status](https://vercel-status.com/)

### **Debug Commands**
```bash
# Check deployment logs
vercel logs

# Check build logs
vercel build

# Local development with production env
vercel dev
```

---

## ✅ Final Deployment Checklist

- [ ] Frontend deployed to `risun.vercel.app`
- [ ] Backend deployed to `risun-backend.vercel.app`
- [ ] All environment variables configured
- [ ] CORS properly configured
- [ ] Database connection working
- [ ] ML services accessible
- [ ] Authentication flow working
- [ ] All features tested in production
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Monitoring enabled

🎉 **Your RISUN platform is now live and ready for users!**