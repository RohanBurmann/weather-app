import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather?q=London&appid=6917cc17b50462f572aaf55fd5ab64d1&units=metric');
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, []);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Weather Forecast</h1>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Feels Like: {weatherData.main.feels_like}°C</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Weather: {weatherData.weather[0].description}</p>
    </div>
  );
};

export default Weather;
