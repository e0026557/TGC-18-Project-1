// --- Functions ---
// Function to create Leaflet map
// Note: mapId is the ID of the element containing the map (without '#')
function createMap(lat, lon, mapId) {
    // Initialize map
    const map = L.map(mapId);
    let defaultCoord = [lat, lon]; // center point
    let defaultZoom = 12;

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

    iconSize: [40,40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

const parkingIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-parking.png',

    iconSize: [40,40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

const busIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-bus.png',

    iconSize: [40,40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

const diningIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-dining.png',

    iconSize: [40,40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

const startIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-start.png',

    iconSize: [40,40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

const endIcon = L.icon({
    iconUrl: '../assets/leaflet-icons/location-pin-end.png',

    iconSize: [40,40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});