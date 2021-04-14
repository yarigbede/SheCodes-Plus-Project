// Displaying date and time info 
function formatDate() {
let now = new Date(); 

// date and time info 
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let weekDay = days[now.getDay()];
let hour = now.getHours(); 
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

// display on screen
let date = document.querySelector("#date-and-time");
date.innerHTML = `${weekDay} ${hour}:${minute}`;
}

formatDate();


// display Temp of searched location using API
function displayCitySearchTemp(response){
  console.log(response.data);
  
  // display city name in H1
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  //display current temp in "today" section
  let currentTemp = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#temp-today");
  currentTempElement.innerHTML = currentTemp;
}

// display temp of search location 
function displayTempCurrentLocation(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#temp-today");
  currentTempElement.innerHTML = currentTemp;
 }

function displayCoords(position){
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(`${lat}, ${lon}`);
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

// display info is search button selected or user presses enter in text field
let form = document.querySelector("#form-search-city");
let formButton = document.querySelector("#form-search-button");
form.addEventListener("submit", callAPI);
formButton.addEventListener("submit", callAPI);  

// // change units 
// function toCelsius(event) {
//   event.preventDefault();
//   let temp = document.querySelector("#temp-today");
//   temp.innerHTML = "19";
// }

// function toFahrenheit(event) {
//   event.preventDefault();
//   let temp = document.querySelector("#temp-today");
//   temp.innerHTML = "66";
// }

// let celsius = document.querySelector("#celsius");
// let fahrenheit = document.querySelector("#fahrenheit");
// celsius.addEventListener("click", toCelsius);
// fahrenheit.addEventListener("click", toFahrenheit);


