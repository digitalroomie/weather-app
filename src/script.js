function displayDateTime(timestamp) {
  let date = new Date(timestamp);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `Last updated: ${day} ${hours}:${minutes}`;
}

function showCurrentLocationInfo(response) {
  celsiusTemp = response.data.main.temp;
  feelsLikeCelsiusTemp = response.data.main.feels_like;

  // Display city name
  document.querySelector(
    "h1"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  // Display temperature
  document.querySelector("#current-temp").innerHTML = Math.round(celsiusTemp);

  // Display 'Feels like' temperature
  document.querySelector("#feels-like").innerHTML =
    Math.round(feelsLikeCelsiusTemp);

  // Display humidity %
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );

  // Display wind speed (default is m/s - convert to km/h)
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );

  // Display wind speed
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  // Display last updated day and time
  document.querySelector("#current-date-time").innerHTML = displayDateTime(
    response.data.dt * 1000
  );

  // Display weather condition icons
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
}

function showCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let unit = "metric";

  let apiKey = `365522459be6f238831ff0a5021b2f77`;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showCurrentLocationInfo);
}

function detectLocation() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

function displayCityWeather(city) {
  let apiKey = `365522459be6f238831ff0a5021b2f77`;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=`;
  let unit = "metric";
  let apiUrl = `${apiEndpoint}${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showCurrentLocationInfo);
}

function citySearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-search-input");
  let city = searchInput.value.trim().toLowerCase();

  displayCityWeather(city);
}

function addRemoveActiveClass(event) {
  let element = document.querySelector(".active");
  if (element !== null) {
    element.classList.remove("active");
  }
  event.target.className = "active";
}

function temperatureConversion(event) {
  addRemoveActiveClass(event);

  let temperatureHeading = document.querySelector("#current-temp");
  let feelsLikeText = document.querySelector("#feels-like");

  if (event.target.id === "fahrenheit-link") {
    temperatureHeading.innerHTML = Math.round(celsiusTemp * 1.8 + 32);
    feelsLikeText.innerHTML = Math.round(feelsLikeCelsiusTemp * 1.8 + 32);
  }
  if (event.target.id === "celsius-link") {
    temperatureHeading.innerHTML = Math.round(celsiusTemp);
    feelsLikeText.innerHTML = Math.round(feelsLikeCelsiusTemp);
  }
}

let celsiusTemp = null;
let feelsLikeCelsiusTemp = null;

// City Search Form
let citySearchForm = document.querySelector("#city-search");
citySearchForm.addEventListener("submit", citySearch);

// Conversion between celsius and fahrenheit
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", temperatureConversion);
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", temperatureConversion);

// Display temperature of current location on button click
let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", detectLocation);

// Run auto location detection
detectLocation();
// Display a default city
displayCityWeather("Tokyo");
