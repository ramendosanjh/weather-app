// Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

const cityInput = document.getElementById('city-input');
const searchForm = document.getElementById('search-form');
const currentWeatherContainer = document.getElementById('current-weather-container');
const forecastContainer = document.getElementById('forecast-container');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityName = cityInput.value;
  fetchWeather(cityName);
});

// Function to fetch weather data
function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      // Extract relevant weather information
      const location = data.name;
      const temperature = (data.main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
      const description = data.weather[0].description;
      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      // Update the HTML with the weather data
      currentWeatherContainer.innerHTML = `
        <h2>Current Weather in ${location}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Description: ${description}</p>
        <img src="${icon}" alt="Weather Icon">
      `;
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

// Add a sample forecast card (you can fetch and display a 5-day forecast as needed)
forecastContainer.innerHTML = `
  <div class="forecast-card">
    <h3>Sample Forecast</h3>
    <p>Temperature: 25°C</p>
    <p>Description: Sunny</p>
  </div>
`;
