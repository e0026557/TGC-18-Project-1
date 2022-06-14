// --- Global ---
// Global variables for accessing museum information
const MUSEUMS = [];

// Global variables for navigation
let startCoordinates = null;
let endCoordinates = null;

// Global variable to store user's current location marker
let userMarker = null;

// --- Rendering Leaflet map ---
// Create Leaflet map
let centerPoint = [1.3521, 103.8198];
const map = createMap(centerPoint[0], centerPoint[1], 'map');

// Create Leaflet marker cluster group
let markerCluster = L.markerClusterGroup();
markerCluster.addTo(map);

// Create layer to display markers of nearby amenities and radius circle
let amenitiesLayer = L.layerGroup().addTo(map);

// Create layer to display navigation routes
let navigationLayer = L.layerGroup().addTo(map);

// Create layer controls
let layerControl = L.control.layers({}, {
    'Nearby Amenities': amenitiesLayer,
    'Navigation Route': navigationLayer
}).addTo(map);

// Set position of Leaflet controls
adjustLeafletControls()
// If window resizes, adjust position of Leaflet controls accordingly
window.addEventListener('resize', function() {
    adjustLeafletControls()
})

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
    showTabContent('tab--navigation');
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
    if (startCoordinates == null) {
        errorStart.innerHTML = 'Please select a start point';
        routeError = true;
    }
    else {
        errorStart.innerHTML = '';
        origin = startCoordinates.join(',');
    }

    // Check if End point has been selected
    let errorEnd = document.querySelector('#error-end');
    if (endCoordinates == null) {
        errorEnd.innerHTML = 'Please select an end point';
        routeError = true;
    }
    else {
        errorEnd.innerHTML = '';
        destination = endCoordinates.join(',');
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
    // TODO
    // Get user's current coordinates
    let userCoordinates = getUserLocation();
    // Render marker on map
    let newUserMarker = L.marker(userCoordinates, {icon: redIcon}).addTo(map);

    // Remove previous marker on map (if any)
    if (userMarker != null) {
        userMarker.removeFrom(map);
    }

    // Store new user marker
    userMarker = newUserMarker;
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


// Function for checking if name is valid for help form (assuming English context only)
function isValidName(name) {
    // Convert name to lowercase
    let nameWords = name.toLowerCase().split(' '); // Split by whitespaces

    // Check each word of name
    for (let nameWord of nameWords) {
        // Check each char of word
        for (let char of nameWord) {
            // Convert char to ascii code
            let ascii = char.charCodeAt(0);

            // Alphabets are from (97-122), apostrophe (') is 39, and dash (-) is 45
            if ((ascii >= 97 && ascii <= 122) || ascii == 39 || ascii == 45) {
                return true;
            } 
            return false;
        }
    }
    
}

// Function to validate email address for help form
function isValidEmail(email) {
    // Valid email address if there is name@domain.xxx format 
    if (!email.includes('@') || !email.includes('.') || email.includes(' ')) {
        return false;
    }

   // Check that there is only 1 '@' symbol 
   // -> also check that there are no invalid special characters listed below
   let invalidSpecialChars = `"'(),:<>[]\\/\``;
   let count = 0;
   for (let char of email) {
       if (char == '@') {
           count++;
       }
       else if (invalidSpecialChars.includes(char)) {
            return false;
       }
   } 
   if (count > 1) {
       return false;
   }

   // Check that there is a '.' after '@'
   if (email.lastIndexOf('.') < email.indexOf('@')) {
        return false;
   }


   // Check that email does not end with '.'
   if (email[email.length-1] == '.') {
       return false;
   }

   // If email passes the above checks, consider it valid 
   return true;
}

// Validation for help form
document.querySelector('#btnHelpSubmit').addEventListener('click', function() {
    // Set up flags
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
        errorName.innerHTML = `Only alphabets and special characters such as ' and - are allowed`;
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
        errorDescription.innerHTML = `Please enter description`
    }
    else {
        errorDescription.innerHTML = '';
    }

});