import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import "./PowerPrediction.css";
import { fetchPrediction } from "@/helper/helper";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Import the heatmap layer
import "leaflet-heatmap/leaflet-heatmap.js";
import "leaflet/dist/leaflet.css";
// import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
import humid from "../assets/humidity2.webp";
import rain from "../assets/rain.jpg";
import wind from "../assets/wind.png";
import windg from "../assets/windGust.jpg";
import snow from "../assets/snow.jpeg";

const PowerPrediction = () => {
  const [location, setLocation] = useState("");
  const [higherPowerLocations, setHigherPowerLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]); 
  const [nearbyLocationsData, setNearbyLocationsData] = useState([]);
  const [isDataReadyToShow, setIsDataReadyToShow] = useState(false); 
  const [NearbypredictionData, setNearbypredictionData] = useState(null);
  const [nearbyalocations, setnearbyalocations] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const mapRef = useRef();

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };


  const fetchToken = async () => {
    // For demo purposes, we'll use a mock token
    // In production, you'd want to implement proper authentication
    setAccessToken("demo_token");
    console.log("Demo token set for testing");
  };

  useEffect(() => {
    fetchToken(); 
    const intervalId = setInterval(fetchToken, 2 * 60 * 60 * 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLocation(value);
    adjustTextareaHeight();

    if (value.length > 2) {
      try {
        const response = await axios.get(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              key: "84b677d039834de193924351d730c68a",
              q: value,
              limit: 5,
            },
          }
        );
        setSuggestions(response.data.results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setLocation(suggestion.formatted);
    setSuggestions([]);
    adjustTextareaHeight();

    const lat = suggestion.geometry.lat;
    const lon = suggestion.geometry.lng;

    await fetchWeatherData(lat, lon);

    nearbyalocations.length = 0; 
    const nearbyCoords = [
      { lat: lat + 0.0005, lon: lon + 0.0005 },
      { lat: lat + 0.0005, lon: lon - 0.0005 },
      { lat: lat - 0.0005, lon: lon + 0.0005 },
      { lat: lat - 0.0005, lon: lon - 0.0005 },
      { lat: lat, lon: lon + 0.0003 },
      // { lat: lat, lon: lon - 0.0003 }
    ];

    for (const coord of nearbyCoords) {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              q: `${coord.lat},${coord.lon}`,
              key: "84b677d039834de193924351d730c68a",
            },
          }
        );

        const location =
          response.data.results[0]?.formatted || `${coord.lat}, ${coord.lon}`;
        nearbyalocations.push({
          lat: coord.lat,
          lon: coord.lon,
          location,
        });
      } catch (error) {
        console.error("Error in reverse geocoding:", error);
        nearbyalocations.push({
          lat: coord.lat,
          lon: coord.lon,
          location: `${coord.lat}, ${coord.lon}`,
        });
      }
    }

    setNearbyLocations(nearbyCoords);
    console.log(nearbyalocations);
  };

  const fetchWeatherData = async (lat, lon) => {
    const localTime = new Date();
    const date = localTime.toISOString().split("T")[0];

    let currentHour = localTime.getHours();
    if (currentHour < 10) {
      currentHour = '0' + currentHour; // Prepend '0' for single-digit hours
    } else {
      currentHour = currentHour.toString(); // Keep as is for two-digit hours
    }
    console.log(currentHour);

    try {
      const meteomaticsResponse = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${currentHour}:00:00Z/t_2m:C,relative_humidity_20m:p,msl_pressure:hPa,precip_3h:mm,fresh_snow_3h:cm,global_rad_mean_3h:W,wind_speed_10m:ms,wind_dir_10m:d,wind_speed_80m:ms,wind_dir_80m:d/${lat},${lon}/json`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = meteomaticsResponse.data;
      console.log(data);
      console.log(accessToken);

      const windGustResponse = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${
          currentHour
        }:00:00Z/wind_gusts_10m_3h:ms,sun_elevation:d,sun_azimuth:d/${lat},${lon}/json`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data2 = windGustResponse.data;
      const wind_url = `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${
        currentHour}:00:00Z/wind_gusts_10m_3h:ms,sun_azimuth:d,sun_elevation:d/${lat},${lon}/json`;
      console.log(wind_url);
      console.log(data2);

      if (data && data.data && data2 && data2.data) {
        let temperatureValue = 0;
        let humidityValue = 0;
        let pressureValue = 0;
        let precipValue = 0;
        let snowValue = 0;
        let radValue = 0;
        let windSpeed = 0;
        let windDir = 0;
        let ws_80 = 0;
        let wd_80 = 0;
        let wg_10 = 0;
        let i_angle = 0;
        let azimuth_angle = 0;

        data.data.forEach((parameter) => {
          if (parameter.parameter === "t_2m:C") {
            temperatureValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "relative_humidity_20m:p") {
            humidityValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "msl_pressure:hPa") {
            pressureValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "precip_3h:mm") {
            precipValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "fresh_snow_3h:cm") {
            snowValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "global_rad_mean_3h:W") {
            radValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_speed_10m:ms") {
            windSpeed = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_dir_10m:d") {
            windDir = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_speed_80m:ms") {
            ws_80 = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_dir_80m:d") {
            wd_80 = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_gusts_10m_3h:ms") {
            wg_10 = parameter.coordinates[0].dates[0].value;
          }
        });

        data2.data.forEach((parameter2) => {
          if (parameter2.parameter === "wind_gusts_10m_3h:ms") {
            wg_10 = parameter2.coordinates[0].dates[0].value;
          } else if (parameter2.parameter === "sun_elevation:d") {
            i_angle = Math.abs(parameter2.coordinates[0].dates[0].value);
          } else if (parameter2.parameter === "sun_azimuth:d") {
            azimuth_angle = parameter2.coordinates[0].dates[0].value;
            console.log(azimuth_angle);
          }
        });

        let zenith_angle = 90 - i_angle;

        const predictionData = {
          temperature_2_m_above_gnd: temperatureValue || 0,
          relative_humidity_2_m_above_gnd: humidityValue || 0,
          mean_sea_level_pressure_MSL: pressureValue || 0,
          total_precipitation_sfc: precipValue || 0,
          snowfall_amount_sfc: snowValue || 0,
          total_cloud_cover_sfc: 0,
          high_cloud_cover_high_cld_lay: 0,
          medium_cloud_cover_mid_cld_lay: 0,
          low_cloud_cover_low_cld_lay: 0,
          shortwave_radiation_backwards_sfc: radValue || 0,
          wind_speed_10_m_above_gnd: windSpeed,
          wind_direction_10_m_above_gnd: windDir,
          wind_speed_80_m_above_gnd: ws_80 || 0,
          wind_direction_80_m_above_gnd: wd_80 || 0,
          wind_gust_10_m_above_gnd: wg_10 || 0,
          angle_of_incidence: i_angle,
          zenith: zenith_angle,
          azimuth: azimuth_angle || 0,
        };

        console.log(predictionData);
        console.log(azimuth_angle);
        console.log(data2);
        console.log(data);
        setPredictionData(predictionData);

        const cloudCoverResponse = await axios.get(
          `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${currentHour}:00:00Z/high_cloud_cover_mean_2h:p,medium_cloud_cover_mean_2h:p,low_cloud_cover_mean_2h:p,total_cloud_cover_mean_2h:p/${lat},${lon}/csv`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        let csvData = cloudCoverResponse.data.trim();

        console.log("Raw CSV Data:", csvData);

        Papa.parse(csvData, {
          header: true,
          delimiter: ";",
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("Parsing Errors:", results.errors);
              return;
            }

            if (results.data.length > 0) {
              const lastRow = results.data[results.data.length - 1];

              const highCloud =
                parseInt(lastRow["high_cloud_cover_mean_2h:p"]) || 0;
              const mediumCloud =
                parseInt(lastRow["medium_cloud_cover_mean_2h:p"]) || 0;
              const lowCloud =
                parseInt(lastRow["low_cloud_cover_mean_2h:p"]) || 0;
              const totalCloud =
                parseInt(lastRow["total_cloud_cover_mean_2h:p"]) || 0;

              const updatedPredictionData = {
                ...predictionData,
                high_cloud_cover_high_cld_lay: highCloud,
                medium_cloud_cover_mid_cld_lay: mediumCloud,
                low_cloud_cover_low_cld_lay: lowCloud,
                total_cloud_cover_sfc: totalCloud,
              };
               
              return updatedPredictionData;
            }
          },
          error: (error) => {
            console.error("Parsing error:", error);
          },
        });

        return predictionData; 
      } else {
        console.error("Invalid weather data received");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchNearbyWeatherData = async (lat, lon) => {
    const localTime = new Date();
    const date = localTime.toISOString().split("T")[0];
    let currentHour = localTime.getHours();
    if (currentHour < 10) {
      currentHour = '0' + currentHour; // Prepend '0' for single-digit hours
    } else {
      currentHour = currentHour.toString(); // Keep as is for two-digit hours
    }
    console.log(currentHour);
    try {
      const meteomaticsResponse = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${currentHour}:00:00Z/t_2m:C,relative_humidity_20m:p,msl_pressure:hPa,precip_3h:mm,fresh_snow_3h:cm,global_rad_mean_3h:W,wind_speed_10m:ms,wind_dir_10m:d,wind_speed_80m:ms,wind_dir_80m:d/${lat},${lon}/json`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = meteomaticsResponse.data;
      console.log(data);
      console.log(accessToken);

      const windGustResponse = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${currentHour}:00:00Z/wind_gusts_10m_3h:ms,sun_elevation:d,sun_azimuth:d/${lat},${lon}/json`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data2 = windGustResponse.data;
      const wind_url = `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${currentHour}:00:00Z/wind_gusts_10m_3h:ms,sun_azimuth:d,sun_elevation:d/${lat},${lon}/json`;
      console.log(wind_url);
      console.log(data2);

      if (data && data.data && data2 && data2.data) {
        let temperatureValue = 0;
        let humidityValue = 0;
        let pressureValue = 0;
        let precipValue = 0;
        let snowValue = 0;
        let radValue = 0;
        let windSpeed = 0;
        let windDir = 0;
        let ws_80 = 0;
        let wd_80 = 0;
        let wg_10 = 0;
        let i_angle = 0;
        let azimuth_angle = 0;

        data.data.forEach((parameter) => {
          if (parameter.parameter === "t_2m:C") {
            temperatureValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "relative_humidity_20m:p") {
            humidityValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "msl_pressure:hPa") {
            pressureValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "precip_3h:mm") {
            precipValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "fresh_snow_3h:cm") {
            snowValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "global_rad_mean_3h:W") {
            radValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_speed_10m:ms") {
            windSpeed = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_dir_10m:d") {
            windDir = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_speed_80m:ms") {
            ws_80 = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_dir_80m:d") {
            wd_80 = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_gusts_10m_3h:ms") {
            wg_10 = parameter.coordinates[0].dates[0].value;
          }
        });

        data2.data.forEach((parameter2) => {
          if (parameter2.parameter === "wind_gusts_10m_3h:ms") {
            wg_10 = parameter2.coordinates[0].dates[0].value;
          } else if (parameter2.parameter === "sun_elevation:d") {
            i_angle = Math.abs(parameter2.coordinates[0].dates[0].value);
          } else if (parameter2.parameter === "sun_azimuth:d") {
            azimuth_angle = parameter2.coordinates[0].dates[0].value;
            console.log(azimuth_angle);
          }
        });

        let zenith_angle = 90 - i_angle;

        const NearbypredictionData = {
          temperature_2_m_above_gnd: temperatureValue || 0,
          relative_humidity_2_m_above_gnd: humidityValue || 0,
          mean_sea_level_pressure_MSL: pressureValue || 0,
          total_precipitation_sfc: precipValue || 0,
          snowfall_amount_sfc: snowValue || 0,
          total_cloud_cover_sfc: 0,
          high_cloud_cover_high_cld_lay: 0,
          medium_cloud_cover_mid_cld_lay: 0,
          low_cloud_cover_low_cld_lay: 0,
          shortwave_radiation_backwards_sfc: radValue || 0,
          wind_speed_10_m_above_gnd: windSpeed,
          wind_direction_10_m_above_gnd: windDir,
          wind_speed_80_m_above_gnd: ws_80 || 0,
          wind_direction_80_m_above_gnd: wd_80 || 0,
          wind_gust_10_m_above_gnd: wg_10 || 0,
          angle_of_incidence: i_angle,
          zenith: zenith_angle,
          azimuth: azimuth_angle || 0,
        };

        console.log(predictionData);
        console.log(azimuth_angle);
        console.log(data2);
        console.log(data);
        setNearbypredictionData(NearbypredictionData);

        const cloudCoverResponse = await axios.get(
          `https://cors-anywhere.herokuapp.com/https://api.meteomatics.com/${date}T${currentHour}:00:00Z/high_cloud_cover_mean_2h:p,medium_cloud_cover_mean_2h:p,low_cloud_cover_mean_2h:p,total_cloud_cover_mean_2h:p/${lat},${lon}/csv`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        let csvData = cloudCoverResponse.data.trim();

        console.log("Raw CSV Data:", csvData);

        Papa.parse(csvData, {
          header: true,
          delimiter: ";",
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("Parsing Errors:", results.errors);
              return;
            }

            if (results.data.length > 0) {
              const lastRow = results.data[results.data.length - 1];

              const highCloud =
                parseInt(lastRow["high_cloud_cover_mean_2h:p"]) || 0;
              const mediumCloud =
                parseInt(lastRow["medium_cloud_cover_mean_2h:p"]) || 0;
              const lowCloud =
                parseInt(lastRow["low_cloud_cover_mean_2h:p"]) || 0;
              const totalCloud =
                parseInt(lastRow["total_cloud_cover_mean_2h:p"]) || 0;

              const updatedNearbyPredictionData = {
                ...predictionData,
                high_cloud_cover_high_cld_lay: highCloud,
                medium_cloud_cover_mid_cld_lay: mediumCloud,
                low_cloud_cover_low_cld_lay: lowCloud,
                total_cloud_cover_sfc: totalCloud,
              };

              return updatedNearbyPredictionData;
            }
          },
          error: (error) => {
            console.error("Parsing error:", error);
          },
        });

        return NearbypredictionData; 
      } else {
        console.error("Invalid weather data received");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const handleGenerateRecommendations = async () => {
    const fetchedNearbyLocationsData = [];
    setIsLoading(true);

    for (const location of nearbyLocations) {
      const lat = location.lat;
      const lon = location.lon;

      const data = await fetchNearbyWeatherData(lat, lon);

      if (data) {
        fetchedNearbyLocationsData.push({ ...data });
      }
    }


    setNearbyLocationsData(fetchedNearbyLocationsData);
    
    console.log(
      "Fetched data for nearby locations:",
      fetchedNearbyLocationsData
    );

    setIsLoading(false);
  };

  const speakMessage = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-Speech not supported in this browser.");
    }
  };

  const handleGeneratePrediction = async () => {
    try {
      console.log(predictionData);
      const response = await fetchPrediction(predictionData);
      setPrediction(response);
      setShowPrediction(true);
      speakMessage(`Power prediction is ${response.predicted_power} kilowatts`);
    } catch (error) {
      console.error("Error generating prediction:", error);
    }
  };

  const handleGenerateNearbyPrediction = async () => {
    try {
      const nearbyPredictionData = [];
      const higherPowerLocs = []; 

      const userLocationPredictedPower = prediction?.predicted_power || 0;
      console.log("User Location Predicted Power:", userLocationPredictedPower);

      for (let i = 0; i < nearbyLocationsData.length; i++) {
        const locationData = nearbyLocationsData[i];

        const predictionResponse = await fetchPrediction(locationData);
        nearbyPredictionData.push(predictionResponse);

        if (predictionResponse.predicted_power >= userLocationPredictedPower) {
          const correspondingLocation = nearbyalocations[i];
          higherPowerLocs.push({
            ...predictionResponse,
            latitude: correspondingLocation.lat,
            longitude: correspondingLocation.lon,
            location: correspondingLocation.location,
          });
        }
      }

      setNearbypredictionData(nearbyPredictionData);
      setHigherPowerLocations(higherPowerLocs); 
      console.log("Locations with higher power generation:", higherPowerLocs);
      setIsDataReadyToShow(true);

      updateMapMarkers(higherPowerLocs);
      speakMessage("Nearby potential power recommendations are generated.");
    } catch (error) {
      console.error("Error generating nearby predictions:", error);
    }
  };

  const updateMapMarkers = (locations) => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });
  
      if (locations.length > 0) {
        const firstLocation = locations[0];
        mapRef.current.setView(
          [firstLocation.latitude, firstLocation.longitude],
          70
        );
  
        locations.forEach(({ latitude, longitude, location }) => {
          const marker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: "custom-marker",
              html: `
                <div class="custom-marker">
                  <span class="marker-icon">${location[0]}</span> <!-- Display first letter of location -->
                </div>
              `,
              iconSize: [40, 40], // Adjust size as necessary
              iconAnchor: [20, 20], // Center the icon
            }),
          }).addTo(mapRef.current);
          
          marker.bindPopup(location);
        });
      }
    }
  };
  
  return (
    <>
    <h1 className="text-amber-600 text-center font-extrabold text-4xl mb-3">Power Generation Prediction</h1>
      <div className="w-[100%] power-prediction"
      style={{
        width: "80% !important",
      }}>
        <h2 className="font-bold my-2 text-3xl">Enter Your Location</h2>
        <textarea
          ref={textareaRef}
          placeholder="Type your location"
          value={location}
          onChange={handleInputChange}
          className="autocomplete-input"
          rows={1}
          style={{
            resize: "none",
            overflow: "hidden",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.formatted}
              </li>
            ))}
          </ul>
        )}
        <h3 className="text-amber-600 font-bold my-3 text-3xl">
          Weather Data:{" "}
        </h3>
        {predictionData && (
          <div className="prediction-data grid">
            <div
              className="temp1 relative h-56 w-full bg-cover bg-center filter brightness-75 contrast-75 rounded-xl transform transition-transform duration-500 ease-out hover:scale-105 hover:brightness-100"
              style={{
                backgroundImage:
                  "url('https://media.istockphoto.com/id/1323823418/photo/low-angle-view-thermometer-on-blue-sky-with-sun-shining.jpg?s=612x612&w=0&k=20&c=LwLCGF902C-DNwKgCMCR12zFnB4g1INWzlk1JPOidRk=')",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h4 className="text-xl font-semibold">Temperature</h4>
                <p className="text-2xl font-bold mt-2">
                  {predictionData.temperature_2_m_above_gnd.toFixed(2)} °C
                </p>
              </div>
            </div>

            <div
              className="humid1 relative h-56 w-full bg-cover bg-center filter brightness-75 contrast-75 rounded-xl transform transition-transform duration-500 ease-out hover:scale-105 hover:brightness-100"
              style={{ backgroundImage: `url(${humid})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h4 className="text-xl font-semibold">Relative Humidity</h4>
                <p className="text-2xl font-bold mt-2">
                  {predictionData.relative_humidity_2_m_above_gnd.toFixed(2)} %
                </p>
              </div>
            </div>

            <div
              className="winds1 relative h-56 w-full bg-cover bg-center filter brightness-75 contrast-75 rounded-xl transform transition-transform duration-500 ease-out hover:scale-105 hover:brightness-100"
              style={{ backgroundImage: `url(${wind})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h4 className="text-xl font-semibold">Wind Speed (10m)</h4>
                <p className="text-2xl font-bold mt-2">
                  {predictionData.wind_speed_10_m_above_gnd.toFixed(2)} m/s
                </p>
              </div>
            </div>

            <div
              className="windg1 relative h-56 w-full bg-cover bg-center filter brightness-75 contrast-75 rounded-xl transform transition-transform duration-500 ease-out hover:scale-105 hover:brightness-100"
              style={{ backgroundImage: `url(${windg}) ` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h4 className="text-xl font-semibold">Wind Gust (10m)</h4>
                <p className="text-2xl font-bold mt-2">
                  {predictionData.wind_gust_10_m_above_gnd.toFixed(2)} m/s
                </p>
              </div>
            </div>

            <div
              className="precip1 relative h-56 w-full bg-cover bg-center filter brightness-75 contrast-75 rounded-xl transform transition-transform duration-500 ease-out hover:scale-105 hover:brightness-100"
              style={{ backgroundImage: `url(${rain})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h4 className="text-xl font-semibold">Precipitation</h4>
                <p className="text-2xl font-bold mt-2">
                  {predictionData.total_precipitation_sfc.toFixed(2)} %
                </p>
              </div>
            </div>

            <div
              className="snow1 relative h-56 w-full bg-cover bg-center filter brightness-75 contrast-75 rounded-xl transform transition-transform duration-500 ease-out hover:scale-105 hover:brightness-100"
              style={{ backgroundImage: `url(${snow})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h4 className="text-xl font-semibold">Snow</h4>
                <p className="text-2xl font-bold mt-2">
                  {predictionData.snowfall_amount_sfc.toFixed(2)} mm
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleGeneratePrediction}
          className="generate-button mx-auto text-center flex justify-center items-center bg-amber-600 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded transition-transform duration-300 ease-out transform hover:scale-105 hover:shadow-lg"
        >
          Generate Power Prediction
        </button>

        {showPrediction && prediction && (
          <span>
            <strong className="prediction-label prediction-text">
              Predicted Power:
            </strong>
            <div className="prediction-container">
              <span className="prediction-text">
                <strong>{prediction.predicted_power} KW</strong>
              </span>
            </div>
          </span>
        )}
      </div>
      <div className="heatmap_recs font-extrabold text-white mx-auto text-3xl my-6 flex justify-center items-center">
        <h1 className="text-amber-600 text-center font-extrabold text-4xl">Nearby Recommendations</h1>
        <br />
      </div>
      <div className="flex flex-col items-center">
  <h2 className="text-xl font-bold mt-4">Weather Data Actions</h2>
  <p className="text-sm text-gray-600 mt-2">Use the below steps to generate nearby potential power recommendations based on the entered location.</p>

  <div className="flex space-x-4 mt-4">
    <div className="relative">
      <button
        disabled={isLoading}
        onClick={handleGenerateRecommendations}
        className={`generate-button flex justify-center items-center py-2 px-4 rounded ${isLoading ? 'bg-gray-400' : 'bg-amber-600 hover:bg-amber-800 mb-4 transition-transform duration-300 ease-out transform hover:scale-105 hover:shadow-lg'} text-white font-bold`}
      >
        {isLoading ? <span className="spinner visible"></span> : null}
        {isLoading ? "Loading..." : "Fetch Nearby Weather Data"}
      </button>
      <span className="tooltip">Fetches weather data for all nearby locations.</span>
    </div>

    <div className="relative">
      <button
        onClick={handleGenerateNearbyPrediction}
        className="generate-button bg-amber-600 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded mb-4 transition-transform duration-300 ease-out transform hover:scale-105 hover:shadow-lg"
      >
        Generate Nearby Recommendations
      </button>
      <span className="tooltip">Sends weather data to ML API for power prediction and returns high-power areas.</span>
    </div>
  </div>

  {isDataReadyToShow && higherPowerLocations.length > 0 && (
    <div className="mt-4 w-[80%] rounded-md bg-white p-4 flex items-center justify-center text-gray-500 font-bold">
      <h3 className="text-lg font-extrabold">Fetched Nearby Locations:</h3>
      <ul className="list-disc ml-5">
        {higherPowerLocations.map((loc, index) => (
          <li key={index}>
            {loc.location} - Predicted Power: {higherPowerLocations[index]?.predicted_power || 'N/A'} kW
          </li>
        ))}
  
      </ul>
    </div>
  )}
   
   {isDataReadyToShow && higherPowerLocations.length==0 && showPrediction && prediction && <p className="bg-white text-red-500 shadow-xl px-5 py-10 font-extrabold rounded-md">No nearby locations with potential power found. The current location with the predicted power {prediction.predicted_power} kW is recommended.</p>}

    <MapContainer
      className="flex items-center justify-center mt-6 mb-6"
      center={[51.505, -0.09]} 
      zoom={13}
      ref={mapRef}
      style={{ height: "500px", width: "80%", border: "1px solid #ccc", borderRadius: "5px", marginBottom: "20px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Add markers for higher power locations */}
      {higherPowerLocations.map((location, index) => (
        <Marker key={index} position={[location.latitude, location.longitude]}>
          <Popup>
            {location.location} - Power: {location.predicted_power} kW
          </Popup>
        </Marker>
      ))}
    </MapContainer>

</div>

    </>
  );
};

export default PowerPrediction;
