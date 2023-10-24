// Variables
const searchButton = document.querySelector(".btn"); 
const cityInput = document.getElementById("city-input");
const currentWeatherContainer = document.getElementById("current-weather-container"); 
const forecastContainer = document.getElementById("forecast-container"); 

// Set your OpenWeatherMap API key
const API_KEY = "6efe4605321db47708f49217ca886b3a";

// Hide weather and forecast at first
currentWeatherContainer.style.display = "none";
forecastContainer.style.display = "none";

// Added Event listener for form submission
document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the form from submitting

  const cityName = cityInput.value;
  getWeatherData(cityName);
});

// Function to get weather data based on city name
function getWeatherData(cityName) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      updateCurrentWeather(data);
      getForecastData(data.coord.lat, data.coord.lon);
    })
    .catch(function (error) {
      console.error("Error with fetching weather data:", error);
    });
}

// Function to update current weather display
function updateCurrentWeather(data) {
  const location = data.name;
  const temperature = (data.main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
  const description = data.weather[0].description;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  currentWeatherContainer.innerHTML = `
    <h2>Current Weather in ${location}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Description: ${description}</p>
    <img src="${icon}" alt="Weather Icon">
  `;

  // Display the current weather container
  currentWeatherContainer.style.display = "block";
}

// Function to get 5-day forecast data
function getForecastData(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}&units=metric`;

  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      updateForecast(data);
    })
    .catch(function (error) {
      console.error("Error with fetching forecast data:", error);
    });
}

// Function to update the 5-day forecast display
function updateForecast(data) {
  forecastContainer.innerHTML = '<h2>Five Day Forecast Below</h2>';

  // Process and display the 5-day forecast data
  for (let i = 1; i <= 5; i++) {
    const forecast = data.daily[i];
    const date = new Date(forecast.dt * 1000);
    const temperature = forecast.temp.day;
    const description = forecast.weather[0].description;

    forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h3>${date.toDateString()}</h3>
        <p>Temperature: ${temperature}°C</p>
        <p>Description: ${description}</p>
      </div>
    `;
  }

  // Display the forecast container
  forecastContainer.style.display = "block";
}
