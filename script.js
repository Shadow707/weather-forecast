const searchInput = document.getElementById('searchInput');
        const weatherData = document.getElementById('weatherData');
        const searchHistory = document.getElementById('searchHistory');
        const historyTitle = document.getElementById('historyTitle');
        const clearButton = document.getElementById('clearButton');

     
        function toggleHistoryVisibility() {
            const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

            if (history.length === 0) {
                historyTitle.style.display = 'none'; 
                clearButton.style.display = 'none'; 
            } else {
                historyTitle.style.display = 'block'; 
                clearButton.style.display = 'block'; 
            }
        }

        
        async function searchWeatherForecastByCity(city) {
            const apiKey = 'c970c8f35d8347a9947163411240603';
        
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
                const data = await response.json();
        
                // Display weather forecast data
                let forecastHTML = `<h2>5-Day Weather Forecast for ${data.location.name}, ${data.location.country}</h2>`;
                forecastHTML += '<table>';
                forecastHTML += '<tr><th>Date</th><th>Day</th><th>Max Temp (°C)</th><th>Min Temp (°C)</th><th>Condition</th><th>Chance of Rain (%)</th></tr>';
        
                data.forecast.forecastday.forEach(day => {
                    const weatherEmoji = weatherEmojiMap[day.day.condition.code] || '';
                    forecastHTML += `
                    <tr>
                        <td>${day.date}</td>
                        <td>${new Date(day.date).toLocaleString('en-US', { weekday: 'long' })}</td>
                        <td>${day.day.maxtemp_c}</td>
                        <td>${day.day.mintemp_c}</td>
                        <td>${day.day.condition.text} ${weatherEmoji}</td>
                        <td>${day.day.daily_chance_of_rain}</td>
                    </tr>
                    `;
                });
                
                forecastHTML += '</table>';
                weatherData.innerHTML = forecastHTML;
            } catch (error) {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
            }
        }
        
      
        async function searchWeather() {
            const postalCode = searchInput.value.trim();

            if (postalCode === '') {
                alert('Please enter details.');
                return;
            }

            try {
                await searchWeatherForecastByCity(postalCode);
        
                const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=c970c8f35d8347a9947163411240603&q=${postalCode}&aqi=yes`);
                const data = await response.json();

                const listItem = document.createElement('li');
                listItem.textContent = `${data.location.name}, ${data.location.country}`;
                listItem.addEventListener('click', () => {
                    const city = data.location.name.trim(); 
                    searchWeatherForecastByCity(city); 
                });
                searchHistory.appendChild(listItem);

    
                const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
                history.push(`${data.location.name}, ${data.location.country}`);
                localStorage.setItem('searchHistory', JSON.stringify(history));

               
                searchInput.value = '';

            
                toggleHistoryVisibility();
            } catch (error) {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
            }
        }

        
        function clearHistory() {
            localStorage.removeItem('searchHistory');
            searchHistory.innerHTML = '';
            toggleHistoryVisibility();
        }

        
        window.addEventListener('load', () => {
            const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
            if (history.length > 0) {
                history.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = item;
                    listItem.addEventListener('click', () => {
                        const city = item.split(',')[0].trim(); 
                        searchWeatherForecastByCity(city); 
                    });
                    searchHistory.appendChild(listItem);
                });
            }
            toggleHistoryVisibility();
        });

        searchInput.addEventListener('keyup', function(event) {
            
            if (event.keyCode === 13) {
               
                searchWeather();
            }
        });
        const weatherEmojiMap = {
            1000: '☀️',
            1003: '⛅',
            1006: '☁️',
            1009: '☁️',
            1030: '🌫️',
            1063: '🌦️',
            1066: '🌨️',
            1069: '🌨️',
            1072: '🌨️',
            1087: '⛈️',
            1114: '🌨️',
            1117: '🌨️',
            1135: '🌫️',
            1147: '🌫️',
            1150: '🌧️',
            1153: '🌧️',
            1168: '🌧️',
            1171: '🌧️',
            1180: '🌧️',
            1183: '🌧️',
            1186: '🌧️',
            1189: '🌧️',
            1192: '🌧️',
            1195: '🌧️',
            1198: '🌧️',
            1201: '🌧️',
            1204: '🌨️',
            1207: '🌨️',
            1210: '🌨️',
            1213: '🌨️',
            1216: '🌨️',
            1219: '🌨️',
            1222: '🌨️',
            1225: '🌨️',
            1237: '🌨️',
            1240: '🌧️',
            1243: '🌧️',
            1246: '🌧️',
            1249: '🌨️',
            1252: '🌨️',
            1255: '🌨️',
            1258: '🌨️',
            1261: '🌨️',
            1264: '🌨️',
            1273: '⛈️',
            1276: '⛈️',
            1279: '⛈️',
            1282: '⛈️'
        };
        