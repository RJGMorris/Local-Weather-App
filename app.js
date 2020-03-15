window.addEventListener('load', () => {
	let long, lat;
	const temperatureDescription = document.querySelector('.temperature-description');
	const temperatureDegree = document.querySelector('.temperature-degree');
	const locationTimezone = document.querySelector('.location-timezone');
	const degreeSection = document.querySelector('.degree-section');
	const degreeSectionLow = document.querySelector('.low');
	const degreeSectionSpan = document.querySelector('.degree-section span');
	const forecastSection = document.querySelector('.forecast-section');
	const forecastSectionWeek = document.querySelector('.forecast-section-week');

	let tempratureData = {
		main: null,
		hourly: [],
		daily: []
	};

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			long = position.coords.longitude;
			lat = position.coords.latitude;

			const proxy = 'https://cors-anywhere.herokuapp.com/';
			const weatherAPI = `${proxy}https://api.darksky.net/forecast/6eb34cdd0f8fa93e0eadd47f2d788840/${lat},${long}`;
			const locationAPI = `${proxy}https://www.metaweather.com/api/location/search/?lattlong=${lat},${long}`;

			async function apiCall() {
				const response = await fetch(weatherAPI);
				const data = await response.json();
				console.log(data);
				const { temperature, icon } = data.currently;
				const forecast = data.hourly.data.slice(0, 5);
				const forecastWeek = data.daily.data.slice(1, 8);

				// Convert to celsius
				let celsius = Math.floor(tempConvert(temperature));

				// Store Temprature Data
				tempratureData.main = {
					fahrenheit: Math.floor(temperature),
					celsius: celsius
				};

				// Set DOM Elements from the API
				temperatureDegree.textContent = celsius;
				temperatureDescription.textContent = data.hourly.summary;

				// Set DOM forecast
				setForecast(forecast);
				setForecastWeek(forecastWeek);

				// Set Icon
				setIcons(icon, document.querySelector('.icon'));

				// Change temprature on Click
				degreeSection.addEventListener('click', () => {
					setTempratures();
				});
			}

			async function apiCall2() {
				const response = await fetch(locationAPI);
				const data = await response.json();
				console.log(data);
				locationTimezone.textContent = `${data[0].title} ${data[0].location_type}`;
			}

			apiCall();
			apiCall2();
		});
	}

	function setForecast(forecast) {
		let today = new Date();
		let now = today.getHours();

		forecast.forEach((el) => {
			let hour = forecast.indexOf(el);
			let icon = el.icon;
			let temperature = Math.floor(el.temperature);
			let celsius = Math.floor(tempConvert(el.temperature));

			tempratureData.hourly.push({
				fahrenheit: temperature,
				celsius: celsius
			});

			let html = `<div class="forecast">\
                        <h5>${now + hour + 1}:00 </h5><h2 class="forecast-degree">${celsius}</h2><p>o</p><span>C</span>\
                        <canvas class="icon-${hour}" width="32" height="32"></canvas></div>`;

			forecastSection.insertAdjacentHTML('beforeend', html);
			setIcons(icon, document.querySelector(`.icon-${hour}`));
		});
	}

	function setForecastWeek(forecast) {
		let today = new Date();
		let now = today.getDay();
		let week = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wesnesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday'
		};
		let day = now + 1;

		forecast.forEach((el) => {
			if (day > 6) {
				day = 0;
			}
			let icon = el.icon;
			let temperature = [ Math.floor(el.temperatureHigh), Math.floor(el.temperatureLow) ];
			let celsius = temperature.map((temp) => {
				return Math.floor(tempConvert(temp));
			});

			tempratureData.daily.push({
				fahrenheit: temperature[0],
				celsius: celsius[0]
			});

			tempratureData.daily.push({
				fahrenheit: temperature[1],
				celsius: celsius[1]
			});

			let html = `<div class="forecast-day">\
						<h2 class="first-list-item">${week[day]}</h2>\
						<div class="list-item"><canvas class="icon-day-${day}" width="32" height="32"></canvas></div>\
						<div class="list-item"><h2 class="forecast-degree-day">${celsius[0]}</h2><p>o</p><span>C</span></div>\
						<div class="low list-item"><h2 class="forecast-degree-day">${celsius[1]}</h2><p>o</p><span>C</span></div></div>`;

			forecastSectionWeek.insertAdjacentHTML('beforeend', html);
			setIcons(icon, document.querySelector(`.icon-day-${day}`));

			day++;
		});
	}

	// Convert fahrenheit to celsius
	function tempConvert(temp) {
		return (temp - 32) * (5 / 9);
	}

	function setTempratures() {
		let forecastDegree = document.querySelectorAll(`.forecast-degree`);
		let forecastDegreeSpan = document.querySelectorAll('.forecast span');
		let forecastDegreeDay = document.querySelectorAll(`.forecast-degree-day`);
		let forecastDegreeDaySpan = document.querySelectorAll('.forecast-day span');

		if (degreeSectionSpan.textContent === 'F') {
			// Chnage Main Temprature
			degreeSectionSpan.textContent = 'C';
			degreeSectionLow.textContent = 'F';
			temperatureDegree.textContent = tempratureData.main.celsius;

			// Chnage Hourly Temprature
			for (let i = 0; i < forecastDegreeSpan.length; i++) {
				forecastDegree[i].textContent = tempratureData.hourly[i].celsius;
				forecastDegreeSpan[i].textContent = 'C';
			}

			// Chnage Dayly Temprature
			for (let i = 0; i < forecastDegreeDaySpan.length; i++) {
				forecastDegreeDay[i].textContent = tempratureData.daily[i].celsius;
				forecastDegreeDaySpan[i].textContent = 'C';
			}
		} else {
			// Chnage Main Temprature
			degreeSectionSpan.textContent = 'F';
			degreeSectionLow.textContent = 'C';
			temperatureDegree.textContent = tempratureData.main.fahrenheit;

			// Chnage Hourly Temprature
			for (let i = 0; i < forecastDegreeSpan.length; i++) {
				forecastDegree[i].textContent = tempratureData.hourly[i].fahrenheit;
				forecastDegreeSpan[i].textContent = 'F';
			}

			// Chnage Dayly Temprature
			for (let i = 0; i < forecastDegreeDaySpan.length; i++) {
				forecastDegreeDay[i].textContent = tempratureData.daily[i].fahrenheit;
				forecastDegreeDaySpan[i].textContent = 'F';
			}
		}
	}

	function setIcons(icon, iconID) {
		const skycons = new Skycons({ color: 'white' });
		skycons.play();
		return skycons.set(iconID, icon);
	}
});
