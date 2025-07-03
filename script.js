document.addEventListener("DOMContentLoaded", () => {
  const theme = document.getElementById("day/night");
  const clock = document.getElementById("clock");
  const Stime = document.getElementById("StandardTime");
  const PopUp = document.getElementById("createCity");
  const add = document.getElementById("add");
  const API_KEY = "7cbd6faede9c0ff5d99e0a4e470be659";
  const GetCityName = document.getElementById("CityName");
  const submit = document.getElementById("submit");
  let count = JSON.parse(localStorage.getItem("theme")) || 0;
  const cities = JSON.parse(localStorage.getItem("city")) || [];
  cities.forEach((element) => {
    displayWeatherData(element);
  });
  ChangeTheme(count);
  theme.addEventListener("click", () => {
    count++;
    ChangeTheme(count);
    UpdateLocalStorage();
  });
  submit.addEventListener("click", async () => {
    const errorMsg = document.getElementById("ErrorMessage");
    const city = GetCityName.value;
    errorMsg.classList.add("hidden");
    if (city == "") {
      showError();
    } else {
      try {
        const weatherData = await fetchWeather(city);
        if (
          !cities.some(
            (c) => c.name?.toLowerCase() === weatherData.name.toLowerCase()
          )
        ) {
          cities.push(weatherData);
          displayWeatherData(weatherData);
          UpdateLocalStorage();
        }
        document.getElementById("WeatherList").classList.remove("hidden");
        GetCityName.value = "";
        PopUp.classList.add("hidden");
      } catch (error) {
        //console.log("Fetch error : ",error);
        showError();
      }
    }
  });
  async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    // console.log(response);
    // console.log(typeof response);
    if (!response.ok) {
      throw new Error("City Not Found");
    }
    const data = await response.json();
    return data;
  }
  function displayWeatherData(weatherData) {
  const { name, main, timezone } = weatherData;
  const card = document.createElement("div");
  card.className = `
    bg-gradient-to-r from-gray-900 to-gray-800 
    min-h-[140px] m-2 p-4 md:p-6 rounded-2xl shadow-lg 
    grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 items-center
    transition-all duration-300
  `;
  const locationSpan = document.createElement("span");
  locationSpan.className = `
    sm:col-span-2 text-white text-xl sm:text-2xl font-semibold 
    tracking-wide flex items-center gap-2 justify-center sm:justify-start
  `;
  locationSpan.innerHTML = `🏙️ <span>${name}</span>`;
  const utcMillis = Date.now();
  const localMillis = utcMillis + timezone * 1000;
  const localDate = new Date(localMillis);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[localDate.getUTCDay()];
  let hours = localDate.getUTCHours();
  const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;
  const timeSpan = document.createElement("span");
  timeSpan.className = `
    sm:col-span-1 text-white text-base sm:text-xl font-mono 
    text-center flex flex-col items-center
  `;
  timeSpan.innerHTML = `<span>${formattedTime}</span><span class="text-sm">${dayName}</span>`;
  const weatherSpan = document.createElement("span");
  weatherSpan.className = `
    sm:col-span-1 text-white text-lg sm:text-xl font-medium 
    text-center sm:text-right pr-0 sm:pr-2 flex justify-center sm:justify-end items-center gap-2
  `;
  weatherSpan.innerHTML = `☁️ <span>${Math.round(main.temp)}°C</span>`;
  card.appendChild(locationSpan);
  card.appendChild(timeSpan);
  card.appendChild(weatherSpan);
  document.getElementById("WeatherList").appendChild(card);
}
  function showError() {
    document.getElementById("ErrorMessage").classList.remove("hidden");
  }
  function ChangeTheme(count) {
    const body = document.getElementById("body");
    if (count % 2 !== 0) {
      body.classList.add("bg-white");
      body.classList.remove("bg-black");
      clock.classList.add("text-black");
      clock.classList.remove("text-white");
      Stime.classList.add("text-black");
      Stime.classList.remove("text-white");
    } else {
      body.classList.add("bg-black");
      body.classList.remove("bg-white");
      clock.classList.add("text-white");
      clock.classList.remove("text-black");
      Stime.classList.add("text-white");
      Stime.classList.remove("text-black");
    }
  }
  add.addEventListener("click", () => {
    PopUp.classList.remove("hidden");
    if (count % 2 !== 0) {
      document.getElementById("createCity").classList.remove("bg-white");
      document.getElementById("createCity").classList.add("bg-gray-400");
    }
    setTimeout(() => {
      PopUp.classList.remove("opacity-0", "scale-90");
      PopUp.classList.add("opacity-100", "scale-100");
    }, 10);
  });
  function UpdateLocalStorage() {
    localStorage.setItem("theme", JSON.stringify(count));
    localStorage.setItem("city", JSON.stringify(cities));
  }
  function timer() {
    const now = new Date();
    let hours = String(now.getHours().toString().padStart("0", 2));
    let mins = String(now.getMinutes().toString().padStart("0", 2));
    let sec = String(now.getSeconds().toString().padStart("0", 2));
    let clock = document.getElementById("clock");
    const Time = `${hours}:${mins}:${sec}`;
    clock.textContent = Time;
  }
  setInterval(timer, 1000);
  timer();
}); //end of dom
