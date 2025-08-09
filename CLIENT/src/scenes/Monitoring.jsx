import React, { useState, useRef , useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; 
import "./Monitoring.css";
import { AddLocation, DeleteLocation, GetUserLocations } from "@/helper/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMap, faList } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-heatmap/leaflet-heatmap.js";

const Monitoring = () => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "heatmap"
  const [weatherData, setWeatherData] = useState([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const textareaRef = useRef(null);
  const mapRef = useRef(null);

   // Fetch saved locations on component mount
   useEffect(() => {
    const fetchSavedLocations = async () => {
        try {
            const response = await GetUserLocations(); // Fetch locations from database
            setSavedLocations(response); // Assuming response is an array of locations
        } catch (error) {
            console.error("Error fetching saved locations:", error);
            toast.error("Failed to load saved locations");
        }
    };

    fetchSavedLocations();
}, []); // Empty dependency array means this runs once on mount

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [location]);

  const handleDeleteClick = (location_name) => {
    setLocationToDelete(location_name); 
    setIsModalOpen(true); 
  };

  const confirmDeleteLocation = async () => {
    try {
      await DeleteLocation(locationToDelete);
      // Remove the deleted location from the savedLocations state
      setSavedLocations((prevLocations) =>
        prevLocations.filter((loc) => loc.location_name !== locationToDelete)
      );
      announceTTS(`${locationToDelete} has been deleted.`);
      toast.success(`${locationToDelete} deleted successfully`);
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    } finally {
      setIsModalOpen(false);
    }
  };

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
              key: "e36ee096b00e40ee8877456620bf3d66", 
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

  const handleAddLocation = async () => {
    if (!location) {
      toast.error("Please enter a location");
      return;
    }

    // Fetch coordinates from your API based on the selected location
    const coordinates = await fetchCoordinates(location);
    console.log(coordinates);
    
    if (coordinates) {
        const { lat, lng } = coordinates;

        try {
            // Add the location with coordinates
            await AddLocation(location, lat, lng);

            // Add the new location to the savedLocations list directly with lat and lng
            setSavedLocations(prevLocations => [
                ...prevLocations,
                {
                    id: new Date().getTime(), // Temporary unique ID if not returned from AddLocation
                    location_name: location,
                    latitude: lat,
                    longitude: lng,
                }
            ]);

            announceTTS(`${location} has been added.`);
            toast.success(`${location} added successfully`);
            setLocation(""); // Clear the input after adding
        } catch (error) {
            console.error("Error adding location:", error);
            toast.error("Failed to add location. Please try again.");
        }
    } else {
        toast.error("Failed to fetch coordinates. Please try again.");
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setLocation(suggestion.formatted);
    setSuggestions([]);
    adjustTextareaHeight();

    await fetchCoordinates(suggestion.formatted);
  };

  // Updated fetchCoordinates to return coordinates
  const fetchCoordinates = async (location_name) => {
    try {
      const response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            key: "e36ee096b00e40ee8877456620bf3d66", 
            q: location_name,
            limit: 1,
          },
        }
      );

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        console.log("Latitude:", lat, "Longitude:", lng);
        return { lat, lng }; // Return coordinates
      } else {
        console.error("No results found for the location.");
        return null; // Return null if no results
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null; // Return null on error
    }
  };

  const announceTTS = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  // Calculate solar suitability score based on multiple factors
  const calculateSolarSuitability = (weatherData) => {
    const {
      temperature,
      humidity,
      windSpeed,
      cloudiness,
      latitude
    } = weatherData;

    let score = 0;
    let factors = [];

    // Temperature factor (optimal range 15-25°C)
    if (temperature >= 15 && temperature <= 25) {
      score += 25;
      factors.push("Optimal temperature");
    } else if (temperature >= 10 && temperature <= 30) {
      score += 20;
      factors.push("Good temperature");
    } else if (temperature >= 5 && temperature <= 35) {
      score += 15;
      factors.push("Acceptable temperature");
    } else {
      score += 5;
      factors.push("Suboptimal temperature");
    }

    // Cloudiness factor (less clouds = better)
    if (cloudiness <= 20) {
      score += 30;
      factors.push("Excellent sun exposure");
    } else if (cloudiness <= 40) {
      score += 25;
      factors.push("Good sun exposure");
    } else if (cloudiness <= 60) {
      score += 15;
      factors.push("Moderate sun exposure");
    } else {
      score += 5;
      factors.push("Limited sun exposure");
    }

    // Humidity factor (lower humidity = better for panels)
    if (humidity <= 40) {
      score += 15;
      factors.push("Low humidity");
    } else if (humidity <= 60) {
      score += 12;
      factors.push("Moderate humidity");
    } else if (humidity <= 80) {
      score += 8;
      factors.push("High humidity");
    } else {
      score += 3;
      factors.push("Very high humidity");
    }

    // Wind factor (moderate wind helps cooling)
    if (windSpeed >= 2 && windSpeed <= 6) {
      score += 15;
      factors.push("Optimal wind for cooling");
    } else if (windSpeed >= 1 && windSpeed <= 8) {
      score += 12;
      factors.push("Good wind conditions");
    } else if (windSpeed < 1) {
      score += 5;
      factors.push("Low wind (less cooling)");
    } else {
      score += 8;
      factors.push("High wind (potential damage risk)");
    }

    // Latitude factor (closer to equator generally better, but depends on region)
    const absLatitude = Math.abs(latitude);
    if (absLatitude <= 30) {
      score += 15;
      factors.push("Excellent latitude for solar");
    } else if (absLatitude <= 45) {
      score += 12;
      factors.push("Good latitude for solar");
    } else if (absLatitude <= 60) {
      score += 8;
      factors.push("Moderate latitude for solar");
    } else {
      score += 3;
      factors.push("Challenging latitude for solar");
    }

    // Normalize score to 0-100
    const normalizedScore = Math.min(100, score);
    
    return {
      score: normalizedScore,
      factors,
      rating: normalizedScore >= 80 ? "Excellent" : 
              normalizedScore >= 65 ? "Very Good" :
              normalizedScore >= 50 ? "Good" :
              normalizedScore >= 35 ? "Fair" : "Poor"
    };
  };

  // Fetch weather data and calculate solar suitability
  const fetchWeatherForAllLocations = async () => {
    if (savedLocations.length === 0) {
      toast.error("No locations to fetch weather data for");
      return;
    }

    setIsLoadingWeather(true);
    const API_KEY = "642979f5ee631edab3c8bb7dbbffaa6d";
    const weatherPromises = savedLocations.map(async (location) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`
        );
        
        const weatherData = {
          ...location,
          weather: response.data,
          temperature: response.data.main.temp - 273.15,
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          cloudiness: response.data.clouds.all,
        };

        // Calculate solar suitability
        const suitability = calculateSolarSuitability(weatherData);
        
        return {
          ...weatherData,
          solarSuitability: suitability
        };
      } catch (error) {
        console.error(`Error fetching weather for ${location.location_name}:`, error);
        return {
          ...location,
          weather: null,
          temperature: null,
          humidity: null,
          windSpeed: null,
          cloudiness: null,
          solarSuitability: { score: 0, factors: [], rating: "Unknown" }
        };
      }
    });

    try {
      const weatherResults = await Promise.all(weatherPromises);
      setWeatherData(weatherResults);
      toast.success("Solar suitability analysis complete!");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Failed to load solar suitability data");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Switch to heatmap view and fetch weather data
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === "heatmap" && weatherData.length === 0) {
      fetchWeatherForAllLocations();
    }
  };

  // Custom marker icons for solar suitability scores
  const getSolarSuitabilityIcon = (suitability) => {
    const score = suitability.score;
    let color = '#6b7280'; // Default gray
    let textColor = 'white';
    
    if (score >= 80) {
      color = '#10b981'; // Excellent - Green
    } else if (score >= 65) {
      color = '#84cc16'; // Very Good - Light Green
    } else if (score >= 50) {
      color = '#eab308'; // Good - Yellow
      textColor = 'black';
    } else if (score >= 35) {
      color = '#f97316'; // Fair - Orange
    } else {
      color = '#ef4444'; // Poor - Red
    }

    return L.divIcon({
      className: 'custom-solar-marker',
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        color: ${textColor};
        flex-direction: column;
      ">
        <div style="font-size: 9px; line-height: 1;">☀️</div>
        <div style="font-size: 8px; line-height: 1;">${Math.round(score)}</div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  return (
    <div className="power-prediction">
      {/* View Mode Toggle */}
      <div className="view-toggle-container mb-6">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleViewModeChange("list")}
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faList} className="mr-2" />
            List View
          </button>
          <button
            onClick={() => handleViewModeChange("heatmap")}
            className={`view-toggle-btn ${viewMode === "heatmap" ? "active" : ""}`}
            disabled={savedLocations.length === 0}
          >
            <FontAwesomeIcon icon={faMap} className="mr-2" />
            Heatmap View
          </button>
        </div>
        {savedLocations.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-2">
            Add locations to enable heatmap view
          </p>
        )}
      </div>

      {viewMode === "list" && (
        <>
          <div>
            <h2 className="font-bold my-2 text-2xl text-custom-7">Enter Your Location: </h2>
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
            <button className="generate-button mx-auto text-center flex justify-center items-center bg-amber-600 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded mb-3.5 text-base" onClick={handleAddLocation}>
              Add Location
            </button>
          </div>
          <div className="power-prediction">
            <h3 className="text-neutral-800 font-bold my-3 text-3xl pt-px">Saved Locations:</h3>
            {savedLocations.length === 0 ? (
              <p className="text-gray-500 text-lg">No locations saved yet. Add a location to start monitoring weather data.</p>
            ) : (
              <ul className="locations-list">
                {savedLocations.map((loc) => (
                  <li key={loc.id} className="location-item flex justify-between items-center py-2 px-4 mb-3 border rounded-md shadow-sm">
                    <span className="location-name text-lg font-medium">
                      <Link 
                        to={`/location/${loc.id}?lat=${loc.latitude}&lng=${loc.longitude}`}
                        className="hover:text-yellow-600 hover:underline"
                        onClick={() => fetchCoordinates(loc.location_name)}
                      >
                        {loc.location_name}
                      </Link>
                    </span>
                    <button 
                      className="delete-button flex justify-center items-center bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-2 rounded-full"
                      onClick={() => handleDeleteClick(loc.location_name)}
                      title="Delete location"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-lg" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {viewMode === "heatmap" && (
        <div className="heatmap-container">
          <div className="heatmap-header mb-4">
            <h2 className="font-bold text-2xl text-custom-7 mb-2">☀️ Solar Suitability Heatmap</h2>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Analyze the best locations for solar panel installation based on weather conditions and environmental factors
              </p>
              <button
                onClick={fetchWeatherForAllLocations}
                disabled={isLoadingWeather || savedLocations.length === 0}
                className="refresh-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoadingWeather ? "Analyzing..." : "Analyze Locations"}
              </button>
            </div>
          </div>

          {savedLocations.length === 0 ? (
            <div className="no-locations-message text-center py-12">
              <FontAwesomeIcon icon={faMap} className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Locations Added</h3>
              <p className="text-gray-500">Switch to List View to add locations for heatmap visualization</p>
            </div>
          ) : (
            <>
              {/* Solar Suitability Legend */}
              <div className="temperature-legend mb-4 p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">☀️ Solar Suitability Score</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">90</div>
                    <span className="text-sm">Excellent (80-100)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center text-white text-xs font-bold">75</div>
                    <span className="text-sm">Very Good (65-79)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">60</div>
                    <span className="text-sm">Good (50-64)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">45</div>
                    <span className="text-sm">Fair (35-49)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">25</div>
                    <span className="text-sm">Poor (0-34)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Scores based on temperature, sun exposure, humidity, wind conditions, and latitude
                </p>
              </div>

              {/* Map Container */}
              <div className="map-container bg-white rounded-lg shadow-lg overflow-hidden">
                {weatherData.length > 0 ? (
                  <MapContainer
                    center={[weatherData[0].latitude, weatherData[0].longitude]}
                    zoom={6}
                    ref={mapRef}
                    style={{ height: "500px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {weatherData.map((locationData, index) => (
                      locationData.solarSuitability && (
                        <Marker
                          key={index}
                          position={[locationData.latitude, locationData.longitude]}
                          icon={getSolarSuitabilityIcon(locationData.solarSuitability)}
                        >
                          <Popup>
                            <div className="weather-popup">
                              <h3 className="font-bold text-lg mb-2">☀️ {locationData.location_name}</h3>
                              
                              {/* Solar Suitability Score */}
                              <div className="mb-3 p-2 bg-gray-50 rounded">
                                <div className="flex items-center justify-between mb-1">
                                  <strong>Solar Suitability:</strong>
                                  <span className={`font-bold text-lg ${
                                    locationData.solarSuitability.score >= 80 ? 'text-green-600' :
                                    locationData.solarSuitability.score >= 65 ? 'text-lime-600' :
                                    locationData.solarSuitability.score >= 50 ? 'text-yellow-600' :
                                    locationData.solarSuitability.score >= 35 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    {Math.round(locationData.solarSuitability.score)}/100
                                  </span>
                                </div>
                                <div className="text-sm font-medium">
                                  Rating: {locationData.solarSuitability.rating}
                                </div>
                              </div>

                              {/* Weather Details */}
                              <div className="weather-details mb-3">
                                <p><strong>Temperature:</strong> {Math.round(locationData.temperature)}°C</p>
                                <p><strong>Sun Exposure:</strong> {100 - locationData.cloudiness}% clear</p>
                                <p><strong>Humidity:</strong> {locationData.humidity}%</p>
                                <p><strong>Wind Speed:</strong> {locationData.windSpeed} m/s</p>
                              </div>

                              {/* Suitability Factors */}
                              <div className="mb-3">
                                <strong className="text-sm">Key Factors:</strong>
                                <ul className="text-xs mt-1 space-y-1">
                                  {locationData.solarSuitability.factors.slice(0, 3).map((factor, idx) => (
                                    <li key={idx} className="text-gray-600">• {factor}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mt-2 flex gap-2">
                                <Link 
                                  to={`/location/${locationData.id}?lat=${locationData.latitude}&lng=${locationData.longitude}`}
                                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                  View Detailed Weather →
                                </Link>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    ))}
                  </MapContainer>
                ) : (
                  <div className="map-placeholder flex items-center justify-center h-96 bg-gray-100">
                    {isLoadingWeather ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading weather data...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FontAwesomeIcon icon={faMap} className="text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-600">Click "Refresh Data" to load weather information</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Solar Suitability Summary Cards */}
              {weatherData.length > 0 && (
                <div className="weather-summary mt-6">
                  <h3 className="font-bold text-xl mb-4">☀️ Solar Installation Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weatherData.map((locationData, index) => (
                      locationData.solarSuitability && (
                        <div key={index} className="weather-card bg-white p-4 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{locationData.location_name}</h4>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                              locationData.solarSuitability.score >= 80 ? 'bg-green-100 text-green-800' :
                              locationData.solarSuitability.score >= 65 ? 'bg-lime-100 text-lime-800' :
                              locationData.solarSuitability.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                              locationData.solarSuitability.score >= 35 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {Math.round(locationData.solarSuitability.score)}/100
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className={`text-lg font-bold mb-1 ${
                              locationData.solarSuitability.score >= 80 ? 'text-green-600' :
                              locationData.solarSuitability.score >= 65 ? 'text-lime-600' :
                              locationData.solarSuitability.score >= 50 ? 'text-yellow-600' :
                              locationData.solarSuitability.score >= 35 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {locationData.solarSuitability.rating}
                            </div>
                            <div className="text-sm text-gray-600">
                              {locationData.solarSuitability.score >= 80 ? '🟢 Highly recommended for solar installation' :
                               locationData.solarSuitability.score >= 65 ? '🟡 Very good location for solar panels' :
                               locationData.solarSuitability.score >= 50 ? '🟠 Good potential with some considerations' :
                               locationData.solarSuitability.score >= 35 ? '🔶 Fair location, may need optimization' : '🔴 Not ideal for solar installation'}
                            </div>
                          </div>

                          <div className="weather-info space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Sun Exposure:</span>
                              <span className="font-medium">{100 - locationData.cloudiness}% clear</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Temperature:</span>
                              <span className="font-medium">{Math.round(locationData.temperature)}°C</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Conditions:</span>
                              <span className="font-medium">{locationData.weather?.weather[0]?.description}</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500">
                              <strong>Key factors:</strong> {locationData.solarSuitability.factors.slice(0, 2).join(', ')}
                            </div>
                          </div>

                          <div className="mt-3">
                            <Link 
                              to={`/location/${locationData.id}?lat=${locationData.latitude}&lng=${locationData.longitude}`}
                              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                            >
                              View Detailed Analysis →
                            </Link>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

{/* Modal */}
{isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p><strong>Are you sure you want to delete {locationToDelete}?</strong></p>
            <div className="flex gap-4 mt-4">
            <button onClick={confirmDeleteLocation} className="flex-initial confirm-button generate-button text-center flex justify-center items-center bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
              Yes, Delete
            </button>
            <button onClick={() => setIsModalOpen(false)} className="flex-initial generate-button text-center flex justify-center items-center bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Monitoring;

