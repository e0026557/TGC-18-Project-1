// Function to change placeholder text in search bar for mobile screen width and larger screen widths
function changePlaceholderText(elementId, longText, shortText) {
    if (window.innerWidth < 300) {
        document.querySelector(`#${elementId}`).placeholder = shortText;
    }
    else {
        document.querySelector(`#${elementId}`).placeholder = longText;
    }
}