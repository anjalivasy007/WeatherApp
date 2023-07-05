import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import "./weather.css";
import { FaCloudSunRain } from "react-icons/fa";
import { BiMessageError } from "react-icons/bi";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [error, setError] = useState(false);

  const API_KEY = "4120eafd2f3ae37a0931a9d73d6984ac";

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const getWeatherData = () => {
    if (!city) {
      console.error("Please enter a city name.");
      return;
    }

    setError(false);

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized request. Please check your API key.");
        } else {
          console.error("Error fetching weather data:", error.message);
        }
        setWeatherData(null);
        setError(true);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        setForecastData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error.message);
        setForecastData(null);
      });
  };

  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
      case "01d":
        return <WiDaySunny />;
      case "01n":
        return <WiDaySunny />;
      case "02d":
        return <WiCloudy />;
      case "02n":
        return <WiCloudy />;
      case "03d":
      case "03n":
        return <WiCloudy />;
      case "04d":
      case "04n":
        return <WiCloudy />;
      case "09d":
      case "09n":
        return <WiRain />;
      case "10d":
      case "10n":
        return <WiRain />;
      case "11d":
      case "11n":
        return <WiThunderstorm />;
      case "13d":
      case "13n":
        return <WiSnow />;
      case "50d":
      case "50n":
        return <WiFog />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      setCurrentDate(formattedDate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const filterUniqueDates = (data) => {
    if (!data || data.length === 0) return [];
    const uniqueDates = [];
    data.map((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!uniqueDates.includes(date)) {
        uniqueDates.push(date);
      }
    });
    return uniqueDates;
  };

  return (
    <div className="custom-body">
      <div className="d-flex flex-row">
        <div>
          <div>
            <h1 className="custom-header-name">Weather App</h1>
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              placeholder="Enter city name"
              className="custom-input"
            />
            <button onClick={getWeatherData} className="custom-btn">
              Weather
            </button>

            {weatherData && (
              <div className="custom-model">
                 
                <div className="costom-name">
                  <h3>{weatherData.name}</h3>
                </div>
                <p className="custom-tem">{weatherData.main.temp}°C</p>
                <div className="custom-weather-icon">
                  {getWeatherIcon(weatherData.weather[0].icon)}
                </div>

                <p className="custom-des">
                  {weatherData.weather[0].description}
                </p>
                <p className="custom-Tem-m">
                  Max-temp: {weatherData.main.temp_max}°C
                </p>
                <p className="custom-Tem-m">
                  Min-temp: {weatherData.main.temp_min}°C
                </p>
                <div className="custom-time-p">
                  <div className="custom-time">{currentDate}</div>
                </div>
              </div>
            )}

            {!weatherData && error && (
              <div className="custom-model">
                <div className="custom-error-p">
                  <h5 className="custom-error">
                    Something went wrong. Please check the city name!!
                  </h5>
                  <BiMessageError className="custom-icon" />
                </div>
              </div>
            )}

            {!weatherData && !error && (
              <div className="custom-model">
                <div className="custom-error-p">
                  <h5 className="custom-error">
                    Please enter a city or country name!!
                  </h5>
                  <FaCloudSunRain className="custom-icon" />
                </div>
              </div>
            )}
          </div>
        </div>

        {forecastData && (
          <div className="forecast-container-scroll">
            <div className="custom-model-forecastdata">
              <h6 className="header-title">Next 5 Days Forecast</h6>
              <div className="forecast-container">
                {filterUniqueDates(forecastData.list).map((date, index) => {
                  const forecastsForDate = forecastData.list.filter((item) =>
                    item.dt_txt.includes(date)
                  );
                  const firstForecast = forecastsForDate[0];

                  return (
                    <div key={index} className="forecast-item-horizontal">
                      <p className="forecast-date">{date}</p>

                      <div className="d-flex flex-row">
                        <div className="custom-forecast">
                          <span className="custom-forecast-icon">
                            {getWeatherIcon(firstForecast.weather[0].icon)}
                          </span>
                          <span className="custom-forecast-temp">
                            {firstForecast.main.temp}°C
                          </span>
                           
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
