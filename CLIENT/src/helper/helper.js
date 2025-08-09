import Axios from "axios";
Axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_SERVER_DOMAIN;


export async function SignUp(credentials) {
  try {
    console.log('🔍 REGISTER DEBUG - Making request to:', Axios.defaults.baseURL + '/api/register');
    console.log('🔍 REGISTER DEBUG - Credentials:', credentials);
    
    const { data: { msg } } = await Axios.post('/api/register', credentials);
    
    console.log('✅ REGISTER DEBUG - Success response:', msg);
    return Promise.resolve(msg);
  } catch (error) {
    console.error('❌ REGISTER DEBUG - Error:', error);
    console.error('❌ REGISTER DEBUG - Error response:', JSON.stringify(error.response?.data, null, 2));
    console.error('❌ REGISTER DEBUG - Error status:', error.response?.status);
    console.error('❌ REGISTER DEBUG - Full error response:', error.response);
    
    return Promise.reject({ error: error.response?.data || error.message || 'Registration failed' });
  }
}

export async function loginUser(credentials) {
  try {
    console.log('🔍 LOGIN DEBUG - Making request to:', Axios.defaults.baseURL + '/api/login');
    console.log('🔍 LOGIN DEBUG - Credentials:', credentials);
    
    const { data } = await Axios.post('/api/login', credentials);
    
    console.log('✅ LOGIN DEBUG - Success response:', data);
    
    // Store user info in sessionStorage
    sessionStorage.setItem('email', data.user.email);
    sessionStorage.setItem('organizationName', data.user.organizationName);
    
    // Return the user data to set it in Redux
    return data.user;
  } catch (error) {
    console.error('❌ LOGIN DEBUG - Error:', error);
    console.error('❌ LOGIN DEBUG - Error response:', error.response?.data);
    console.error('❌ LOGIN DEBUG - Error status:', error.response?.status);
    
    if (error.response?.data?.error) {
      return Promise.reject({ error: error.response.data.error });
    } else {
      return Promise.reject({ error: error.message || 'Login failed' });
    }
  }
}

// Function to fetch prediction data
export async function fetchPrediction(data) {
  try {
    console.log('🔍 PREDICTION DEBUG - Making request to ML service');
    console.log('🔍 PREDICTION DEBUG - Data:', data);
    
    const response = await Axios.post('https://ppgmodel-production.up.railway.app/predict/gb', data);
    console.log('✅ PREDICTION DEBUG - Success:', response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error('❌ PREDICTION DEBUG - Error:', error);
    console.error('❌ PREDICTION DEBUG - Status:', error.response?.status);
    console.error('❌ PREDICTION DEBUG - Response:', error.response?.data);
    return Promise.reject({ error: error.response?.data?.error || error.message || 'Prediction failed' });
  }
}

export async function AddLocation(location_name, latitude, longitude) {
  try {
    // Get email from sessionStorage
    const user = sessionStorage.getItem("email");
console.log(user);
    // Make the API call with email, location_name, lat, and lng
    const { data: { msg } } = await Axios.post('/api/visualizations', {
      email: user,
      location_name: location_name,
       latitude: latitude,
      longitude: longitude,// Send longitude
    });
    console.log("Adding location with:", {
      email: user,
      location_name,
      latitude,
      longitude,
  });
      return Promise.resolve(msg);
  } catch (error) {
    console.error("Error in AddLocation helper:", error);
    return Promise.reject({ error: error.message || "An error occurred" });
  }
}



export async function GetUserLocations() {
  try {
    const user = sessionStorage.getItem("email"); // Retrieve user object from session storage
    if (!user ) {
      throw new Error("User data or email is missing in session storage.");
    }

    // Send GET request to the server with the user's email in the headers
    const { data } = await Axios.get('/api/visualizations', {
      headers: { "User-Email": user }, // Send email in headers for authorization
    });

    // Log the fetched locations for debugging (optional)
    console.log("Fetched locations:", data.locations);

    // Ensure that the response contains the expected structure
    if (!data.locations || !Array.isArray(data.locations)) {
      throw new Error("Invalid data format received from the server.");
    }

    return data.locations; // Return the array of location objects, each containing { id, location_name }
  } catch (error) {
    console.error("Error fetching user locations:", error.message || error);
    throw error; // Propagate the error for further handling
  }
}



export async function DeleteLocation(location_name) {
  try {
      const user = sessionStorage.getItem("email");
      if (!user ) {
          console.log("User data or email is missing in session storage.");
          throw new Error("User data or email is missing in session storage.");
      }

      // Make sure to include the email in the headers and location_name in the URL
      const { data: { msg } } = await Axios.delete(`/api/visualizations?location_name=${encodeURIComponent(location_name)}`, {
          headers: {
              "user-email": user,
          }
      });

      return Promise.resolve(msg); // Return the success message
  } catch (error) {
      console.error("Error in deleteLocation helper:", error.message || error);
      return Promise.reject({ error: error.message || "An error occurred" });
  }
}

export const fetchFaultPrediction = async (formData) => {
  try {
    console.log('🔍 FAULT DETECTION DEBUG - Making request to ML service');
    console.log('🔍 FAULT DETECTION DEBUG - FormData:', formData);
    
    const url = import.meta.env.VITE_FAULT_API_URL || "https://faultdetmodel-production.up.railway.app/predict/";
    console.log('🔍 FAULT DETECTION DEBUG - Using URL:', url);
    
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    console.log('🔍 FAULT DETECTION DEBUG - Response status:', response.status);

    if (!response.ok) {
      console.error('❌ FAULT DETECTION DEBUG - HTTP Error:', response.status, response.statusText);
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ FAULT DETECTION DEBUG - Success:', result);
    return result;
  } catch (error) {
    console.error("❌ FAULT DETECTION DEBUG - Error:", error);
    throw error;
  }
};