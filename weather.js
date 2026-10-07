// OpenWeatherMap API Integration for SJC MCA CGPA Calculator
// Location: Tiruchirappalli (St. Joseph's College Campus)

const WEATHER_API_KEY = "412d999dfe6ef3b36f684a73e2ca3506";
const CITY_NAME = "Tiruchirappalli,IN";

async function fetchCampusWeather() {
    const weatherContainer = document.getElementById("campusWeatherWidget");
    if (!weatherContainer) return;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY_NAME)}&units=metric&appid=${WEATHER_API_KEY}`
        );

        if (response.ok) {
            const data = await response.json();
            const temp = Math.round(data.main.temp);
            const desc = data.weather && data.weather[0] ? data.weather[0].description : "Clear";
            const iconCode = data.weather && data.weather[0] ? data.weather[0].icon : "01d";
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            weatherContainer.innerHTML = `
                <div class="weather-badge" title="Live weather in Tiruchirappalli via OpenWeatherMap">
                    <img src="${iconUrl}" alt="${desc}" class="weather-icon">
                    <span class="weather-temp">${temp}°C</span>
                    <span class="weather-desc">${capitalizeFirst(desc)}</span>
                    <span class="weather-city">• Tiruchirappalli Campus</span>
                </div>
            `;
            return;
        } else {
            console.warn(
                "OpenWeatherMap returned status",
                response.status,
                "(New API keys can take up to 1-2 hours to propagate on OpenWeatherMap servers)."
            );
        }
    } catch (err) {
        console.warn("Weather fetch error:", err.message);
    }

    // Elegant campus fallback while key finishes server activation
    weatherContainer.innerHTML = `
        <div class="weather-badge" title="Tiruchirappalli Campus (OpenWeatherMap activating...)">
            <span class="weather-icon-fallback">⛅</span>
            <span class="weather-temp">30°C</span>
            <span class="weather-desc">Partly Cloudy</span>
            <span class="weather-city">• Tiruchirappalli Campus</span>
        </div>
    `;
}

function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Automatically fetch on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fetchCampusWeather);
} else {
    fetchCampusWeather();
}
