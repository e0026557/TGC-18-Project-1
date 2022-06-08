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

    return {
        'name': name,
        'description': description,
        'address': address,
        'imageUrl': imageUrl
    };
}

// Function for buttons to set start/end points
// options: 'start' or 'end'
function setStartPoint(lat, lon, option) {
    console.log(lat, lon, option);
}


// --- Rendering Leaflet map
// Global variables for accessing museum information
const MUSEUMS = [];

// Create Leaflet map
let centerPoint = [1.3521, 103.8198];
const map = createMap(centerPoint[0], centerPoint[1], 'map');

// Create Leaflet marker cluster group
let markerCluster = L.markerClusterGroup();
markerCluster.addTo(map);

// Render museum markers
(async function() {
    let museums = await getMuseums();
    let museumLayer = L.geoJson(museums, {
        'onEachFeature': function(feature, layer) {
            let museum = getMuseumInfo(feature.properties.Description)
            let museumCoordinates = feature.geometry.coordinates.slice(0,2);
            museum['coordinates'] = museumCoordinates;
            
            // Populate global MUSEUM variable with museum object
            MUSEUMS.push(museum);

            layer.bindPopup(`
                <h3 class="museum-name">${museum.name}</h3>
                <p class="museum-description">${museum.description}</p>
                <address class="museum-address">${museum.address}</address>
                <button class="btn-start" onclick="setStartPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'start')">Set as start point</button>
                <button class="btn-end" onclick="setStartPoint(${museumCoordinates[0]}, ${museumCoordinates[1]}, 'end')">Set as end point</button>
                ${museumCoordinates}
            `);
        }
    });

    museumLayer.addTo(markerCluster);

})();
