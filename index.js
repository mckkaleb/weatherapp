const KEY = "fbfd70625fe786108e4366f582972b0d";

let units = 'imperial';

function apiCall() {
    document.getElementById("loader").classList.toggle("loader");

    navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let url = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon + "&units=" + units +"&appid=" + KEY;

        fetch(url)
            .then(res => res.json())
            .then(data => updatePage(data));
    }); 
}

function setUnits(unit) {
    units = unit;
    apiCall();
}

function updatePage(json) {
    let url = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat=" + json.lat + "&lon=" + json.lon;

    fetch(url)
        .then(res => res.json())
        .then(data => document.getElementById("location").innerHTML = "Current Conditions for " + data.features[0].properties.address.city + ", " +  data.features[0].properties.address.state);

    if (json.current.weather[0].main == "Clouds") {
        document.getElementById("background-image").src = './images/cloudy.jpg';
    } else if (json.current.weather[0].main == "Rain") {
        document.getElementById("background-image").src = './images/rainy.jpg';
    } else if (json.current.weather[0].main == "Drizzle") {
        document.getElementById("background-image").src = './images/drizzle.jpg';
    } else if (json.current.weather[0].main == "Snow") {
        document.getElementById("background-image").src = './images/snowy.jpg';
    } else if (json.current.weather[0].main == "Thunderstorm") {
        document.getElementById("background-image").src = './images/thunderstorm.jpg';
    }                 
    
    document.getElementById("current-temp").innerHTML = Math.round(json.current.temp) + "°";
    document.getElementById("feels-like").innerHTML = Math.round(json.current.feels_like) + "°";
    document.getElementById("condition").innerHTML = json.current.weather[0].main;
    document.getElementById("humidity").innerHTML = json.current.humidity + "%";
    document.getElementById("cloudliness").innerHTML = json.current.clouds + "%";
    document.getElementById("uv-index").innerHTML = json.current.uvi;
    document.getElementById("wind").innerHTML = json.current.wind_speed;

    document.getElementById("rain-today").innerHTML = json.daily[0].rain + "mm / " + Number.parseFloat(json.daily[0].rain / 25.4).toPrecision(4) + '"';
    document.getElementById("dewpoint").innerHTML = json.daily[0].dew_point + "°";
    document.getElementById("sunrise").innerHTML = new Date(json.daily[0].sunrise * 1000).toLocaleTimeString("en-US");
    document.getElementById("sunset").innerHTML = new Date(json.daily[0].sunset * 1000).toLocaleTimeString("en-US");

    displayHourly(json);
    displayDaily(json);

    document.getElementById("loader").classList.toggle("loader");
    document.getElementById("header").style.display = "block";
    document.getElementById("main").style.display = "block";
}

function displayHourly(json) {
    let table = document.getElementById("hourly-table");

    table.textContent = '';

    for (let i = 0; i < json.hourly.length; i++) {
        let row = document.createElement("TR");

        let time = document.createElement("TD");
        let localTime = new Date(json.hourly[i].dt * 1000).toLocaleTimeString("en-US");
        let timeString = document.createTextNode(localTime)
        time.appendChild(timeString)

        let condition = document.createElement("TD");
        let conditionString = document.createTextNode(json.hourly[i].weather[0].description);
        condition.appendChild(conditionString);

        let rain = document.createElement("TD");
        let rainString = document.createTextNode(Math.round(json.hourly[i].pop * 100) + "%");
        rain.appendChild(rainString);

        let temp = document.createElement("TD");
        let tempString = document.createTextNode(Math.round(json.hourly[i].temp) + "°");
        temp.appendChild(tempString);

        row.appendChild(time);
        row.appendChild(condition);
        row.appendChild(rain);
        row.appendChild(temp);

        table.appendChild(row);
    }
}

function displayDaily(json) {
    let table = document.getElementById("daily-table");

    table.textContent = '';

    for (let i = 0; i < json.daily.length; i++) {
        let row = document.createElement("TR");

        let time = document.createElement("TD");
        let localTime = new Date(json.daily[i].dt * 1000).toDateString();
        let timeString = document.createTextNode(localTime)
        time.appendChild(timeString)

        let condition = document.createElement("TD");
        let conditionString = document.createTextNode(json.daily[i].weather[0].description);
        condition.appendChild(conditionString);

        let rain = document.createElement("TD");
        let rainString = document.createTextNode(Math.round(json.daily[i].pop * 100) + "%");
        rain.appendChild(rainString);

        let temp = document.createElement("TD");
        let tempString = document.createTextNode(Math.round(json.daily[i].temp.max) + "/" + Math.round(json.daily[i].temp.min));
        temp.appendChild(tempString);

        row.appendChild(time);
        row.appendChild(condition);
        row.appendChild(rain);
        row.appendChild(temp);

        table.appendChild(row);
    }
}

apiCall();
