// Global variables
var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

// DOM element references
var cityInputEl = document.querySelector('#city-input');
var searchBtnEl = document.querySelector('#search-btn');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');
var cityNameEl = document.querySelector('#city-name'); // Add this line to reference city name element
var iconEl = document.querySelector('#weather-icon'); // Add this line to reference weather icon element
var futureDateEl = document.querySelectorAll('.forecast-date'); // Add this line to reference future date elements
var weatherIconEl = document.querySelectorAll('.forecast-icon'); // Add this line to reference future weather icon elements
var futureTempEl = document.querySelectorAll('.forecast-temp'); // Add this line to reference future temperature elements
var futureWindEl = document.querySelectorAll('.forecast-wind'); // Add this line to reference future wind elements
var futureHumidityEl = document.querySelectorAll('.forecast-humidity'); // Add this line to reference future humidity elements

// Add weather icons
var weatherIcons = {
  200: 'fa-solid fa-cloud-bolt',
  201: 'fa-solid fa-cloud-bolt',
  // Add more mappings as needed
};

// Function to set weather icon based on weather ID
function setWeatherIcon(weatherId, iconElement) {
  if (weatherIcons[weatherId]) {
    iconElement.classList.add('fa', weatherIcons[weatherId]);
  } else {
    // Handle unknown weather ID
  }
}

// Function to update history in local storage then updates displayed history
function appendToHistory(search) {
  // if there is no search term, return the function
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  // Add the search to the history
  searchHistory.push(search);
  // Update local storage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  // Update displayed history
  renderSearchHistory();
}

// Function to display search history list
function renderSearchHistory() {
  searchHistoryContainer.innerHTML = '';
  // Start at the end of the history array and count down to show the most recent at the top.
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');
    // Data search allows access to city name when the click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

// Function to fetch current day weather from weather API.
function todayWeather(cityName) {
  const todayBaseUrl = 'https://api.openweathermap.org';
  const todayUpdatedUrl = `${todayBaseUrl}?q=${encodeURIComponent(cityName)}&cnt=1&units=metric&appid=d91f911bcf2c0f925fb6535547a5ddc9`;

  fetch(todayUpdatedUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cityNameEl.textContent = `${cityName} (${date}) ${data.weather[0].main}`;
      // Set the weather icon based on weather ID
      setWeatherIcon(data.weather[0].id, iconEl);
    })
    .catch(function (error) {
      // Handle errors (e.g., network issues, API errors)
    });
}

// Function to fetch 5 days forecast from weather API.
function forecastWeather(cityName) {
  refreshIcons();
  const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  const updatedUrl = `${baseUrl}?q=${encodeURIComponent(cityName)}&cnt=60&units=metric&appid=d91f911bcf2c0f925fb6535547a5ddc9`;

  fetch(updatedUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Process forecast data and update UI (forecastContainer)
      forecastContainer.innerHTML = ''; // Clear the previous content

      // Loop through the forecast data and create elements for each forecast entry
      for (var i = 6; i < data.list.length; i += 8) {
        var forecastEntry = data.list[i];

        // Create a div to hold the forecast entry
        var forecastEntryDiv = document.createElement('div');
        forecastEntryDiv.classList.add('forecast-entry');

        // Create elements for date, weather icon, temperature, wind, and humidity
        var dateElement = document.createElement('p');
        dateElement.textContent = forecastEntry.dt_txt;

        // Create an icon element for weather
        var weatherIconElement = document.createElement('i');
        setWeatherIcon(forecastEntry.weather[0].id, weatherIconElement);

        var temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${forecastEntry.main.temp}°C`;

        var windElement = document.createElement('p');
        windElement.textContent = `Wind: ${forecastEntry.wind.speed} MPH`;

        var humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${forecastEntry.main.humidity} %`;

        // Append the elements to the forecast entry div
        forecastEntryDiv.appendChild(dateElement);
        forecastEntryDiv.appendChild(weatherIconElement);
        forecastEntryDiv.appendChild(temperatureElement);
        forecastEntryDiv.appendChild(windElement);
        forecastEntryDiv.appendChild(humidityElement);

        // Append the forecast entry div to the forecast container
        forecastContainer.appendChild(forecastEntryDiv);
      }
    })
    .catch(function (error) {
      // Handle errors (e.g., network issues, API errors)
    });
}

// Function to remove all previous classes that were added dynamically to show the weather icon
function refreshIcons() {
  // Loop through and remove classes from weather icon elements
  // You can implement this part based on your HTML structure
}

// Add an event listener to the search button
searchBtnEl.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent form submission
  var cityName = cityInputEl.value;
  if (cityName) {
    // Call functions to fetch current weather and forecast
    todayWeather(cityName);
    forecastWeather(cityName);
    // Also, update the search history
    appendToHistory(cityName);
  } else {
    // Handle empty input case (optional)
  }
});


// Add an event listener to the previous city search button which was added dynamically
newBtnEl.addEventListener('click', function (event) {
  var element = event.target;
  firstLoadRender();
  if (element.matches('button') === true) {
    var cityName = element.getAttribute('data-input');
    todayWeather(cityName);
    forecastWeather(cityName);
  }
});

// Function to load the page in the beginning
function firstLoadRender() {
  // Code for removing previous elements goes here
  // Load search history from local storage and update displayed history
  var storedHistory = localStorage.getItem('searchHistory');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
    renderSearchHistory();
  }
}

// Call the initialize function when the page loads
window.addEventListener('load', firstLoadRender);