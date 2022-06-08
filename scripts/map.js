// --- Global ---
// Global variables for accessing museum information
const MUSEUMS = [];

// Global variables for navigation
let startCoordinates = null;
let endCoordinates = null;


// --- Rendering Leaflet map ---
// Create Leaflet map
let centerPoint = [1.3521, 103.8198];
const map = createMap(centerPoint[0], centerPoint[1], 'map');

// Create Leaflet marker cluster group
let markerCluster = L.markerClusterGroup();
markerCluster.addTo(map);

// Render all museum markers
(async function () {
    let museums = await getMuseums();
    let museumLayer = L.geoJson(museums, {
        'pointToLayer': function (feature, latlng) {
            return L.marker(latlng, { icon: museumIcon });
        },
        'onEachFeature': function (feature, layer) {
            let museum = getMuseumInfo(feature.properties.Description);
            museum['coordinates'] = feature.geometry.coordinates.slice(0, 2).reverse(); // To get [lat,lon] instead of [lon,lat]

            layer.bindPopup(`
            <h3 class="museum-name">${museum.name}</h3>
            <p class="museum-description">${museum.description}</p>
            <address class="museum-address">${museum.address}</address>
            <button class="btn-start" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'start')">Set as start point</button>
            <button class="btn-end" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'end')">Set as end point</button>
            ${museum.coordinates}
            `);

            // Populate global MUSEUM variable with museum object
            MUSEUMS.push(museum);
        }
    });
    museumLayer.addTo(markerCluster);

})();


// TODO
// Search museums
let searchMuseumLayer = L.layerGroup();
document.querySelector('#btnSearch').addEventListener('click', function () {
    // Extract search query
    let query = document.querySelector('#txtSearch').value.toLowerCase();

    // Clear all markers
    markerCluster.clearLayers();

    let divSearchResult = document.querySelector('#searchResult');
    let resultUlElement = document.createElement('ul');
    // Iterate through MUSEUM array to check if query matches 
    for (let museum of MUSEUMS) {
        if (museum.name.toLowerCase().includes(query)) {
            // Create marker
            let marker = L.marker(museum.coordinates);
            marker.bindPopup(`
            <h3 class="museum-name">${museum.name}</h3>
            <p class="museum-description">${museum.description}</p>
            <address class="museum-address">${museum.address}</address>
            <button class="btn-start" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'start')">Set as start point</button>
            <button class="btn-end" onclick="setNavigationPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'end')">Set as end point</button>
            ${museum.coordinates}
            `);

            marker.addTo(markerCluster);

            let resultLiElement = document.createElement('li');
            resultLiElement.innerHTML = museum.name;
            resultLiElement.addEventListener('click', function () {

                map.flyTo(marker.getLatLng(), 18);
                marker.openPopup();
            });

            resultUlElement.appendChild(resultLiElement);
        }
    }

    divSearchResult.appendChild(resultUlElement);
});
