// Change search bar's placeholder text depending on screen width
changePlaceholderText('txtSearch', 'Search Museums@SG', 'Search');
window.addEventListener('resize', function() {
    changePlaceholderText('txtSearch', 'Search Museums@SG', 'Search ...');
});