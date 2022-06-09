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
map.zoomControl.setPosition('topright'); // Set zoom controls to be on the topright corner

// Create Leaflet marker cluster group
let markerCluster = L.markerClusterGroup();
markerCluster.addTo(map);

let layers = {};

// Render all museum markers
(async function () {
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
            ${museum.coordinates}
            `);

            // Populate global MUSEUM variable with museum object
            MUSEUMS.push(museum);
        }
    });
    layers.museumLayer = museumLayer;
    museumLayer.addTo(markerCluster);

})();


// Search museums
let searchMuseumLayer = L.layerGroup();
document.querySelector('#btnSearch').addEventListener('click', function () {
    // Extract search query
    let query = document.querySelector('#txtSearch').value.toLowerCase();

    // Clear previous search results
    let divSearchResult = document.querySelector('#searchResult');
    divSearchResult.innerHTML = '';

    // Create Ul element to store search results as list
    let resultUlElement = document.createElement('ul');
    let resultsFound = false; // State variable to check if there are search results or not

    // Iterate through MUSEUM array to check if query matches 
    for (let museum of MUSEUMS) {
        if (museum.name.toLowerCase().includes(query)) {
            // Update state variable
            resultsFound = true;

            // Create result li element
            let resultLiElement = document.createElement('li');
            resultLiElement.innerHTML = museum.name;
            resultLiElement.addEventListener('click', function () {
                // Fly to selected museum marker
                map.flyTo(museum.coordinates, 18);
                // Tell markerCluster to show selected museum marker and open popup
                markerCluster.zoomToShowLayer(museum.layer, function(){
                    museum.layer.openPopup();
                })
            });

            resultUlElement.appendChild(resultLiElement);
        }
    }

    // Return a message if query does not match all museum names
    if (!resultsFound) {
        resultUlElement.innerHTML = '<li>No results found.</li>';
    }

    divSearchResult.appendChild(resultUlElement);
});


// Toggle expand/collapse of search bar drawer component
let btnToggleSearchDrawer = document.querySelector('#btnToggleSearchDrawer');
btnToggleSearchDrawer.addEventListener('click', function() {
    // Check state of drawer
    let searchDrawer = document.querySelector('.container-search--drawer');
    if (searchDrawer.dataset.expand == 'true') {
        btnToggleSearchDrawer.innerHTML = 'Open';
        searchDrawer.dataset.expand = 'false';
    }
    else {
        btnToggleSearchDrawer.innerHTML = 'Close';
        searchDrawer.dataset.expand = 'true';
    }

    // Select all tabs in drawer
    let tabs = searchDrawer.querySelectorAll('.tab');

    // Toggle visibility of tabs
    for (let tab of tabs) {
        tab.classList.toggle('invisible');
    }
})