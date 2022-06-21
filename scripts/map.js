// --- Global ---
// Global variables for accessing museum information
const MUSEUMS = [];

// Global variables for navigation
let START_COORDINATES = null;
let END_COORDINATES = null;

// Global variable to store user's current location marker
let USER_MARKER = null;

// --- Rendering Leaflet map ---
const CENTERPOINT = [1.3521, 103.8198]; // Singapore's latlng as center point
const map = createMap(CENTERPOINT, 'map');

// --- Set up Leaflet layer groups ---
// Museum marker cluster group
const markerCluster = L.markerClusterGroup().addTo(map);

// Layer for displaying markers of nearby amenities and radius circle
const amenitiesLayer = L.layerGroup().addTo(map);

// Layer for displaying navigation routes
const navigationLayer = L.layerGroup().addTo(map);

// Set up layer controls
const layerControl = L.control.layers({}, {
    'Nearby Amenities': amenitiesLayer,
    'Navigation Route': navigationLayer
}).addTo(map);


// --- Positioning of Leaflet controls ---
// Position Leaflet attribution
map.attributionControl.setPosition('bottomleft');

// Position Leaflet controls
setLeafletControlPosition();
// Re-position Leaflet controls if window resizes
window.addEventListener('resize', function() {
    setLeafletControlPosition();
});

// Render all museum markers
renderAllMuseumMarkers(museumIcon, markerCluster);

// Search bar interactions
// Search bar - search button click
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
    showTabContent('tab--navigation');
    expandConsoleDrawer();
})

// Toggle expand/collapse of search bar console drawer component
let btnToggleConsoleDrawer = document.querySelector('#btnToggleConsoleDrawer');
btnToggleConsoleDrawer.addEventListener('click', function () {
    // Check state of console drawer
    let consoleDrawer = document.querySelector('.console--drawer');

    // Toggle visibility of console drawer depending on state
    if (consoleDrawer.dataset.expand == 'true') {
        collapseConsoleDrawer(); // collapse console drawer if currently in expanded state
    }
    else {
        expandConsoleDrawer(); // expand console drawer if currently in collapsed state
    }
})

// Display polyline route of start to end point when user clicks on 'Get route' button
document.querySelector('#btnGetRoute').addEventListener('click', async function() {
    // Set error flag
    let routeError = false;

    let origin = null;
    let destination = null;
    
    // Get transport mode
    let mode = document.querySelector('.transport-mode:checked').value;
    
    // Check if start point has been selected
    let errorStart = document.querySelector('#error-start');
    if (START_COORDINATES == null) {
        errorStart.innerHTML = 'Please select a start point';
        routeError = true;
    }
    else {
        errorStart.innerHTML = '';
        origin = START_COORDINATES.join(',');
    }

    // Check if End point has been selected
    let errorEnd = document.querySelector('#error-end');
    if (END_COORDINATES == null) {
        errorEnd.innerHTML = 'Please select a destination';
        routeError = true;
    }
    else {
        errorEnd.innerHTML = '';
        destination = END_COORDINATES.join(',');
    }

    // Check that Start and End points are different (when start/end points have been selected)
    if (origin == destination && destination != null) {
        errorEnd.innerHTML = 'Please select an end point that is different from start point';
        routeError = true;
    }

    // Get navigation information if there are no errors above
    if (!routeError) {
        // Clear previous routes
        navigationLayer.clearLayers();

        let navigationInfo = await getNavigation(mode, origin, destination);
        
        // Get encoded polyline
        let encodedPolyline = navigationInfo.data.routes[0].overview_polyline.points; 

        // Display polyline on map
        let polyline = L.Polyline.fromEncoded(encodedPolyline).addTo(navigationLayer);
        polyline.setStyle({
            'color':'red'
        })
        map.fitBounds(polyline.getBounds());
    }

})

// Display user's location when clicking on geolocate icon
document.querySelector('#icon-location').addEventListener('click', function() {
    // Render user location marker on map
    getUserLocation();
});

// Toggle showing of help form when clicking on help icon
let btnHelp = document.querySelector('#icon-help');
btnHelp.addEventListener('click', function() {
    let helpBox = document.querySelector('.container-help');
    helpBox.classList.add('slide-up');
    helpBox.classList.remove('slide-down');

    // Hide help icon
    btnHelp.classList.add('invisible');
})

// Toggle hiding of help form when clicking on close icon
document.querySelector('#icon-close').addEventListener('click', function() {
    let helpBox = document.querySelector('.container-help');
    helpBox.classList.add('slide-down');
    helpBox.classList.remove('slide-up');

    // Make help icon visible again
    btnHelp.classList.remove('invisible');
})

// Validation for help form
document.querySelector('#btnHelpSubmit').addEventListener('click', function() {
    // Set up flags
    // (Note: The flag variables are currently not used but will be useful for future implementations of validation rules)
    let invalidName = false;
    let invalidEmail = false;
    let invalidDescription = false;

    // Select error message tags
    let errorName = document.querySelector('#error-name')
    let errorEmail = document.querySelector('#error-email')
    let errorDescription = document.querySelector('#error-description')

    // Valid name if name does not contain any numbers or special characters (except apostrophe ' and dash -)
    let nameInput = document.querySelector('#txtName').value;
    if (isValidName(nameInput)) {
        errorName.innerHTML = ''; // Clear error message if valid name
    }
    else {
        invalidName = true;
        errorName.innerHTML = `Only alphabets, apostrophes (') and dashes(-) are allowed`;
    }

    // Check if email is valid
    let emailInput = document.querySelector('#txtEmail').value;
    if (isValidEmail(emailInput)) {
        errorEmail.innerHTML = '';
    }
    else {
        invalidEmail = true;
        errorEmail.innerHTML = `Invalid email address`;
    }

    // Check if there is any description input by user
    let descriptionInput = document.querySelector('#txtDescription').value;
    if (!descriptionInput.trim()) {
        invalidDescription = true;
        errorDescription.innerHTML = `Please enter description`;
    }
    else {
        errorDescription.innerHTML = '';
    }

});