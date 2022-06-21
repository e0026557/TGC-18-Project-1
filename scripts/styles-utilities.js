// Function to change placeholder text in search bar for mobile screen width and larger screen widths
function changePlaceholderText(elementId, longText, shortText) {
    if (window.innerWidth < 300) {
        document.querySelector(`#${elementId}`).placeholder = shortText;
    }
    else {
        document.querySelector(`#${elementId}`).placeholder = longText;
    }
}

// Function to change button text for mobile screen width and larger screen widths
function changeButtonText(buttonId, longText, shortText) {
    let button = document.querySelector(`#${buttonId}`);
    if (window.innerWidth < 300) {
        button.innerHTML = shortText;
    }
    else {
        button.innerHTML = longText;
    }
}

// Function to change multiple button texts
function changeMultipleButtonText(buttonArr) {
    for (let button of buttonArr) {
        changeButtonText(button.id, button.longText, button.shortText);
    }
}