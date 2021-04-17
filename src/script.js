// Displaying date and time info 
function formatDate(timestamp) {
  // timestamp = no. milliseconds from 1/1/1970
let date = new Date(timestamp); 

// date and time info 
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let weekDay = days[date.getDay()];
let hour = date.getHours(); 
let minute = date.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

return `Updated: ${weekDay} ${hour}:${minute}`;
}

// display Temp of searched location using API
function displayCitySearchTemp(response){
  console.log(response.data);
  console.log(response.data.weather[0].icon);
  // display city name in H1
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  //display current temp in "today" section
  let currentTemp = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#temp-today");
  currentTempElement.innerHTML = `${currentTemp}`;
  celsiusTemp = currentTemp; // store celsius temp in global variable (for conversion to Fahrenheit)

  // Display weather description and icon 
  let todayWeatherDescription = response.data.weather[0].description;
  let todayWeatherDescriptionElement = document.querySelector("#weather-description-current");
  todayWeatherDescriptionElement.innerHTML = todayWeatherDescription;

  let iconID = response.data.weather[0].icon;
  let weatherTodayIcon = document.querySelector("#weather-icon-today");
  weatherTodayIcon.setAttribute( "src",`http://openweathermap.org/img/wn/${iconID}@2x.png`);
  

  // find current time 
  let dateElement = document.querySelector("#date-and-time");
  dateElement.innerHTML = formatDate(response.data.dt *1000);

  // display wind speed and precipitation 
  let precipitationElement = document.querySelector("#stat-humidity");
  let windSpeedElement = document.querySelector("#stat-wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = response.data.main.humidity;

  precipitationElement.innerHTML = `HUMIDITY: ${humidity}%`
  windSpeedElement.innerHTML = `WIND SPEED: ${windSpeed} km/h`;
}

// display temp of search location 
function displayTempCurrentLocation(response) {
  // display city name in H1
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  let currentTemp = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#temp-today");
  currentTempElement.innerHTML = `${currentTemp}`;
  celsiusTemp = currentTemp; // store celsius temp in global variable (for conversion to Fahrenheit)

  // Display weather description and icon 
  let todayWeatherDescription = response.data.weather[0].description;
  let todayWeatherDescriptionElement = document.querySelector("#weather-description-current");
  todayWeatherDescriptionElement.innerHTML = todayWeatherDescription;

  let iconID = response.data.weather[0].icon;
  let weatherTodayIcon = document.querySelector("#weather-icon-today");
  weatherTodayIcon.setAttribute( "src",`http://openweathermap.org/img/wn/${iconID}@2x.png`);
  

  // find current time 
  let dateElement = document.querySelector("#date-and-time");
  dateElement.innerHTML = formatDate(response.data.dt *1000);

  // display wind speed and precipitation 
  let precipitationElement = document.querySelector("#stat-humidity");
  let windSpeedElement = document.querySelector("#stat-wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = response.data.main.humidity;

  precipitationElement.innerHTML = `HUMIDITY: ${humidity}%`
  windSpeedElement.innerHTML = `WIND SPEED: ${windSpeed} km/h`
 }

function displayCoords(position){
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey ="b726c0c3e5e5bc647284ff0039ec9b4a";
  let apiUrl =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTempCurrentLocation);
}

function displayLocalTemp(event){
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(displayCoords);
}

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener("click", displayLocalTemp);



function callAPI(event){  
    // Display city information in H1 element
  event.preventDefault();
  let input = document.querySelector("#enter-city");
  //API request for weather info
  let apiKey = "b726c0c3e5e5bc647284ff0039ec9b4a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value.trim()}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayCitySearchTemp); 
}

// unit converter 
function toFahrenheit(event) {
  event.preventDefault();
  fahrenheitConverter.classList.replace("inactive","active");
  celsiusConverter.classList.replace("active", "inactive");
  let currentTemp = document.querySelector("#temp-today"); //celsius
  let tempFahrenheit = Math.round((celsiusTemp * 9 / 5) + 32); //fahrenheit 
  currentTemp.innerHTML = tempFahrenheit;
}

function toCelsius(event) {
  event.preventDefault(); 
  celsiusConverter.classList.replace("inactive","active");
  fahrenheitConverter.classList.replace("active", "inactive");
  let currentTemp = document.querySelector("#temp-today"); //celsius
  currentTemp.innerHTML = celsiusTemp;
}

let celsiusTemp = null;
let celsiusConverter = document.querySelector("#celsius");
let fahrenheitConverter = document.querySelector("#fahrenheit");
celsiusConverter.addEventListener("click", toCelsius);
fahrenheitConverter.addEventListener("click", toFahrenheit);

// display info if search button selected or user presses enter in text field
let form = document.querySelector("#form-search-city");
let formButton = document.querySelector("#form-search-button");
form.addEventListener("submit", callAPI);
formButton.addEventListener("submit", callAPI);  






