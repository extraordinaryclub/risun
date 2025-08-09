// Add this temporarily to your login component to debug
console.log('Environment Variables Debug:');
console.log('VITE_REACT_APP_SERVER_DOMAIN:', import.meta.env.VITE_REACT_APP_SERVER_DOMAIN);
console.log('All env vars:', import.meta.env);
console.log('Axios baseURL:', Axios.defaults.baseURL);

// This will show in browser console what URL your frontend is trying to use