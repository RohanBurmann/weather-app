import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment-timezone';
import './weather.css'; // Import the external stylesheet

const WeatherIcon = ({ icon }) => {
  const baseUrl = 'http://openweathermap.org/img/wn/';
  const size = '@2x';
  const extension = '.png';
  const iconUrl = `${baseUrl}${icon}${size}${extension}`;

  return <img src={iconUrl} alt="Weather Icon" />;
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('London'); // Default location
  const [timezone, setTimezone] = useState(null); // Add timezone state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=6917cc17b50462f572aaf55fd5ab64d1&units=metric`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, [location]); // Re-fetch data when location changes

  useEffect(() => {
    const fetchTimezone = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=6917cc17b50462f572aaf55fd5ab64d1`
        );
        console.log("Timezone response:", response); // Log response to check if timezone data is fetched
        setTimezone(response.data.timezone);
      } catch (error) {
        console.error("Error fetching timezone:", error);
      }
    };

    fetchTimezone();
  }, [location]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const currentHour = new Date().getHours();
  const next4HoursData = weatherData.list.filter((hour) => {
    if (!hour) return false; // Check if hour is undefined or null
    const hourOfForecast = moment.unix(hour.dt).tz(`Europe/${timezone}`).hour(); // Adjust the timezone based on location
    return hourOfForecast >= currentHour && hourOfForecast < currentHour + 4;
  });

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <div>
      <h1 style={{ textTransform: 'capitalize' }}>{location} Hourly Weather Forecast for the Next 4 Hours</h1>
      <input type="text" value={location} onChange={handleLocationChange} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {next4HoursData.map((hour, index) => (
          <div key={index} style={{ display: 'inline-block', width: '24%', margin: '1%'}}>
            <div className="WeatherBlock"> {}
              <p style={{ margin: 0 }}>{moment.unix(hour.dt).tz(`Europe/${timezone}`).format('HH:mm')}</p>
              <WeatherIcon icon={hour.weather[0].icon} />
              <p style={{ margin: 0 }}>{Math.round(hour.main.temp)}°C</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
