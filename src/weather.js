import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import "./weather.css"; // Import the external stylesheet

const WeatherIcon = ({ icon }) => {
  const baseUrl = "http://openweathermap.org/img/wn/";
  const size = "@2x";
  const extension = ".png";
  const iconUrl = `${baseUrl}${icon}${size}${extension}`;

  return <img src={iconUrl} alt="Weather Icon" />;
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("London"); // Default location
  const [timezoneOffset, setTimezoneOffset] = useState(null); // Add timezone offset state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            location
          )}&appid=6917cc17b50462f572aaf55fd5ab64d1&units=metric`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, [location, timezoneOffset]); // Re-fetch data when location or timezoneOffset changes

  useEffect(() => {
    const fetchTimezoneOffset = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            location
          )}&appid=6917cc17b50462f572aaf55fd5ab64d1`
        );
        console.log("Timezone response:", response); // Log response to check if timezone data is fetched
        setTimezoneOffset(response.data.timezone / 3600); // Convert seconds to hours
      } catch (error) {
        console.error("Error fetching timezone offset:", error);
      }
    };

    fetchTimezoneOffset();
  }, [location]);

  if (!weatherData || timezoneOffset === null) {
    return <div>Loading...</div>;
  }

  const currentHour = new Date().getHours();
  const next4HoursData = weatherData.list.filter((hour, index) => {
    if (!hour) return false; // Check if hour is undefined or null
    const hourOfForecast = moment
      .unix(hour.dt)
      .utcOffset(timezoneOffset * 60)
      .hour(); // Adjust the timezone based on location
    return hourOfForecast >= currentHour && index < 4; // Filter for the next 4 hours
  });

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <div>
      <h1 style={{ textTransform: "capitalize" }}>
        {location} Hourly Weather Forecast
      </h1>
      <input type="text" value={location} onChange={handleLocationChange} />
      <div className="forecast-container">
        {next4HoursData.map((hour, index) => (
          <div
            key={index}
            className="forecast-box"
          >
            <p>{moment.unix(hour.dt).format("HH:mm")}</p>
            <WeatherIcon icon={hour.weather[0].icon} />
            <p>{Math.round(hour.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
