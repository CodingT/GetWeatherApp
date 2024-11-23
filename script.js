document.getElementById('getWeather').addEventListener('click', function() {
    const locationInput  = document.getElementById('locationInput').value;
    const apiKey = 'YOU_API_KEY_HERE'; // Please Enter your OpenCage API key

    if (!locationInput) {
        alert('Please enter a ZIP code');
        return;
    }

// Fetching latitude, longitude, and city name from OpenCage Geocoding API
fetch(`https://api.opencagedata.com/geocode/v1/json?q=${locationInput}&key=${apiKey}&country_code=us`)
.then(response => response.json())
.then(data => {
    if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        const components = data.results[0].components;
        const city = components.city || components.town || components.village || components.hamlet || components.state || 'Unknown location';
        getWeather(lat, lng, city);
    } else {
        alert('Invalid location');
    }
})
.catch(error => console.error('Error fetching geocode data:', error));
});

//Fetching Weather data from open-meteo
function getWeather(latitude, longitude, city) {
fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`)
.then(response => response.json())
.then(data => {
    const temperatures = data.hourly.temperature_2m;
    const times = data.hourly.time;

    let minTemp = temperatures[0];
    let maxTemp = temperatures[0];
    let minTime = times[0];
    let maxTime = times[0];

    for (let i = 1; i < temperatures.length; i++) {
        if (temperatures[i] < minTemp) {
            minTemp = temperatures[i];
            minTime = times[i];
        }
        if (temperatures[i] > maxTemp) {
            maxTemp = temperatures[i];
            maxTime = times[i];
        }
    }

    // Display the results
    let resultHtml = `<h2>Weather Forecast for ${city}</h2>`;
    resultHtml += `<p>Minimum Temperature: ${minTemp}°C at ${minTime}</p>`;
    resultHtml += `<p>Maximum Temperature: ${maxTemp}°C at ${maxTime}</p>`;
    document.getElementById('weatherResult').innerHTML = resultHtml;
})
.catch(error => console.error('Error fetching weather data:', error));
}