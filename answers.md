# Technical Extraction Analysis - RISUN Project

## Project Overview

RISUN is an AI-powered solar operations platform that revolutionizes solar infrastructure management through intelligent automation and real-time data analysis. The platform combines computer vision for fault detection in solar panels, machine learning algorithms for power generation prediction, comprehensive weather analytics, and interactive location management tools to help solar field engineers, utility operators, and installation companies optimize their solar installations, reduce maintenance costs, and maximize energy output through data-driven insights and predictive maintenance capabilities.

## Problem Context

### Real-World Problem
The solar energy industry faces critical operational challenges that result in significant efficiency losses and increased costs. Current solar operations rely on fragmented, manual tools that create data silos and reactive maintenance approaches.

### Pain Points Addressed
- **Fragmented Systems**: Field workers must juggle multiple disconnected systems for monitoring, diagnostics, and maintenance scheduling
- **Data Silos**: Critical performance metrics are scattered across weather services, monitoring platforms, and maintenance logs
- **Reactive Maintenance**: Issues are discovered only after significant energy loss, leading to costly downtime (15-30% efficiency loss)
- **Suboptimal Placement**: New installations lack data-driven site selection, reducing overall efficiency
- **Limited Accessibility**: Complex interfaces prevent field technicians from accessing real-time insights on-site

### Target Users
- Solar field engineers and technicians
- Utility-scale solar farm operators
- Commercial solar installation companies
- Residential solar network managers
- Renewable energy consultants
- Solar maintenance service providers

## Key Features

### 1. **AI-Powered Fault Detection**
- **Purpose**: Identify defects in solar panels through image analysis
- **Core Function**: CNN-based computer vision model with 94% accuracy
- **Implementation**: Upload panel images → AI analysis → Fault classification + recommendations

### 2. **Solar Power Prediction**
- **Purpose**: Forecast energy output using weather data and ML algorithms
- **Core Function**: Gradient Boosting model processing 18 weather parameters
- **Implementation**: Location input → Weather data fetch → ML prediction → Power output forecast

### 3. **Interactive Location Management**
- **Purpose**: Save, manage, and analyze multiple solar installation sites
- **Core Function**: Geocoding integration with coordinate storage
- **Implementation**: Location search → Coordinate resolution → Database storage → Site management

### 4. **Comprehensive Weather Analytics**
- **Purpose**: Provide detailed weather insights for solar planning
- **Core Function**: Multi-source weather data aggregation and visualization
- **Implementation**: API integration → Data processing → Interactive charts → 5-day forecasts

### 5. **Real-time Monitoring Dashboard**
- **Purpose**: Centralized view of solar performance metrics
- **Core Function**: Live data aggregation and visualization
- **Implementation**: Multiple data sources → Real-time processing → Interactive dashboard

### 6. **User Authentication System**
- **Purpose**: Secure user access and session management
- **Core Function**: JWT-based authentication with MongoDB storage
- **Implementation**: Registration/Login → Token generation → Protected routes

## Architecture

### Tech Stack

#### Frontend
- **Framework**: React 18 with Vite build system
- **Styling**: Tailwind CSS + Material-UI (MUI) components
- **State Management**: Redux Toolkit with persistent storage
- **Routing**: React Router v6 with protected routes
- **Maps**: Leaflet.js + React-Leaflet for interactive mapping
- **Charts**: Recharts, Chart.js, and Nivo for data visualization
- **Forms**: Formik with Yup validation
- **HTTP Client**: Axios for API communication
- **Notifications**: React Hot Toast for user feedback

#### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB Atlas (cloud-hosted)
- **Authentication**: JWT tokens with bcryptjs hashing
- **Middleware**: CORS, Morgan logging
- **API Architecture**: RESTful endpoints

#### AI/ML Services
- **Fault Detection**: CNN model deployed on Railway.app
- **Power Prediction**: Gradient Boosting model on Railway.app
- **Model Accuracy**: 94% fault detection, 92% power prediction

#### External APIs
- **Meteomatics**: Professional weather data (18+ parameters)
- **OpenCage**: Geocoding and reverse geocoding
- **OpenWeatherMap**: Weather forecasts and current conditions
- **OpenStreetMap**: Base map tiles

### Project Structure
```
├── CLIENT/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── scenes/         # Main application pages
│   │   ├── assets/         # Static resources
│   │   ├── constants/      # Configuration and constants
│   │   ├── helper/         # API utility functions
│   │   ├── state/          # Redux store and slices
│   │   └── store/          # Authentication state management
├── SERVER_1/server/        # Backend Node.js application
│   ├── appcontroller/      # Business logic controllers
│   ├── Router/             # API route definitions
│   └── index.js           # Server entry point
```

## Core Functionality Breakdown

### Frontend Components

#### `Hero.jsx`
- **Purpose**: Landing page hero section with animated GIF
- **Contribution**: First user interaction point, showcases platform capabilities
- **Key Features**: Parallax effects, call-to-action buttons, responsive design

#### `Fault.jsx`
- **Purpose**: Solar panel fault detection interface
- **Contribution**: Core AI functionality for defect identification
- **Process**: Image upload → FormData creation → API call → Results display with recommendations
- **Features**: Voice feedback, step-by-step UI, confidence scoring

#### `PowerPrediction.jsx`
- **Purpose**: Energy output forecasting system
- **Contribution**: Primary ML prediction functionality
- **Process**: Location input → Weather data fetch → ML model prediction → Nearby recommendations
- **Features**: 18 weather parameters, interactive maps, nearby location analysis

#### `Weather.jsx`
- **Purpose**: Comprehensive weather analytics dashboard
- **Contribution**: Weather insights for solar planning
- **Process**: Coordinate-based weather fetch → 5-day forecast → Interactive charts
- **Features**: Voice announcements, hourly breakdowns, visual weather representation

#### `Visualizations.jsx`
- **Purpose**: Location management and site selection
- **Contribution**: User's saved locations with coordinate management
- **Process**: Location search → Geocoding → Database storage → Site management
- **Features**: Autocomplete search, CRUD operations, coordinate linking

#### `Dashboard.jsx`
- **Purpose**: Main monitoring interface
- **Contribution**: Centralized performance metrics view
- **Features**: Real-time data, interactive maps, performance analytics

### Backend Structure

#### `index.js`
- **Purpose**: Express server configuration and startup
- **Contribution**: API endpoint routing and middleware setup
- **Features**: CORS configuration, Morgan logging, route mounting

#### API Controllers
- **Authentication**: User registration, login, JWT token management
- **Visualizations**: Location CRUD operations with coordinate storage
- **Data Processing**: Weather data aggregation and formatting

### Helper Functions (`helper.js`)

#### `fetchPrediction(data)`
- **Purpose**: Communicate with ML power prediction service
- **Implementation**: POST request to Railway-deployed Gradient Boosting model
- **Input**: Weather parameter object (18 fields)
- **Output**: Predicted power generation in KW

#### `fetchFaultPrediction(formData)`
- **Purpose**: Communicate with CNN fault detection service
- **Implementation**: POST request to Railway-deployed CNN model
- **Input**: FormData with solar panel image
- **Output**: Fault classification, confidence score, recommendations

#### `AddLocation/GetUserLocations/DeleteLocation`
- **Purpose**: Location management CRUD operations
- **Implementation**: RESTful API calls with user authentication
- **Features**: Email-based user association, coordinate storage

## Integration Points

### External API Integrations

#### Meteomatics Weather API
- **Implementation**: CORS proxy + Bearer token authentication
- **Endpoints**: Real-time weather data, cloud cover, solar radiation
- **Data Format**: JSON with coordinate-based parameters
- **Usage**: Power prediction model input, weather analytics

#### OpenCage Geocoding API
- **Implementation**: Direct HTTP requests with API key
- **Endpoints**: Forward/reverse geocoding, location suggestions
- **Data Format**: JSON with formatted addresses and coordinates
- **Usage**: Location search, coordinate resolution, address formatting

#### OpenWeatherMap API
- **Implementation**: Direct API calls with API key
- **Endpoints**: 5-day weather forecast, current conditions
- **Data Format**: JSON with weather objects and icons
- **Usage**: Weather dashboard, forecast visualization

#### Railway.app ML Services
- **Implementation**: CORS-proxied requests to deployed models
- **Services**: CNN fault detection, Gradient Boosting prediction
- **Data Format**: FormData (images), JSON (weather parameters)
- **Usage**: Core AI functionality for fault detection and power prediction

### Database Integration
- **MongoDB Atlas**: Cloud-hosted document database
- **Collections**: Users, Locations, Sessions
- **Authentication**: Connection string with credentials
- **Operations**: User management, location storage, session handling

## Input & Output

### Input Types

#### User Interface Inputs
- **Location Search**: Text input with autocomplete suggestions
- **Image Upload**: Solar panel images (JPEG, PNG formats)
- **Form Data**: User registration/login credentials
- **Map Interactions**: Click events, marker selections
- **Navigation**: Route changes, menu selections

#### API Inputs
- **Weather Parameters**: 18-field object with meteorological data
```javascript
{
  temperature_2_m_above_gnd: number,
  relative_humidity_2_m_above_gnd: number,
  wind_speed_10_m_above_gnd: number,
  // ... 15 more parameters
}
```
- **Image Data**: FormData with uploaded solar panel images
- **Location Data**: Coordinates, formatted addresses, user associations

### Output Types

#### User Interface Outputs
- **Interactive Dashboards**: Real-time charts, maps, performance metrics
- **Prediction Results**: Power generation forecasts with confidence intervals
- **Fault Analysis**: Defect classification with maintenance recommendations
- **Weather Visualizations**: 5-day forecasts, hourly breakdowns, interactive charts
- **Location Management**: Saved sites list, coordinate displays, deletion confirmations

#### API Responses
- **Power Predictions**: JSON with predicted_power field (KW)
- **Fault Detection**: JSON with fault type, confidence score, recommendations array
- **Weather Data**: Structured meteorological parameters
- **Location Operations**: Success/error messages, coordinate confirmations

#### Voice Outputs
- **Text-to-Speech**: Weather announcements, prediction results, user feedback
- **Accessibility**: Audio descriptions for visual elements

## Processing Logic

### Main Algorithms

#### Power Prediction Workflow
1. **Location Input Processing**: Geocoding API call → coordinate resolution
2. **Weather Data Aggregation**: Multiple API calls to Meteomatics and OpenWeatherMap
3. **Parameter Normalization**: 18 weather parameters formatted for ML model
4. **ML Model Inference**: Gradient Boosting algorithm processes weather data
5. **Nearby Analysis**: Surrounding coordinates analyzed for better recommendations
6. **Result Presentation**: Power output displayed with nearby alternatives

#### Fault Detection Pipeline
1. **Image Preprocessing**: Client-side image validation and FormData creation
2. **CNN Model Processing**: Uploaded image analyzed by trained neural network
3. **Classification Output**: Fault type determined with confidence scoring
4. **Recommendation Engine**: Maintenance suggestions based on fault classification
5. **Voice Feedback**: Text-to-speech announcement of results

#### Weather Analytics Processing
1. **Multi-Source Data Fetch**: Parallel API calls to weather services
2. **Data Harmonization**: Different API formats normalized to common structure
3. **Temporal Analysis**: 5-day forecast broken into hourly segments
4. **Visualization Preparation**: Data formatted for chart libraries
5. **Interactive Features**: Click handlers for detailed day views

### Unique Optimizations

#### Real-Time Data Caching
- **Implementation**: Session storage for weather data to reduce API calls
- **Strategy**: 15-minute cache expiration for real-time accuracy
- **Benefit**: Improved performance and reduced API costs

#### Parallel Processing
- **Weather Data**: Multiple API endpoints called simultaneously
- **Nearby Locations**: Concurrent coordinate processing for recommendations
- **Benefit**: Reduced total processing time from 10+ seconds to <3 seconds

#### Progressive Enhancement
- **Voice Features**: Text-to-speech as accessibility enhancement
- **Offline Capability**: Local storage for critical user data
- **Responsive Design**: Mobile-first approach with desktop enhancements

## Deployment

### Current Deployment Strategy

#### Frontend Deployment (Vercel)
- **Platform**: Vercel with automatic GitHub integration
- **Build Process**: Vite production build with optimization
- **Domain**: risun.vercel.app with custom domain support
- **Features**: Automatic deployments, preview branches, edge caching

#### Backend Deployment (Vercel)
- **Platform**: Vercel with GitHub integration
- **URL**: risun-backend.vercel.app
- **Configuration**: Node.js serverless functions
- **Database**: MongoDB Atlas cloud connection
- **Features**: Automatic deployments, environment variable management

#### ML Model Deployment (Railway)
- **Services**: Separate Railway deployments for each model
- **Endpoints**: 
  - Fault Detection: `faultdetmodel-production.up.railway.app`
  - Power Prediction: `ppgmodel-production.up.railway.app`
- **Features**: Auto-scaling, health monitoring, CORS configuration

### Environment Configuration

#### Frontend Environment Variables
```env
VITE_REACT_APP_SERVER_DOMAIN=http://localhost:3500
```

#### Backend Environment Variables
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
PORT=3500
```

#### API Keys Required
- Meteomatics API token (weather data)
- OpenCage API key (geocoding)
- OpenWeatherMap API key (weather forecasts)

### Local Development Setup
```bash
# Frontend
cd CLIENT
npm install
npm run dev  # Runs on localhost:5173

# Backend
cd SERVER_1/server
npm install
npm run dev  # Runs on localhost:3500
```

### Dependencies
- **Node.js**: Version 18+ required
- **MongoDB**: Atlas cloud connection or local instance
- **API Access**: Valid keys for all external services
- **CORS Proxy**: cors-anywhere.herokuapp.com for API calls

## Scalability & Limitations

### Scalability Strengths

#### Cloud-Native Architecture
- **Serverless Deployment**: Automatic scaling on Vercel and Railway
- **Database Scaling**: MongoDB Atlas handles connection pooling and scaling
- **CDN Distribution**: Global edge caching for optimal performance
- **Microservices**: ML models deployed as separate scalable services

#### Modular Design
- **Component Architecture**: React components can be independently optimized
- **API Separation**: Backend services can scale independently
- **State Management**: Redux enables efficient data flow at scale
- **Caching Strategy**: Multiple levels of caching reduce server load

#### Performance Optimizations
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Automatic compression and format conversion
- **Bundle Splitting**: Code splitting for faster initial loads
- **API Batching**: Multiple requests combined where possible

### Current Limitations

#### API Dependencies
- **Rate Limits**: External APIs have usage restrictions
- **Single Points of Failure**: Dependency on third-party services
- **Cost Scaling**: API costs increase with user growth
- **Latency**: Multiple API calls can impact response times

#### Data Storage
- **User Data**: Limited to basic location and authentication information
- **Historical Data**: No long-term storage of weather or prediction data
- **Analytics**: Limited user behavior tracking and analysis
- **Backup Strategy**: Relies on MongoDB Atlas backup systems

#### Processing Limitations
- **ML Model Updates**: Models are static and require manual redeployment
- **Concurrent Users**: No load testing performed for high concurrent usage
- **Real-Time Features**: Limited real-time updates (no WebSocket implementation)
- **Mobile Performance**: Heavy JavaScript bundle may impact mobile performance

#### Security Considerations
- **API Key Exposure**: Some API keys visible in client-side code
- **CORS Proxy**: Dependency on third-party CORS proxy service
- **Input Validation**: Limited server-side validation for uploaded images
- **Rate Limiting**: No built-in rate limiting for API endpoints

### Known Issues
- **CORS Proxy Dependency**: Reliance on cors-anywhere.herokuapp.com may cause availability issues
- **Image Upload Size**: No file size limits implemented for fault detection uploads
- **Session Management**: JWT tokens stored in localStorage (security consideration)
- **Error Handling**: Limited error recovery mechanisms for API failures
- **Browser Compatibility**: Modern browser features may not work on older browsers

### Improvement Opportunities
- **Caching Layer**: Implement Redis for improved performance
- **WebSocket Integration**: Real-time updates for monitoring dashboard
- **Mobile App**: Native mobile applications for field technicians
- **Advanced Analytics**: User behavior tracking and performance metrics
- **Automated Testing**: Comprehensive test suite for reliability
- **Documentation**: API documentation and developer guides