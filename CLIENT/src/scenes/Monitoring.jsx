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

  // Fetch weather data for all saved locations
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
        return {
          ...location,
          weather: response.data,
          temperature: response.data.main.temp - 273.15, // Convert to Celsius
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          cloudiness: response.data.clouds.all,
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
        };
      }
    });

    try {
      const weatherResults = await Promise.all(weatherPromises);
      setWeatherData(weatherResults);
      toast.success("Weather data loaded for heatmap");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Failed to load weather data");
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

  // Custom marker icons for different temperature ranges
  const getTemperatureIcon = (temp) => {
    let color = '#3388ff'; // Default blue
    if (temp > 30) color = '#ff4444'; // Hot - Red
    else if (temp > 20) color = '#ff8800'; // Warm - Orange
    else if (temp > 10) color = '#ffdd00'; // Mild - Yellow
    else if (temp > 0) color = '#88ff88'; // Cool - Light Green
    else color = '#4488ff'; // Cold - Blue

    return L.divIcon({
      className: 'custom-temp-marker',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
      ">${Math.round(temp)}°</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
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
        </div>
      )}

      {viewMode === "heatmap" && (
        <div className="heatmap-container">
          <div className="heatmap-header mb-4">
            <h2 className="font-bold text-2xl text-custom-7 mb-2">Weather Heatmap</h2>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Visual representation of weather conditions across your monitored locations
              </p>
              <button
                onClick={fetchWeatherForAllLocations}
                disabled={isLoadingWeather || savedLocations.length === 0}
                className="refresh-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoadingWeather ? "Loading..." : "Refresh Data"}
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
              {/* Temperature Legend */}
              <div className="temperature-legend mb-4 p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Temperature Scale (°C)</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Cold (&lt; 0°)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    <span className="text-sm">Cool (0-10°)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                    <span className="text-sm">Mild (10-20°)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Warm (20-30°)</span>
                  </div>
                  <div className="legend-item flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm">Hot (&gt; 30°)</span>
                  </div>
                </div>
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
                      locationData.temperature !== null && (
                        <Marker
                          key={index}
                          position={[locationData.latitude, locationData.longitude]}
                          icon={getTemperatureIcon(locationData.temperature)}
                        >
                          <Popup>
                            <div className="weather-popup">
                              <h3 className="font-bold text-lg mb-2">{locationData.location_name}</h3>
                              <div className="weather-details">
                                <p><strong>Temperature:</strong> {Math.round(locationData.temperature)}°C</p>
                                <p><strong>Humidity:</strong> {locationData.humidity}%</p>
                                <p><strong>Wind Speed:</strong> {locationData.windSpeed} m/s</p>
                                <p><strong>Cloudiness:</strong> {locationData.cloudiness}%</p>
                                <p><strong>Conditions:</strong> {locationData.weather?.weather[0]?.description}</p>
                              </div>
                              <div className="mt-2">
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

              {/* Weather Summary Cards */}
              {weatherData.length > 0 && (
                <div className="weather-summary mt-6">
                  <h3 className="font-bold text-xl mb-4">Weather Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weatherData.map((locationData, index) => (
                      locationData.temperature !== null && (
                        <div key={index} className="weather-card bg-white p-4 rounded-lg shadow-sm border">
                          <h4 className="font-semibold text-lg mb-2">{locationData.location_name}</h4>
                          <div className="weather-info">
                            <div className="flex items-center justify-between mb-2">
                              <span>Temperature:</span>
                              <span className="font-bold text-lg">{Math.round(locationData.temperature)}°C</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span>Solar Conditions:</span>
                              <span className={`font-medium ${locationData.cloudiness < 30 ? 'text-green-600' : locationData.cloudiness < 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {locationData.cloudiness < 30 ? 'Excellent' : locationData.cloudiness < 70 ? 'Good' : 'Poor'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Humidity: {locationData.humidity}% | Wind: {locationData.windSpeed} m/s
                            </div>
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

