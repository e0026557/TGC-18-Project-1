// --- Set up APIs ---
// API keys
const MAPBOX_API_KEY = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
const NAVIGATION_API_KEY = 'DTlb4SGIUXbhU3D12zA1iAGXFiZna7BK';
const WEATHER_API_KEY = '891b31000be51f52585183d6ffdb3dc1';
const FOURSQUARE_API_KEY = 'fsq3yqoRulXjtzuJ8AHH4ZXqd+AlIXUfLNFhMGfN8kOOLRk=';

// API base URLs
const NAVIGATION_API_BASE_URL = 'https://tih-api.stb.gov.sg/map/v1.1/experiential_route';
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const FOURSQUARE_API_BASE_URL = 'https://api.foursquare.com/v3/places/search';

// Museum data's relative path
const MUSEUM_URL = '../data/museums.geojson';

// Functions to get data from each API
async function getNavigation(mode, origin, destination) {
    let url = NAVIGATION_API_BASE_URL + `/${mode}`;
    let response = await axios.get(url, {
        'params': {
            'apikey': NAVIGATION_API_KEY,
            'origin': origin,
            'destination': destination
        }
    });
    return response.data;
}

async function getWeather(lat, lon) {
    // List of weather data to be excluded from API call
    let exclude = 'minutely,daily,alerts';
    let url = WEATHER_API_BASE_URL + `?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${WEATHER_API_KEY}&units=metric`;
    console.log(url);

    let response = await axios.get(url);
    let weatherInfo = response.data;
    let currentWeather = {
        'type': 'current',
        'temperature': weatherInfo.current.temp,
        'description': weatherInfo.current.weather[0].description,
        'iconCode': weatherInfo.current.weather[0].icon
    };
    // Get 2hr weather forecast
    let forecastWeather = {
        'type': 'forecast',
        'temperature': weatherInfo.hourly[1].temp,
        'description': weatherInfo.hourly[1].weather[0].description,
        'iconCode': weatherInfo.hourly[1].weather[0].icon
    }

    return {
        'currentWeather': currentWeather,
        'forecastWeather': forecastWeather
    };
}

async function getNearby(latlon, radius, category) {
    // Look-up table for category codes in Foursquare
    const categoryCode = {
        'dining': '13000',
        'parking': '19020',
        'MRT': '19046',
        'bus': '19042'
    };

    let response = await axios.get(FOURSQUARE_API_BASE_URL, {
        'params': {
            'll': latlon,
            'radius': radius,
            'categories': categoryCode[category],
            'limit': 10
        },
        'headers': {
            'Accept': 'application/json', // MIME type - Expects a JSON formatted data
            'Authorization': FOURSQUARE_API_KEY
        }

    });

    // Get array of places
    let places = response.data.results;
    // Map each place to extract only name, coordinates, distance of each place
    places = places.map(place => {
        return {
            'name': place.name,
            'coordinates': [place.geocodes.main.latitude, place.geocodes.main.longitude],
            'distance': place.distance
        };
    });

    return places;
}

async function getMuseums() {
    let response = await axios.get(MUSEUM_URL);
    return response.data;
}

// Functions to test APIs
async function testNavigationAPI() {
    let data = await getNavigation('default', '1.3548,103.7763', '1.3387,103.7787');
    console.log(data);
};
// testNavigationAPI();

async function testWeatherAPI() {
    let data = await getWeather(1.3548,103.7763);
    console.log(data);
}
// testWeatherAPI();

async function testFoursquareAPI() {
    let data = await getNearby('1.3548,103.7763', 3000, 'bus');
    console.log(data);
}
// testFoursquareAPI();

async function testMuseum() {
    let data = await getMuseums();
    console.log(data);
}
// testMuseum();