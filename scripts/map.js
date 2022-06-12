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

// Function for checking if name is valid (assuming English context only)
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

// TODO
// Function to validate email address

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
    if (!isValidName(nameInput)) {
        invalidName = true;
        errorName.innerHTML = `Only alphabets and special characters such as ' and - are allowed.`;
    }
    else {
        errorName.innerHTML = ''; // Clear error message if valid name
    }

    // TODO: validate email

});