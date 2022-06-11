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

// Create layer to display markers of nearby amenities and radius circle
let amenitiesLayer = L.layerGroup().addTo(map);

// Create layer controls
L.control.layers({}, {
    'Nearby Amenities': amenitiesLayer
}).addTo(map);

// Render all museum markers
renderAllMuseumMarkers();

// Search bar interactions
// Search bar - search button click
let searchMuseumLayer = L.layerGroup();
document.querySelector('#btnSearch').addEventListener('click', async function () {
    await displayMuseumResult();
});

// Search bar - autocomplete feature & 'enter' to search feature
let searchMuseumInput = document.querySelector('#txtSearch');
searchMuseumInput.addEventListener('keyup', async function (event) {
    if (event.key == 'Enter') {
        await displayMuseumResult();
    }
    else {
        displayAutocompleteResults();
    }
});

// Search bar - navigation button click
document.querySelector('#btnNavigation').addEventListener('click', function() {
    showNavigationContent();
})

// Toggle expand/collapse of search bar drawer component
let btnToggleSearchDrawer = document.querySelector('#btnToggleSearchDrawer');
btnToggleSearchDrawer.addEventListener('click', function () {
    // Check state of drawer
    let searchDrawer = document.querySelector('.console--drawer');

    // Change state of toggle button of search drawer
    changeToggleBtnState(btnToggleSearchDrawer, searchDrawer);

    // Toggle visibility of drawer depending on state
    if (searchDrawer.dataset.expand == 'true') {
        searchDrawer.classList.add('console--drawer-expand');
        searchDrawer.classList.remove('console--drawer-collapse');
    }
    else {
        searchDrawer.classList.add('console--drawer-collapse');
        searchDrawer.classList.remove('console--drawer-expand');
    }
})

// Toggle showing of help form when clicking on help icon
document.querySelector('#icon-help').addEventListener('click', function() {
    let helpBox = document.querySelector('.container-help');
    helpBox.classList.remove('invisible');
})

// Toggle hiding of help form when clicking on close icon
document.querySelector('#icon-close').addEventListener('click', function() {
    let helpBox = document.querySelector('.container-help');
    helpBox.classList.add('invisible');
})