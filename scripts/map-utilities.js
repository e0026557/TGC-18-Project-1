// --- Global Variables ---
// --- Leaflet marker icons ---
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

const mrtIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-mrt.png',

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

const redIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-red.png',

    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Lookup table for each marker icon
const markerIcons = {
    'museum': museumIcon,
    'parking': parkingIcon,
    'bus': busIcon,
    'mrt': mrtIcon,
    'dining': diningIcon,
    'start': startIcon,
    'end': endIcon,
    'red': redIcon
};

// --- Functions ---
// Function to create Leaflet map
// Note: mapId is the ID of the element containing the map (without '#')
function createMap(latlng, mapId) {
    // Initialize map
    const map = L.map(mapId);
    let defaultZoom = 13;

    map.setView(latlng, defaultZoom); // Set given coordinates as center point

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

// Function to adjust position of Leaflet controls depending on screen width
function setLeafletControlPosition() {
    // Adjust position of Leaflet zoom and layer controls depending on screen width
    if (window.innerWidth < 768) {
        map.zoomControl.setPosition('bottomleft'); // Set zoom controls to be on the bottomleft corner
        layerControl.setPosition('bottomleft')
    }
    else {
        map.zoomControl.setPosition('topright'); // Set zoom controls to be on the topright corner
        layerControl.setPosition('topright')
    }
}

// Function to render all museum markers
async function renderAllMuseumMarkers(museumIcon, markerLayer) {
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

            // Set up HTML element to insert into marker popup
            let div = createContentDiv(museum, { 'concise': true });
            layer.bindPopup(div);

            // Add event listener for click interaction with markers
            layer.addEventListener('click', async function () {
                await displayMuseumInfo(museum);
                map.flyTo(layer.getLatLng(), 17);
            })

            // Populate global MUSEUM variable with museum object
            MUSEUMS.push(museum);
        }
    });
    museumLayer.addTo(markerLayer);

};

// Function to clear search bar query
function clearSearchBar() {
    let searchInput = document.querySelector('#txtSearch');
    searchInput.value = '';
}

// Function to clear autocomplete results
function clearAutocompleteResults() {
    let autocompleteBox = document.querySelector('#autocomplete-box');
    autocompleteBox.innerHTML = '';
}

// Function to display autocomplete suggestions
function displayAutocompleteResults() {
    // Extract search query
    let searchInput = document.querySelector('#txtSearch');
    let query = searchInput.value.toLowerCase();

    // Clear previous autocomplete suggestions
    clearAutocompleteResults();

    // Create Ul element to store autocomplete suggestions as list
    let autocompleteUlElement = document.createElement('ul');
    autocompleteUlElement.classList.add('autocomplete-list');

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
                clearAutocompleteResults();
            });

            autocompleteUlElement.appendChild(autocompleteLiElement);
        }
    }

    // Append autocomplete suggestions to div (autocomplete-box) if there are matches
    if (matchFound) {
        document.querySelector('#autocomplete-box').appendChild(autocompleteUlElement);
    }

}

// Function to display search result for museums
async function displayMuseumResult() {
    // Extract search query
    let searchInput = document.querySelector('#txtSearch');
    let actualQuery = searchInput.value; // Actual user input
    let query = searchInput.value.toLowerCase(); // Standardised input

    // Return if query is an empty string
    if (query == '') {
        // Make search result tab visible and hide all other tabs
        showTabContent('tab--search');

        // Expand console drawer
        expandConsoleDrawer()
        return;
    }

    // Clear previous search result for museum
    let divSearchResult = document.querySelector('#searchResult');
    divSearchResult.innerHTML = '';

    // Clear autocomplete search results (if any)
    clearAutocompleteResults();

    let resultFound = false; // State variable to check if there is search result or not

    // Iterate through MUSEUM array to check if query matches 
    for (let museum of MUSEUMS) {
        if (museum.name.toLowerCase() == query) {
            // Update state variable
            resultFound = true;

            // Populate div #searchResult with museum information
            let museumContentDiv = createContentDiv(museum, {'concise': false});
            divSearchResult.appendChild(museumContentDiv);

            // Display weather information of museum's location
            await displayWeatherResult(museum.coordinates);

            // Display form to select nearby amenities
            displayNearbyForm(museum);

            // Fly to selected museum marker
            map.flyTo(museum.coordinates, 17);
            // Tell markerCluster to show selected museum marker and open popup
            markerCluster.zoomToShowLayer(museum.layer, function () {
                museum.layer.openPopup();
            });

            break;
        }
    }

    // Return a message if query does not match all museum names
    // -> Display same message for each tab of search console drawer
    if (!resultFound) {
        divSearchResult.innerHTML = `No matches for "${actualQuery}" found.`;
        document.querySelector('#searchWeather').innerHTML = `No matches for "${actualQuery}" found.`;
        document.querySelector('#searchNearby').innerHTML = `No matches for "${actualQuery}" found.`;
    }

    // Make search result tab visible and hide all other tabs
    showTabContent('tab--search');
    // Display the museum sub-tab
    showSubTabContent('tab-museum', 'tab-museum-content');

    // Expand console drawer
    expandConsoleDrawer()

}

// Function to display museum information on search console (for click on marker interactions)
async function displayMuseumInfo(museum) {
    // Clear previous search result
    let divSearchResult = document.querySelector('#searchResult');
    divSearchResult.innerHTML = '';

    // Clear autocomplete search results (if any)
    clearAutocompleteResults();

    // Replace search query in search bar input with selected marker's museum name
    let searchInput = document.querySelector('#txtSearch');
    searchInput.value = museum.name;

    // Populate div #searchResult with museum information
    let museumContentDiv = createContentDiv(museum, {'concise': false});
    divSearchResult.appendChild(museumContentDiv);

    // Display weather information of museum's location
    await displayWeatherResult(museum.coordinates);

    // Display form to select nearby amenities
    displayNearbyForm(museum);

    // Make search result tab visible and hide all other tabs
    showTabContent('tab--search');
    // Display the museum sub-tab
    showSubTabContent('tab-museum', 'tab-museum-content');

    expandConsoleDrawer();
}

// Function to display weather information
async function displayWeatherResult(latlng) {
    let weatherInfo = await getWeather(latlng[0], latlng[1]);

    // Clear previous weather results
    let divSearchWeather = document.querySelector('#searchWeather');
    divSearchWeather.innerHTML = '';

    // Create a div element to store each weather div
    let divContainerContent = document.createElement('div');
    divContainerContent.classList.add('container--content');

    for (let weather of Object.values(weatherInfo)) {
        // Create div element
        let weatherDiv = document.createElement('div');
        weatherDiv.classList.add('content--weather');

        // Create header element
        let weatherHeader = document.createElement('h3');
        weatherHeader.classList.add('content--weather-header');

        if (weather.type == 'current') {
            weatherHeader.innerHTML = 'Current Weather';
        }
        else {
            weatherHeader.innerHTML = '2-Hour Forecast';
        }

        // Create img element
        let weatherIcon = document.createElement('img');
        weatherIcon.src = `../assets/weather-icons/${weather.iconCode}.png`;
        weatherIcon.classList.add('content--weather-img');

        // Create span element
        let weatherDescription = document.createElement('span');
        weatherDescription.classList.add('content--weather-description');
        weatherDescription.innerHTML = weather.description[0].toUpperCase() + weather.description.slice(1);

        // Set up weather information div
        weatherDiv.appendChild(weatherHeader);
        weatherDiv.appendChild(weatherIcon);
        weatherDiv.appendChild(weatherDescription);

        // Append weather information div to div .container--content
        divContainerContent.appendChild(weatherDiv);
    }

    divSearchWeather.appendChild(divContainerContent);

}

// Function to display form for nearby tab
function displayNearbyForm(museum) {
    // Select div #searchNearby
    let divSearchNearby = document.querySelector('#searchNearby');
    divSearchNearby.innerHTML = ''; // clear previous content

    // Create div to contain form and nearby result
    let divContainerContent = document.createElement('div');
    divContainerContent.classList.add('container--content');
    divSearchNearby.appendChild(divContainerContent); // Append to div #searchNearby

    // Add header to div .container--content
    divContainerContent.innerHTML = `
        <h3 class="content--header">Explore nearby: </h3>
    `;

    // Create div for form components
    let divForm = document.createElement('div');
    divForm.classList.add('content--form');
    divContainerContent.appendChild(divForm); // Append to div .container--content

    // Create a div for checkboxes section of form
    let divCheckboxes = document.createElement('div'); // div to hold all checkbox elements
    divCheckboxes.classList.add('form-section--checkbox');
    divForm.appendChild(divCheckboxes); // Append to form div .content--form
    
    // -> 4 checkboxes to select category of amenities to display
    let checkboxValues = ['dining', 'parking', 'bus', 'mrt'];
    let checkboxLabels = {
        'dining': 'Dining',
        'parking': 'Parking',
        'bus': 'Bus Stop',
        'mrt': 'MRT Station'
    };
    for (let value of checkboxValues) {
        // Create div for each checkbox (Bootstrap)
        let div = document.createElement('div');
        div.classList.add('form-check', 'form-switch')

        // Create checkbox element
        let checkbox = document.createElement('input');
        checkbox.id = `checkbox-${value}`; // for label to target checkbox
        checkbox.classList.add('form-check-input'); // Bootstrap's checkbox class
        checkbox.type = 'checkbox';
        checkbox.name = 'amenitiesType'
        checkbox.value = value;

        // Add event listener to update nearby markers on change
        checkbox.addEventListener('change', async function () {
            await displayNearbyResult(museum);
        });

        // Create label for checkbox element
        let label = document.createElement('label');
        label.classList.add('form-check-label'); // Bootstrap's label class
        label.htmlFor = checkbox.id; // to target checkbox
        label.innerHTML = checkboxLabels[value];

        // Append checkbox and label to div .form-section--checkbox
        div.appendChild(checkbox);
        div.appendChild(label);
        divCheckboxes.appendChild(div);
    }

    // // Append checkbox div .form-section--checkbox to form div .content--form
    // divForm.appendChild(divCheckboxes);

    // Create a div for select dropdown section of form
    let divSelect = document.createElement('div');
    divSelect.classList.add('form-section--select');
    divForm.appendChild(divSelect); // append to form div .content--form

    // Create select dropdown element for selecting search radius
    let selectElement = document.createElement('select');
    selectElement.classList.add('form-select'); // Bootstrap's select class
    selectElement.id = 'select-radius';
    
    // Add event listener to select element
    selectElement.addEventListener('change', async function () {
        displayNearbyResult(museum);
    });

    // Create a default option for radius selection
    selectElement.innerHTML = `<option value="0" disabled selected>Select radius</option>`
    // -> 3 options for search radius: 300m, 500m and 1km
    let optionValues = ['300', '500', '1000'];
    let optionTexts = {
        '300': '300m',
        '500': '500m',
        '1000': '1km'
    };
    for (let value of optionValues) {
        // Create option element
        let optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.text = optionTexts[value];

        // Add to select element
        selectElement.appendChild(optionElement);
    }

    // Append select element to div .form-section--select
    divSelect.appendChild(selectElement);
    // // Append div .form-section--select to form div .content--form
    // divForm.appendChild(divSelect);

    // Create a div to inform user when there is no results found
    let divResults = document.createElement('div');
    divResults.classList.add('content--result');
    divResults.id = 'results-nearby';
    divContainerContent.appendChild(divResults); // append to div .container--content

    // // Append form div to divSearchNearby
    // divSearchNearby.appendChild(divForm);
}

// Function to display nearby amenities
async function displayNearbyResult(museum) {
    // Clear all existing amenities markers and radius circle
    amenitiesLayer.clearLayers();

    // Get user's input on form
    // -> Get selected amenities to display
    let selectedAmenities = [];
    // let checkboxes = document.querySelectorAll('.checkbox-amenities');
    let checkboxes = document.querySelectorAll('.form-check-input');
    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            selectedAmenities.push(checkbox.value);
        }
    }

    // -> Get search radius
    let radius = document.querySelector('#select-radius').value;

    // Create circle marker around selected museum marker
    let circleOptions = {
        'radius': radius,
        'color': 'limegreen',
        'fillColor': 'limegreen',
        'fillOpacity': 0.3
    };
    L.circle(museum.coordinates, circleOptions).addTo(amenitiesLayer);

    // Set count variables to tally total number of nearby results by category (Default is 0)
    let nearbyResultCount = 0;

    // Get nearby amenities by category
    for (let category of selectedAmenities) {
        let places = await getNearby(museum.coordinates.join(','), radius, category);

        // Change marker icon and layer group depending on category of amenities to display
        let markerIcon = markerIcons[category];

        // Update count number of results by category
        nearbyResultCount += places.length;

        // Create marker for each place
        for (let place of places) {
            let marker = L.marker(place.coordinates, { icon: markerIcon });

            let div = createContentDiv(place, {'concise': true, 'displayDistance': true});
            marker.bindPopup(div);

            marker.addTo(amenitiesLayer);
        }

    }

    // Only display message when there are no results found
    let divResult = document.querySelector('#results-nearby');
    if (nearbyResultCount == 0) {
        divResult.innerHTML = `There are no results found.`;
    }
    else {
        divResult.innerHTML = '';
    }
}

// Function to get user's current coordinates
function getUserLocation() {
    // Get user's location if geolocation is supported
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let coordinates = [position.coords.latitude, position.coords.longitude];

            // Create new marker
            let newUserMarker = L.marker(coordinates, { icon: redIcon }).addTo(map);

            let userObject = {
                'name': 'Current location',
                'coordinates': coordinates
            };

            let div = createContentDiv(userObject, {'concise': true});
            newUserMarker.bindPopup(div);

            map.flyTo(coordinates, 17);
            newUserMarker.openPopup();

            // Remove old marker (if any)
            if (USER_MARKER != null) {
                USER_MARKER.removeFrom(map);
            }

            // Store new user marker
            USER_MARKER = newUserMarker;
        });
    }
}

// Function for buttons to set start/end points
function setNavigationPoint(latlng, locationName, option) {
    if (option == 'start') {
        // Reassign value of global variable start point
        START_COORDINATES = latlng;
        // Populate start input field of navigation form
        document.querySelector('#startPoint').value = locationName;
    }
    else {
        // Reassign value of global variable end point
        END_COORDINATES = latlng;
        // Populate end input field of navigation form
        document.querySelector('#endPoint').value = locationName;
    }

    // Show navigation form
    showTabContent('tab--navigation');

    // Expand console drawer
    expandConsoleDrawer();
}