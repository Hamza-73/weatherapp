import React, { useEffect, useState } from 'react';
import '../css/temp.css';

const Temp = () => {
  const apiKey = 'c4f7c361b4ffeb6063b46b5b465ce4d6';
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState('');
  // eslint-disable-next-line
  const [defaultCity, setDefaultCity] = useState('Lahore');

  // Function to fetch latitude and longitude for the given city (without country code)
  const fetchCityCoordinates = async (cityName) => {
    try {
      const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
      const response = await fetch(geocodingUrl);
      const { coord } = await response.json();
      return coord; // Returns an object with 'lat' and 'lon'
    } catch (error) {
      console.error('Error fetching city coordinates', error);
      throw error;
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      const response = await fetch(weatherUrl);
      const resJson = await response.json();
      console.log(resJson);
      setCity(resJson);
    } catch (error) {
      console.error('Error fetching weather data', error);
      setCity(null); // Clear the city data on error
    }
  };

  const handleSearch = () => {
    if (search) {
      fetchCityCoordinates(search.trim()) // Remove leading/trailing spaces
        .then(({ lat, lon }) => {
          fetchWeatherData(lat, lon);
        })
        .catch((error) => {
          console.error('Error fetching city coordinates', error);
          setCity(null);
        });
    } else {
      getUserLocationAndFetchWeather();
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const getUserLocationAndFetchWeather = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Manually set city to Lahore
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location', error);
          fetchWeatherData();
        }
      );
    } else {
      fetchWeatherData();
    }
  };

  useEffect(() => {
    getUserLocationAndFetchWeather();
  }, []);

  return (
    <>
      <div className="container">
        <div className="search">
          <input type="search" value={search} onChange={handleChange} placeholder="Search for a city..." />
          <i style={{ cursor: "pointer" }} className="fa-solid fa-magnifying-glass" onClick={handleSearch}></i>
        </div>
        {city ? (
          <>
            <div className="loc-date">
              <p className='city'>{city.name}</p>
              <p className='date'>Sunday 20, November 2023</p>
            </div>

            <h1 className='temp'>{Math.round(city.main.temp - 273.15)}<sup>o</sup>c</h1>
            <h2>Haze</h2>
            <div className="add-detail">
              <p>27<sup>o</sup>c/28<sup>o</sup>c Feels Like {Math.round(city.main.feels_like - 273.15)}<sup>o</sup>c</p>
              <div className="flex">
                <p>Humidity : {city.main.humidity}%</p>
                <p>Visibility : {city.visibility / 1000}km</p>
              </div>
            </div>
          </>
        ) : (
          <h1>Location Not Found</h1>
        )}
      </div>
    </>
  );
};

export default Temp;