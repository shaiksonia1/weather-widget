export class WeatherWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.city = this.getAttribute("city") || "Los Angeles"; // Default city
      this.render();
    }
  
    async fetchWeatherData(city) {
      const geocodeApiKey = "81d4b30a4754460496f8620b1c3988f5";
      const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geocodeApiKey}`;
      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
          const weatherResponse = await fetch(weatherUrl);
          const weatherData = await weatherResponse.json();
          this.renderWeather(city, weatherData.current_weather);
        } else {
          this.renderError("City not found!");
        }
      } catch (error) {
        console.error(error);
        this.renderError("Error fetching weather data.");
      }
    }
  
    renderWeather(city, weather) {
      const temperature = weather.temperature;
      const description = this.getWeatherMessage(weather.weathercode, temperature);
      const icon = this.getWeatherIcon(weather.weathercode);
  
      this.shadowRoot.innerHTML = `
        <style>
          .widget {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            padding: 20px;
            width: 300px;
            color: white;
            text-align: center;
          }
          .widget .icon {
            font-size: 50px;
          }
          .widget .info {
            margin-top: 10px;
          }
          .widget .temp {
            font-size: 2em;
            font-weight: bold;
          }
          .widget .message {
            margin-top: 10px;
            font-size: 1.1em;
          }
          .search {
            display: flex;
            justify-content: center;
            margin-bottom: 15px;
          }
          .search input {
            padding: 8px;
            border-radius: 5px;
            border: none;
            margin-right: 5px;
          }
            #city-input{
            width:19vw
            }
          .search button {
            padding: 8px 12px;
            border-radius: 5px;
            border: none;
            background-color: #00d2ff;
            color: white;
            cursor: pointer;
            font-weight: bold;
          }
          .search button:hover {
            background-color: #007bbb;
          }
        </style>
        <div class="search">
          <input type="text" placeholder="Enter city" id="city-input" />
          <button id="search-btn">Search</button>
        </div>
        <div class="widget">
          <div class="icon">${icon}</div>
          <div class="info">
            <div class="city">${city}</div>
            <div class="temp">${temperature}°C</div>
          </div>
          <div class="message">${description}</div>
        </div>
      `;
  
      this.shadowRoot.querySelector("#search-btn").addEventListener("click", () => {
        const newCity = this.shadowRoot.querySelector("#city-input").value;
        if (newCity) this.fetchWeatherData(newCity);
      });
    }
  
    renderError(message) {
      this.shadowRoot.innerHTML = `
        <style>
          .error {
            color: red;
            font-weight: bold;
            text-align: center;
          }
          .search {
            display: flex;
            justify-content: center;
            margin-bottom: 15px;
          }
          .search input {
            padding: 8px;
            border-radius: 5px;
            border: none;
            margin-right: 5px;
          }
          .search button {
            padding: 8px 12px;
            border-radius: 5px;
            border: none;
            background-color: #00d2ff;
            color: white;
            cursor: pointer;
            font-weight: bold;
          }
          .search button:hover {
            background-color: #007bbb;
          }
        </style>
        <div class="search">
          <input type="text" placeholder="Enter city" id="city-input" />
          <button id="search-btn">Search</button>
        </div>
        <div class="error">${message}</div>
      `;
  
      this.shadowRoot.querySelector("#search-btn").addEventListener("click", () => {
        const newCity = this.shadowRoot.querySelector("#city-input").value;
        if (newCity) this.fetchWeatherData(newCity);
      });
    }
  
    getWeatherMessage(weatherCode, temperature) {
      if (weatherCode >= 0 && weatherCode <= 3) {
        return temperature > 25
          ? "It's sunny and warm. Enjoy the sunshine!"
          : "It's sunny but a bit cool. Dress accordingly!";
      } else if (weatherCode >= 61 && weatherCode <= 67) {
        return "It's raining. Don't forget your umbrella!";
      } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75) {
        return "Snowy weather! Stay warm and drive safely.";
      } else if (weatherCode === 95) {
        return "Stormy weather! Stay indoors if possible.";
      } else {
        return "Weather is a bit unpredictable. Stay prepared!";
      }
    }
  
    getWeatherIcon(weatherCode) {
      if (weatherCode >= 0 && weatherCode <= 3) return "☀️";
      if (weatherCode >= 61 && weatherCode <= 67) return "🌧️";
      if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75) return "❄️";
      if (weatherCode === 95) return "⛈️";
      return "🌤️";
    }
  
    render() {
      this.fetchWeatherData(this.city);
    }
  }
  
  customElements.define("city-weather", WeatherWidget);
  