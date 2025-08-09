import Axios from "axios";
Axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_SERVER_DOMAIN;


export async function SignUp(credentials) {
  try {
    const { data: { msg } } = await Axios.post('/api/register', credentials);
    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function loginUser(credentials) {
  try {
    const { data } = await Axios.post('/api/login', credentials);
    
    // Store user info in sessionStorage
    console.log(data.user.organizationName);
    sessionStorage.setItem('email', data.user.email);
    sessionStorage.setItem('organizationName', data.user.organizationName);
    
    // Return the user data to set it in Redux
    return data.user;
  } catch (error) {
    return Promise.reject({ error: error.response.data.error });
  }
}

// Function to fetch prediction data
export async function fetchPrediction(data) {
  try {
    const response = await Axios.post('https://cors-anywhere.herokuapp.com/https://ppgmodel-production.up.railway.app/predict/gb', data);
    console.log(response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject({ error: error.response.data.error });
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
    const response = await fetch(
      "https://cors-anywhere.herokuapp.com/https://faultdetmodel-production.up.railway.app/predict/",
      {
        // Replace with your ngrok URL
        method: "POST",
        body: formData,
        
      }
    );

    if (!response.ok) {
      // Throw an error with the status code for better debugging
      throw new Error(`Server responded with status ${response.status}`);
    }

    // Parse the JSON response from the server
    return await response.json();
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
};