import React, { useState, useRef } from "react";
import axios from "axios";
import "./PowerPrediction.css";

const PowerPredictionSimple = () => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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

    await fetchSimpleWeatherData(lat, lon);
  };

  const fetchSimpleWeatherData = async (lat, lon) => {
    setIsLoading(true);
    try {
      // Using OpenWeatherMap API (free tier)
      const API_KEY = "642979f5ee631edab3c8bb7dbbffaa6d";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const data = response.data;
      
      // Calculate solar potential based on weather conditions
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const cloudiness = data.clouds.all;
      const windSpeed = data.wind.speed;
      
      // Simple solar calculation
      const sunlightFactor = (100 - cloudiness) / 100; // Less clouds = more sun
      const temperatureFactor = Math.max(0.5, 1 - Math.abs(temperature - 25) / 50); // Optimal around 25°C
      const basePower = 5; // Base 5kW system
      
      const predictedPower = (basePower * sunlightFactor * temperatureFactor).toFixed(2);

      setWeatherData({
        temperature,
        humidity,
        cloudiness,
        windSpeed,
        description: data.weather[0].description,
        location: data.name
      });

      setPrediction({
        predicted_power: predictedPower,
        efficiency: (sunlightFactor * temperatureFactor * 100).toFixed(1)
      });

    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Fallback demo data
      setWeatherData({
        temperature: 22,
        humidity: 65,
        cloudiness: 30,
        windSpeed: 3.5,
        description: "partly cloudy",
        location: "Demo Location"
      });
      setPrediction({
        predicted_power: "4.2",
        efficiency: "84.0"
      });
    }
    setIsLoading(false);
  };

  const speakMessage = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGeneratePrediction = () => {
    if (prediction) {
      speakMessage(`Solar power prediction for ${location} is ${prediction.predicted_power} kilowatts with ${prediction.efficiency} percent efficiency`);
    }
  };

  return (
    <div className="power-prediction">
      <h1 className="text-amber-600 text-center font-extrabold text-4xl mb-6">
        Solar Power Forecast
      </h1>
      
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="font-bold my-4 text-2xl text-gray-800">Enter Your Location</h2>
        
        <textarea
          ref={textareaRef}
          placeholder="Type your location (e.g., Los Angeles, CA)"
          value={location}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-lg resize-none"
          rows={1}
        />
        
        {suggestions.length > 0 && (
          <ul className="suggestions-list bg-white border border-gray-300 rounded-lg mt-2 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              >
                {suggestion.formatted}
              </li>
            ))}
          </ul>
        )}

        {isLoading && (
          <div className="text-center my-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <p className="mt-2 text-gray-600">Fetching weather data...</p>
          </div>
        )}

        {weatherData && (
          <div className="my-8">
            <h3 className="text-amber-600 font-bold text-2xl mb-4">Current Weather Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-2">Temperature</h4>
                <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
                <p className="text-sm opacity-90 mt-1">{weatherData.description}</p>
              </div>

              <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-2">Humidity</h4>
                <p className="text-3xl font-bold">{weatherData.humidity}%</p>
                <p className="text-sm opacity-90 mt-1">Relative humidity</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-2">Cloud Cover</h4>
                <p className="text-3xl font-bold">{weatherData.cloudiness}%</p>
                <p className="text-sm opacity-90 mt-1">Sky coverage</p>
              </div>

              <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-2">Wind Speed</h4>
                <p className="text-3xl font-bold">{weatherData.windSpeed} m/s</p>
                <p className="text-sm opacity-90 mt-1">Current wind</p>
              </div>

              {prediction && (
                <>
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                    <h4 className="text-lg font-semibold mb-2">Solar Power</h4>
                    <p className="text-3xl font-bold">{prediction.predicted_power} kW</p>
                    <p className="text-sm opacity-90 mt-1">Predicted output</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
                    <h4 className="text-lg font-semibold mb-2">Efficiency</h4>
                    <p className="text-3xl font-bold">{prediction.efficiency}%</p>
                    <p className="text-sm opacity-90 mt-1">System efficiency</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {prediction && (
          <div className="text-center my-8">
            <button
              onClick={handleGeneratePrediction}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🔊 Announce Prediction
            </button>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-500">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Solar Analysis Summary</h3>
              <p className="text-gray-700">
                Based on current weather conditions in <strong>{weatherData.location}</strong>, 
                your solar panels could generate approximately <strong>{prediction.predicted_power} kW</strong> 
                of power with an efficiency rating of <strong>{prediction.efficiency}%</strong>.
              </p>
              <div className="mt-4 text-sm text-gray-600">
                <p>• Temperature: {weatherData.temperature}°C (optimal range: 15-25°C)</p>
                <p>• Cloud cover: {weatherData.cloudiness}% (lower is better)</p>
                <p>• Weather: {weatherData.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerPredictionSimple;