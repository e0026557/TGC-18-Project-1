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

// Render all museum markers
renderAllMuseumMarkers();

// Search bar interactions
// Search bar - search button click
let searchMuseumLayer = L.layerGroup();
document.querySelector('#btnSearch').addEventListener('click', function () {
    displayMuseumResults();
});

// Search bar - autocomplete feature
let searchMuseumInput = document.querySelector('#txtSearch');
searchMuseumInput.addEventListener('keyup', function() {
    displayAutocompleteResults();
});


// Toggle expand/collapse of search bar drawer component
let btnToggleSearchDrawer = document.querySelector('#btnToggleSearchDrawer');
btnToggleSearchDrawer.addEventListener('click', function () {
    // Check state of drawer
    let searchDrawer = document.querySelector('.console--drawer');

    // Change state of toggle button of search drawer
    changeToggleBtnState(btnToggleSearchDrawer, searchDrawer);

    // Select all tabs in drawer
    let tabs = searchDrawer.querySelectorAll('.tab');

    // Toggle visibility of tabs
    for (let tab of tabs) {
        tab.classList.toggle('invisible');
    }
})