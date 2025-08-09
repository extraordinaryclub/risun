import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { themeSettings } from "./theme";

// Import components
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import PropTypes from "prop-types";

// Import dashboard components
import Layout from "./scenes/Layout";
import UserManual from "./scenes/UserManual";
import Admin from "./scenes/Admin";
// import Weather from "./scenes/PowerPrediction";
// import CO2Emission from "./scenes/CO2Emission";
// import TrafficFlowMap from "./scenes/Heatmap";
// import WaterUsage from "./scenes/Fault";
// import EnergyConsumption from "./scenes/EnergyConsumption";
// import ParkingAvailability from "./scenes/ParkingAvailability";
// import UserManual from "./scenes/UserManual";
import Monitoring from "./scenes/Monitoring";
import PowerPredictionSimple from "./scenes/PowerPredictionSimple";
import Fault from "./scenes/Fault";
import Faq from "./components/Faq"

import Login from "./components/Login/login";
import Register from "./components/SignUp/register";
import Visualizations from "./scenes/Visualizations";
import WeatherDetails from "./scenes/Weather";
import {Navigate} from "react-router-dom";
import { useLocation } from "react-router-dom";



// Landing page component
const LandingPage = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Faq />
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

const ProtectedRoute = ({ element, redirectPath = "/login" }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthenticatedFromStorage = localStorage.getItem("isAuthenticated") === "true";
  console.log(isAuthenticatedFromStorage);
  
  const isUserAuthenticated = isAuthenticated || isAuthenticatedFromStorage;

  console.log("isUserAuthenticated:", isUserAuthenticated); // Log to debug

  if (!isUserAuthenticated) {
    // Store the current path before redirecting
    localStorage.setItem("redirectPath", window.location.pathname);
    return <Navigate to={redirectPath} />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired, // Validate that element is a React element
  redirectPath: PropTypes.string,
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/loginpage",
    element: <Login />,
  },
  {
    path: "/registerpage",
    element: <Register />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <ProtectedRoute element={<UserManual />} />,
      },
      {
        path: "/monitoring",
        element: <ProtectedRoute element={<Monitoring />} />,
      },
      {
        path: "/powerprediction",
        element: <ProtectedRoute element={<PowerPredictionSimple />} />,
      },
      {
        path: "/fault",
        element: <ProtectedRoute element={<Fault />} />,
      },
      {
        path: "/admin",
        element: <ProtectedRoute element={<Admin />} />,
      },

      {
        path: "/location/:id",
        element: <ProtectedRoute element={<WeatherDetails />} />,
      },
    ],
  },
  {
    path: "*", // Catch all unmatched routes
    element: <Navigate to="/" />, // Redirect to landing page for unmatched routes
  },
]);
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

