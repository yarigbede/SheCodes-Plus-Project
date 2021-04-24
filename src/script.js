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

function formatForecastDate(timestamp){
  let date = new Date(timestamp); 

  // date and time info 
  let days = ["SUN", "MON", "TUE", "WED","THU","FRI","SAT"];
  let weekDay = days[date.getDay()];
  return `${weekDay}`;
}

// HTML for forecast
function displayforecast(response){
  console.log(response.data.daily);
  let forecast = response.data.daily; // api section for daily forecast 
  let forecastElement = document.querySelector("#forecast-replicate");
   // for HTML "section" used as using col results in bad format as it is on the same row as the current weather temp
  let forecastHTML = ""; 
  forecast.forEach(function(forecastday, index){
    celsiusTempForecastHigh[index] = forecast[index].temp.max;
    celsiusTempForecastLow[index] = forecast[index].temp.min;
    if (index < 4) {
      forecastHTML = forecastHTML + `
        <section>
          <ul class="forecast">
            <li>
              <img src="http://openweathermap.org/img/wn/${forecast[index].weather[0].icon}@2x.png" alt="">
            </li>
            <li class="forecastTemp">
              <span class= "forecastHigh" id="forecast-temp-high${index}">
                ${Math.round(forecast[index].temp.max)}° /
              </span>
              <span class="forecastLow" id="forecast-temp-low${index}">
                ${Math.round(forecast[index].temp.min)}°
              </span>
            </li>
            <li>
              <p class="style-border forecast-day"><strong>${formatForecastDate(forecastday.dt*1000)}</strong></p>
            </li>
          </ul>
        </section> `;
        }})      

  forecastElement.innerHTML = forecastHTML;
}

function callForecastAPI(coordinates) {
  let lat = coordinates.lat; 
  let lon = coordinates.lon;
  let apiKey ="b726c0c3e5e5bc647284ff0039ec9b4a";
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  console.log(apiForecastUrl);
  axios.get(apiForecastUrl).then(displayforecast);
}

// returns info aside from temperature for daily API call 
function displayInfo (response){
  // display city name in H1
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

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
  callForecastAPI(response.data.coord);
}

// display Temp of searched location using API
function displayCitySearchTemp(response){
  console.log(response.data.coord);

  //display current temp in "today" section
  let currentTemp = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#temp-today");
  currentTempElement.innerHTML = `${currentTemp}`;
  celsiusTemp = currentTemp; // store celsius temp in global variable (for conversion to Fahrenheit)
  displayInfo(response);
}

// display temp of search location 
function displayTempCurrentLocation(response) {
   let currentTemp = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#temp-today");
  currentTempElement.innerHTML = `${currentTemp}`;
  celsiusTemp = currentTemp; // store celsius temp in global variable (for conversion to Fahrenheit)

  displayInfo(response);
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

  // unit conversion for forecast temperatures celsius --> fahrenheit
  for (let index = 0; index < 4; index++) {
    let forecastTempFahrenheitHigh = Math.round((celsiusTempForecastHigh[index] * 9 / 5) + 32);
    let forecastTempFahrenheitLow = Math.round((celsiusTempForecastLow[index] * 9 / 5) + 32);
    let TempForecastElementHigh = document.querySelector(`#forecast-temp-high${index}`);
    let TempForecastElementLow = document.querySelector(`#forecast-temp-low${index}`);
    TempForecastElementHigh.innerHTML = `${forecastTempFahrenheitHigh}° /`;
    TempForecastElementLow.innerHTML = `${forecastTempFahrenheitLow}°`;
  }
}

function toCelsius(event) {
  event.preventDefault(); 
  celsiusConverter.classList.replace("inactive","active");
  fahrenheitConverter.classList.replace("active", "inactive");
  let currentTemp = document.querySelector("#temp-today"); //celsius
  currentTemp.innerHTML = celsiusTemp;

  // unit conversion for forecast temperatures fahrenheit --> celsius
  for (let index = 0; index < 4; index++) {
    let forecastTempCelsiusHigh = Math.round(celsiusTempForecastHigh[index]);
    let forecastTempCelsiusLow = Math.round(celsiusTempForecastLow[index]);
    let TempForecastElementHigh = document.querySelector(`#forecast-temp-high${index}`);
    let TempForecastElementLow = document.querySelector(`#forecast-temp-low${index}`);
    TempForecastElementHigh.innerHTML = `${forecastTempCelsiusHigh}° /`;
    TempForecastElementLow.innerHTML = `${forecastTempCelsiusLow}°`;
}
}

let celsiusTemp = null;
let celsiusTempForecastHigh = [];
let celsiusTempForecastLow = []
let celsiusConverter = document.querySelector("#celsius");
let fahrenheitConverter = document.querySelector("#fahrenheit");
celsiusConverter.addEventListener("click", toCelsius);
fahrenheitConverter.addEventListener("click", toFahrenheit);

// display info if search button selected or user presses enter in text field
let form = document.querySelector("#form-search-city");
let formButton = document.querySelector("#form-search-button");
form.addEventListener("submit", callAPI);
formButton.addEventListener("submit", callAPI);  






