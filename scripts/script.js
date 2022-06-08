// --- Set up APIs ---
// API keys
const NAVIGATION_API_KEY = 'DTlb4SGIUXbhU3D12zA1iAGXFiZna7BK';
const WEATHER_API_KEY = '891b31000be51f52585183d6ffdb3dc1';
const FOURSQUARE_API_KEY = 'fsq3yqoRulXjtzuJ8AHH4ZXqd+AlIXUfLNFhMGfN8kOOLRk=';

// API base URLs
const NAVIGATION_API_BASE_URL = 'https://tih-api.stb.gov.sg/map/v1.1/experiential_route';
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const FOURSQUARE_API_BASE_URL = 'https://api.foursquare.com/v3/places/search';

// Functions to build API URLs for each API
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

    let response = await axios.get(url);
    return response.data;
}

async function getNearby(latlon, query='', radius, category) {
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
            'query': query,
            'radius': radius,
            'categories': categoryCode[category],
            'limit': 5
        }
    });
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
    let data = await getNearby('1.3548,103.7763', '', 1000, 'parking');
    console.log(data);
}
testFoursquareAPI();