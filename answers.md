# RISUN Project Analysis

## 🧠 FUNCTIONAL ANALYSIS — "What does the project actually do?"

### Input Types
- **Images**: Solar panel images for fault detection (uploaded via file input)
- **Location Data**: GPS coordinates and location names (via OpenCage geocoding API)
- **Weather Data**: Real-time weather parameters from Meteomatics API including:
  - Temperature, humidity, pressure
  - Wind speed, wind direction, wind gusts
  - Precipitation, snowfall
  - Cloud cover data
  - Solar radiation data
  - Sun elevation and azimuth angles

### Sample Inputs
- **Dynamic Weather Data**: Real-time fetched from Meteomatics API (not hardcoded)
- **Location Coordinates**: Dynamically fetched via OpenCage geocoding
- **Hardcoded Elements**: Some demo data in Dashboard component for air quality and parking

### Outputs
- **Power Generation Predictions**: ML-based predictions in kilowatts (KW)
- **Fault Detection Results**: Classification of solar panel faults with confidence scores
- **Weather Visualizations**: Interactive charts and weather displays
- **Location Recommendations**: Heatmaps showing optimal solar panel placement locations
- **Interactive Maps**: Leaflet-based maps with markers for saved locations

### Core Features (Technical)
1. **Solar Power Prediction**: Uses Gradient Boost algorithm via Railway-hosted ML API
2. **Fault Detection**: CNN-based image classification for solar panel defects
3. **Weather Integration**: Real-time weather data analysis for solar optimization
4. **Location Management**: Save/delete locations with coordinates
5. **Interactive Mapping**: Leaflet.js with heatmap capabilities
6. **Speech Synthesis**: Text-to-speech for accessibility

### Dynamic vs Hardcoded
- **Dynamic**: Weather data, power predictions, fault detection, location coordinates
- **Hardcoded**: Some dashboard demo data, UI assets, sample parking information

## 🧱 SYSTEM STRUCTURE — "What tech is used where?"

### Frontend Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Charts/Visualization**: 
  - Nivo charts (@nivo/bar, @nivo/line, @nivo/pie, @nivo/geo)
  - Chart.js with react-chartjs-2
  - Recharts
- **Maps**: 
  - Leaflet with react-leaflet
  - Google Maps API (@react-google-maps/api)
  - Leaflet heatmap plugin
- **Form Handling**: Formik with Yup validation
- **HTTP Client**: Axios

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **Authentication**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests
- **Middleware**: Morgan for logging

### ML Models & External APIs
- **Power Prediction Model**: Hosted on Railway (ppgmodel-production.up.railway.app)
  - Uses Gradient Boost algorithm
  - Endpoint: `/predict/gb`
- **Fault Detection Model**: Hosted on Railway (faultdetmodel-production.up.railway.app)
  - Uses CNN (Convolutional Neural Networks)
  - Endpoint: `/predict/`
- **Weather API**: Meteomatics API (premium weather service)
- **Geocoding**: OpenCage Data API
- **Weather Icons**: OpenWeatherMap API

### External APIs
1. **Meteomatics**: Real-time weather data (requires authentication token)
2. **OpenCage Data**: Geocoding and reverse geocoding
3. **OpenWeatherMap**: Weather forecasts and icons
4. **Railway ML APIs**: Hosted machine learning models

### Database & Storage
- **MongoDB Atlas**: Cloud-hosted MongoDB
  - Collections: `organizations`, `locations`
  - Stores user accounts and saved locations
- **Session Storage**: Client-side storage for user authentication state
- **Local Storage**: Authentication persistence

## 📂 FILE STRUCTURE — "Where is everything located?"

### ML Model Integration
- **No local model files**: Models are hosted externally on Railway
- **API Integration**: Located in `CLIENT/src/helper/helper.js`
  - `fetchPrediction()`: Power generation prediction
  - `fetchFaultPrediction()`: Solar panel fault detection

### API Configuration
- **Environment Variables**: `CLIENT/.env`
  - `VITE_APP_BASE_URL=http://localhost:3500`
- **Database Connection**: `SERVER_1/server/appcontroller/dbconnection.js`
  - MongoDB Atlas connection string (hardcoded - security concern)
- **API Keys**: Hardcoded in source files (security concern)
  - Meteomatics credentials in PowerPrediction.jsx
  - OpenCage API keys in multiple files
  - OpenWeatherMap API key in Weather.jsx

### Frontend-Backend Connection
- **REST API**: Express.js server on port 3500
- **Endpoints**:
  - `/api/register` - User registration
  - `/api/login` - User authentication
  - `/api/visualizations` - Location management (GET, POST, DELETE)
- **CORS Configuration**: Allows requests from Vercel deployment and localhost

### Test Data & References
- **Sample Data**: `CLIENT/src/state/sampleParkingData.js`, `CLIENT/src/state/geoData.js`
- **No test datasets**: ML models are external services
- **No training data**: Models are pre-trained and hosted

## 🎨 VISUALS & CONTENT — "What do we need to swap or edit?"

### UI Assets & Branding
- **Logo Files**: Multiple "risun" branded assets need replacement
  - `risun.svg`, `risun-symbol.svg`, `risun-symbol-white.svg`
  - Package name in `package.json` is "risun" (should be changed)
- **Favicon**: Likely needs updating to RISUN branding
- **Weather Icons**: Uses OpenWeatherMap icons (external, no change needed)

### Content Analysis
- **README**: Appears to be original RISUN content, not boilerplate
- **No team names**: No specific developer names found in codebase
- **No hackathon references**: No explicit hackathon mentions found
- **Deployment URL**: https://risun.vercel.app (mentioned in README)

### Assets Directory Structure
```
CLIENT/src/assets/
├── risun-related files (NEEDS REPLACEMENT)
├── weather icons (sunny.svg, cloudy.svg, etc.)
├── fault/ (fault detection demo images)
├── hero/, benefits/, services/ (landing page assets)
└── Various UI icons and graphics
```

## 🧠 AI MODEL SPECIFIC

### ML Models Used
1. **Gradient Boost Algorithm**: For power generation prediction
   - Input: Weather parameters (18+ features)
   - Output: Predicted power in kilowatts
   - Hosted on Railway platform

2. **Convolutional Neural Networks (CNN)**: For fault detection
   - Input: Solar panel images
   - Output: Fault classification with confidence score
   - Includes recommendations and tips
   - Hosted on Railway platform

### Model Training & Data
- **Pre-trained Models**: Both models are already trained and deployed
- **No Training Code**: No local training scripts or notebooks found
- **No Training Data**: No datasets included in repository
- **External Hosting**: Models run on Railway's cloud infrastructure

### Model Integration
- **API Calls**: Models accessed via HTTP POST requests
- **CORS Proxy**: Uses cors-anywhere.herokuapp.com for cross-origin requests
- **Error Handling**: Basic error handling for API failures
- **Response Processing**: JSON responses with predictions and metadata

### Key Technical Details
- **Weather Features**: 18+ meteorological parameters for power prediction
- **Image Processing**: Handles various image formats for fault detection
- **Real-time Processing**: Both models provide immediate responses
- **Confidence Scores**: Fault detection includes confidence percentages
- **Recommendations**: AI provides actionable insights for detected faults

## Security Concerns Identified
1. **Hardcoded API Keys**: Multiple API keys exposed in source code
2. **Database Credentials**: MongoDB connection string in plain text
3. **CORS Proxy**: Reliance on third-party CORS proxy service
4. **No Environment Variables**: Sensitive data not properly secured

## Deployment Information
- **Frontend**: Deployed on Vercel (https://risun.vercel.app)
- **Backend**: Likely deployed separately (localhost:3500 in development)
- **ML Models**: Hosted on Railway platform
- **Database**: MongoDB Atlas (cloud-hosted)