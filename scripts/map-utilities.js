// --- Functions ---
// Function to create Leaflet map
// Note: mapId is the ID of the element containing the map (without '#')
function createMap(lat, lon, mapId) {
    // Initialize map
    const map = L.map(mapId);
    let defaultCoord = [lat, lon]; // center point
    let defaultZoom = 13;

    map.setView(defaultCoord, defaultZoom); // Set center point

    // Set up tile layers
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: MAPBOX_API_KEY //demo access token
    }).addTo(map);

    return map;
}

// Function to render all museum markers
async function renderAllMuseumMarkers() {
    let museums = await getMuseums();
    let museumLayer = L.geoJson(museums, {
        'pointToLayer': function (feature, latlng) {
            return L.marker(latlng, { icon: museumIcon });
        },
        'onEachFeature': function (feature, layer) {
            // Create a museum object to store all museum properties
            let museum = getMuseumInfo(feature.properties.Description);
            museum['coordinates'] = feature.geometry.coordinates.slice(0, 2).reverse(); // To get [lat,lon] instead of [lon,lat]
            museum['layer'] = layer; // Store the museum marker

            layer.bindPopup(`
            <h3 class="museum-name">${museum.name}</h3>
            <p class="museum-description">${museum.description}</p>
            <address class="museum-address">${museum.address}</address>
            <button class="btn-start" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'start')">Set as start point</button>
            <button class="btn-end" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'end')">Set as end point</button>
            `);

            layer.addEventListener('click', async function () {
                displayMuseumInfo(museum);
                await displayWeatherResult(museum.coordinates);
                map.flyTo(layer.getLatLng(), 18);
            })

            // Populate global MUSEUM variable with museum object
            MUSEUMS.push(museum);
        }
    });
    museumLayer.addTo(markerCluster);

};

// Function to extract key information from HTML description in museum geojson feature
function getMuseumInfo(html) {
    // Create an element to store the HTML description for extraction
    let divElement = document.createElement('div');
    divElement.innerHTML = html;

    // Each info is stored under 'td' tags in HTML
    let columns = divElement.querySelectorAll('td');

    // Address info is stored in index 0 (Block No.), 3 (Street), 2 (Postal code)
    let blockNo = columns[0].innerHTML;
    let street = columns[3].innerHTML;
    let postalCode = columns[2].innerHTML;
    let address = `${blockNo} ${street}, Singapore ${postalCode}`.trim(); // Format address to remove leading and trailing whitespaces

    let description = columns[5].innerHTML;

    let name = columns[9].innerHTML;
    let imageUrl = columns[10].innerHTML;

    // Return museum object
    return {
        'name': name,
        'description': description,
        'address': address,
        'imageUrl': imageUrl
    };
}

// Function to display autocomplete suggestions
function displayAutocompleteResults() {
    // Extract search query
    let searchInput = document.querySelector('#txtSearch');
    let query = searchInput.value.toLowerCase();

    // Clear previous autocomplete suggestions
    let autocompleteBox = document.querySelector('#autocomplete-box');
    autocompleteBox.innerHTML = '';

    // Create Ul element to store autocomplete suggestions as list
    let autocompleteUlElement = document.createElement('ul');

    let matchFound = false; // State variable to check if there are matches or not

    // Iterate through MUSEUM array to check if query matches 
    for (let museum of MUSEUMS) {
        if (museum.name.toLowerCase().includes(query) && query != '') {
            // Update state variable
            matchFound = true;

            // Create autocomplete suggestion li element
            let autocompleteLiElement = document.createElement('li');
            autocompleteLiElement.classList.add('autocomplete-result');
            autocompleteLiElement.innerHTML = museum.name;

            autocompleteLiElement.addEventListener('click', function () {
                // Populate search input field selected autocomplete suggestion
                searchInput.value = museum.name;
                // Set focus on search input field
                searchInput.focus();

                // Clear previous autocomplete suggestions
                autocompleteBox.innerHTML = '';
            });

            autocompleteUlElement.appendChild(autocompleteLiElement);
        }
    }

    // Append autocomplete suggestions if there are matches
    if (matchFound) {
        autocompleteBox.appendChild(autocompleteUlElement);
    }

}

// Function to display search result for museums
async function displayMuseumResult() {
    // Extract search query
    let searchInput = document.querySelector('#txtSearch');
    let actualQuery = searchInput.value;
    let query = searchInput.value.toLowerCase();

    // Clear previous search result
    let divSearchResult = document.querySelector('#searchResult');
    divSearchResult.innerHTML = '';

    // Clear autocomplete search results (if any)
    let autocompleteBox = document.querySelector('#autocomplete-box');
    autocompleteBox.innerHTML = '';

    let resultFound = false; // State variable to check if there is search result or not

    // Iterate through MUSEUM array to check if query matches 
    for (let museum of MUSEUMS) {
        if (museum.name.toLowerCase() == query) {
            // Update state variable
            resultFound = true;

            divSearchResult.innerHTML = `
            <img class="museum-img" src="${museum.imageUrl}" alt="Photo of museum" />
            <h3 class="museum-name">${museum.name}</h3>
            <p class="museum-description">${museum.description}</p>
            <address class="museum-address">${museum.address}</address>
            <button class="btn-start" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'start')">Set as start point</button>
            <button class="btn-end" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'end')">Set as end point</button>
           `;

           await displayWeatherResult(museum.coordinates);

            // Fly to selected museum marker
            map.flyTo(museum.coordinates, 18);
            // Tell markerCluster to show selected museum marker and open popup
            markerCluster.zoomToShowLayer(museum.layer, function () {
                museum.layer.openPopup();
            });

        }
    }

    // Return a message if query does not match all museum names
    // -> Display same message for each tab of search console drawer
    if (!resultFound) {
        divSearchResult.innerHTML = `No matches for "${actualQuery}" found.`;
        document.querySelector('#searchWeather').innerHTML = `No matches for "${actualQuery}" found.`;
        document.querySelector('#searchNearby').innerHTML = `No matches for "${actualQuery}" found.`;
    }

    // Update state of search drawer and state of toggle button
    let searchDrawer = document.querySelector('.console--drawer');
    searchDrawer.dataset.expand = 'false'; // so that changeToggleBtnState can update both states accordingly

    // -> Expand search drawer (if collapsed)
    searchDrawer.classList.add('console--drawer-expand');
    searchDrawer.classList.remove('console--drawer-collapse');

    let btnToggleSearchDrawer = document.querySelector('#btnToggleSearchDrawer');
    changeToggleBtnState(btnToggleSearchDrawer, searchDrawer); // update both states of search drawer and toggle button

}

// Function to display museum information on search console (for click on marker interactions)
function displayMuseumInfo(museum) {
    // Clear previous search result
    let divSearchResult = document.querySelector('#searchResult');
    divSearchResult.innerHTML = '';

    // Clear autocomplete search results (if any)
    let autocompleteBox = document.querySelector('#autocomplete-box');
    autocompleteBox.innerHTML = '';


    divSearchResult.innerHTML = `
    <img class="museum-img" src="${museum.imageUrl}" alt="Photo of museum" />
    <h3 class="museum-name">${museum.name}</h3>
    <p class="museum-description">${museum.description}</p>
    <address class="museum-address">${museum.address}</address>
    <button class="btn-start" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'start')">Set as start point</button>
    <button class="btn-end" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'end')">Set as end point</button>
    `;

    // Update state of search drawer and state of toggle button
    let searchDrawer = document.querySelector('.console--drawer');
    searchDrawer.dataset.expand = 'false'; // so that changeToggleBtnState can update both states accordingly

    // -> Expand search drawer (if collapsed)
    searchDrawer.classList.add('console--drawer-expand');
    searchDrawer.classList.remove('console--drawer-collapse');

    let btnToggleSearchDrawer = document.querySelector('#btnToggleSearchDrawer');
    changeToggleBtnState(btnToggleSearchDrawer, searchDrawer); // update both states of search drawer and toggle button

}

// Function to display weather information
async function displayWeatherResult(latlng) {
    let weatherInfo = await getWeather(latlng[0], latlng[1]);

    // Clear previous results
    let divSearchWeather = document.querySelector('#searchWeather');
    divSearchWeather.innerHTML = '';

    // Current weather object
    let currentWeather = weatherInfo.currentWeather;

    // 2hr forecast weather object
    let forecastWeather = weatherInfo.forecastWeather;

    for (let weather of [currentWeather, forecastWeather]) {
        // Create div element
        let weatherDiv = document.createElement('div');

        // Create header element
        let weatherHeader = document.createElement('h3');
        weatherHeader.classList.add('weather-header');

        if (weather.type == 'current') {
            weatherHeader.innerHTML = 'Current Weather';
        }
        else {
            weatherHeader.innerHTML = '2-Hour Forecast';
        }

        // Create img element
        let weatherIcon = document.createElement('img');
        weatherIcon.src = `../assets/weather-icons/${weather.iconCode}`;
        weatherIcon.classList.add('weather-icon');

        // Create span element
        let weatherDescription = document.createElement('span');
        weatherDescription.innerHTML = weather.description[0].toUpperCase() + weather.description.slice(1);

        // Set up weather information div
        weatherDiv.appendChild(weatherHeader);
        weatherDiv.appendChild(weatherIcon);
        weatherDiv.appendChild(weatherDescription);

        // Append weather information div to div #searchWeather
        divSearchWeather.appendChild(weatherDiv);
    }

}

// Function to toggle state of toggle buttons for drawers
function changeToggleBtnState(button, drawer) {
    // Check state of drawer
    if (drawer.dataset.expand == 'true') {
        button.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        drawer.dataset.expand = 'false';
    }
    else {
        button.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
        drawer.dataset.expand = 'true';
    }
}

// Function for buttons to set start/end points
// options: 'start' or 'end'
function setNavigationPoint(lat, lon, option) {
    let coordinates = [lat, lon];
    if (option == 'start') {
        startCoordinates = coordinates;
    }
    else {
        endCoordinates = coordinates;
    }

    console.log(`Start: ${startCoordinates}, End: ${endCoordinates}`);
}


// --- Set up Leaflet marker icons ---
// Set up marker icons
const museumIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-museum.png',

    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const parkingIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-parking.png',

    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const busIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-bus.png',

    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const diningIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-dining.png',

    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const startIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-start.png',

    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const endIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-end.png',

    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});