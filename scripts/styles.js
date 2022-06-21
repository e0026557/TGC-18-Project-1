// Button texts for console drawer tabs
const tabButtons = [
     {
        'id': 'tab-museum',
        'shortText': `<i class="fa-solid fa-building-columns"></i>`,
        'longText': `Museum`
    },
    {
        'id': 'tab-weather', 
        'shortText': `<i class="fa-solid fa-cloud"></i>`,
        'longText': `Weather`
    },
    {
        'id': 'tab-nearby',
        'shortText': `<i class="fa-solid fa-tree-city"></i>`,
        'longText': `Nearby`
    },
];

// Change tab button's text depending on screen width
changeMultipleButtonText(tabButtons);

// Change search bar's placeholder text depending on screen width
changePlaceholderText('txtSearch', 'Search Museums@SG', 'Search');


window.addEventListener('resize', function() {
    changePlaceholderText('txtSearch', 'Search Museums@SG', 'Search ...');
    changeMultipleButtonText(tabButtons);
});