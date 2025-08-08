import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import './Weather.css';
import InfoCard from "./InfoCard.jsx";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    console.log('Tooltip Payload:', payload);
    
    const { name, value } = payload[0].payload;
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : 'N/A';

    return (
      <div className="custom-tooltip">
        <span className="parameter-name" style={{ backgroundColor: payload[0].stroke }}>
          {name}
        </span>
        <h4 className="label">{`${formattedValue}`}</h4>
      </div>
    );
  }
  return null;
};

const WeatherCharts = ({ selectedData }) => {
  const [currentParameter, setCurrentParameter] = useState('');
  const date = new Date(selectedData[0].dt_txt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Prepare data for each chart
  const temperatureData = selectedData.map(item => ({
    time: item.dt_txt.slice(11, 16),
    value: parseFloat((item.main.temp - 273.15).toFixed(2)),
    name: 'Temperature (°C)',
  }));

  const temperatures = temperatureData.map(data => data.value);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);

  const windSpeedData = selectedData.map(item => ({
    time: item.dt_txt.slice(11, 16),
    value: item.wind.speed,
    name: 'Wind Speed (m/s)',
  }));

  const wind_speed = windSpeedData.map(data => data.value);
  const minWind = Math.min(...wind_speed);
  const maxWind = Math.max(...wind_speed);

  const humidityData = selectedData.map(item => ({
    time: item.dt_txt.slice(11, 16),
    value: item.main.humidity,
    name: 'Humidity (%)',
  }));

  const humidity = humidityData.map(data => data.value);
  const minHumidity = Math.min(...humidity);
  const maxHumidity = Math.max(...humidity);

  const pressureData = selectedData.map(item => ({
    time: item.dt_txt.slice(11, 16),
    value: item.main.pressure,
    name: 'Pressure (mb)',
  }));

  const pressure = pressureData.map(data => data.value);
  const minPressure = Math.min(...pressure);
  const maxPressure = Math.max(...pressure);


  const visibilityData = selectedData.map(item => ({
    time: item.dt_txt.slice(11, 16),
    value: item.visibility,
    name: 'Visibility (m)',
  }));

  const visibility = visibilityData.map(data => data.value);
  const minVisibility = Math.min(...visibility);
  const maxVisibility = Math.max(...visibility);


  const handleMouseEnter = (name) => {
    setCurrentParameter(name);
  };

  return (
    <div className='text-lg'>
      <h2 className="text-4xl font-bold text-center mb-3 text-yellow-100">Weather Charts At 3-Hour Time Intervals</h2>
      <p className="text-center text-xl font-bold mb-5 text-gray-300">{date}</p>
      <div className="space-y-12">

      <div className="flex items-center">
      {/* Line Chart Container */}
      <div className="w-2/3">
        <ResponsiveContainer width="100%" height={300}>
          <h3 className="my-4 font-bold">Temperature (°C)</h3>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Info Cards for different parameters */}
      <div className="w-1/4 ml-14">
        <InfoCard title="Temperature" description={`[
    Min: ${minTemp}°C - Lower temperatures boost solar panel efficiency by reducing overheating.,
    Max: ${maxTemp}°C - Higher temperatures can decrease solar panel efficiency, reducing energy output.
  ]`}/>
      </div>
    </div>



<div className="flex items-center">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height={300}>
            <h3 className="my-4 font-bold">Wind Speed (m/s)</h3>
            <LineChart data={windSpeedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#387908" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/4 ml-14">
          <InfoCard title="Wind Speed" description={`[
    Min: ${minWind}m/s - Moderate wind speed cool panels, reducing overheating and improving efficiency.,
    Max: ${maxWind}m/s - Higher wind speeds can reduce panel efficiency by increasing dust.
  ]`} />
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height={300}>
            <h3 className="my-4 font-bold">Humidity (%)</h3>
            <LineChart data={humidityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/4 ml-14">
          <InfoCard title="Humidity" description={`[
    Min: ${minHumidity}% - Low humidity levels allow more direct sunlight, improving solar panel efficiency.,
    Max: ${maxHumidity}% - High humidity can reduce solar output by increasing haze and reducing sunlight.
  ]`} />
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height={300}>
            <h3 className="my-4 font-bold">Pressure (mb)</h3>
            <LineChart data={pressureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/4 ml-14">
          <InfoCard title="Pressure" description={`[
    Min: ${minPressure}mb - low pressure typically leads to cloudier conditions, reducing sunlight and decreasing solar efficiency.,
    Max: ${maxPressure}mb - High pressure often brings clear skies, which boosts solar power output.
  ]`} />
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height={300}>
            <h3 className="my-4 font-bold">Visibility (m)</h3>
            <LineChart data={visibilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/4 ml-14">
          <InfoCard title="Visibility" description={`[
    Min: ${minVisibility}m - Low visibility, often due to fog or haze, reduces sunlight, thus lowering solar energy production.,
    Max: ${maxVisibility}m - High visibility generally indicates clear skies, allowing maximum sunlight for solar panels, enhancing power output.
  ]`} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default WeatherCharts;