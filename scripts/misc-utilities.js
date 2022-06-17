// --- Miscellaneous Helper Functions ---
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

// Function to create HTML element for content display
function createContentDiv(contentObj, option) {
    // Set up HTML element to insert into marker popup
    let div = document.createElement('div');

    // Set up content depending on option
    // Display distance information
    let distanceContent = '';
    if (option.displayDistance) {
        distanceContent = `
            <span class="marker--distance">
                Distance: ${contentObj.distance}m
            </span>
        `;
    }

    // -> Concise content for markers
    if (option.concise) {
        div.classList.add('container--marker-content');
        div.innerHTML = `
            <h3 class="marker--header">${contentObj.name}</h3>
            ${distanceContent}
            <div class="marker--container-button">
                <button class="btn btn-sm btn-start marker--btn">Set as origin</button>
                <button class="btn btn-sm btn-end marker--btn">Set as destination</button>
            </div>
        `;
    }
    // -> Detailed content
    else {
        div.classList.add('container--content');
        div.innerHTML = `
            <img class="content--img img-fluid" src="${contentObj.imageUrl}" alt="Photo of museum" />
            <h3 class="content--name">${contentObj.name}</h3>
            <div class="content--container-button">
                <button class="btn btn-sm btn-start content--btn">Set as origin</button>
                <button class="btn btn-sm btn-end content--btn">Set as destination</button>
            </div>
            <p class="content--description">${contentObj.description}</p>
            <address class="content--address">${contentObj.address}</address>
        `;
    }

    // Add event listener to buttons
    div.querySelector('.btn-start').addEventListener('click', function () {
        setNavigationPoint(contentObj.coordinates, contentObj.name, 'start');
    });
    div.querySelector('.btn-end').addEventListener('click', function () {
        setNavigationPoint(contentObj.coordinates, contentObj.name, 'end');
    });

    return div;
}

// Function to toggle state of toggle buttons for drawers
function changeToggleBtnState(button, drawer) {
    // Check state of drawer
    if (drawer.dataset.expand == 'true') {
        button.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        drawer.dataset.expand = 'false';
    }
    else {
        button.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
        drawer.dataset.expand = 'true';
    }
}

// Function to show selected tab and hide all other tabs
function showTabContent(tabClassName) {
    // Make navigation tab visible and hide all other tabs
    let tabs = document.querySelectorAll('.tab');
    for (let tab of tabs) {
        if (tab.classList.contains(tabClassName)) {
            tab.classList.remove('invisible');
        }
        else {
            if (!tab.classList.contains('invisible')) {
                tab.classList.add('invisible');
            }
        }
    }
}

// Function to make Bootstrap tab show and hide other tabs
// -> Bootstrap tabs are implemented as a sub-tab in search console
function showSubTabContent(tabId, tabContentId) {
    // Local function to check if tab is active
    function isActive(tab) {
        if (tab.classList.contains('active') && tab.classList.contains('show')) {
            return true;
        }
        return false;
    }

    // Unselect all tabs except for selected tab to be displayed
    let tabs = document.querySelectorAll('.nav-link');
    for (let tab of tabs) {
        // Show selected tab as active
        if (tab.id == tabId) {
            // Add active class if tab is not already active
            if (!tab.classList.contains('active')) {
                tab.classList.add('active');
            }
        }
        else {
            tab.classList.remove('active');
        }
    }

    // Hide all tab contents (except for selected tab content)
    let tabContents = document.querySelectorAll('.tab-pane');
    for (let tabContent of tabContents) {
        if (tabContent.id == tabContentId) {
            // Show selected tab if it is not being displayed
            if (!isActive(tabContent)) {
                tabContent.classList.add('show');
                tabContent.classList.add('active');
            }
        }
        else {
            tabContent.classList.remove('show');
            tabContent.classList.remove('active');
        }
    }
}

// Function to collapse console drawer
function collapseConsoleDrawer() {
    // Update state of console drawer and state of toggle button
    let consoleDrawer = document.querySelector('.console--drawer');
    consoleDrawer.dataset.expand = 'true'; // so that changeToggleBtnState can update both states accordingly

    // -> Collapse console drawer (if expanded)
    consoleDrawer.classList.add('console--drawer-collapse');
    consoleDrawer.classList.remove('console--drawer-expand');

    let btnToggleConsoleDrawer = document.querySelector('#btnToggleConsoleDrawer');
    changeToggleBtnState(btnToggleConsoleDrawer, consoleDrawer); // update both states of console drawer and toggle button
}

// Function to expand console drawer
function expandConsoleDrawer() {
    // Update state of console drawer and state of toggle button
    let consoleDrawer = document.querySelector('.console--drawer');
    consoleDrawer.dataset.expand = 'false'; // so that changeToggleBtnState can update both states accordingly

    // -> Expand console drawer (if collapsed)
    consoleDrawer.classList.add('console--drawer-expand');
    consoleDrawer.classList.remove('console--drawer-collapse');

    let btnToggleConsoleDrawer = document.querySelector('#btnToggleConsoleDrawer');
    changeToggleBtnState(btnToggleConsoleDrawer, consoleDrawer); // update both states of console drawer and toggle button
}

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
    if (email[email.length - 1] == '.') {
        return false;
    }

    // If email passes the above checks, consider it valid 
    return true;
}