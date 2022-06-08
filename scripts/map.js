// --- Global ---
// Global variables for accessing museum information
const MUSEUMS = [];


// --- Rendering Leaflet map ---

// Create Leaflet map
let centerPoint = [1.3521, 103.8198];
const map = createMap(centerPoint[0], centerPoint[1], 'map');

// Create Leaflet marker cluster group
let markerCluster = L.markerClusterGroup();
markerCluster.addTo(map);

// Render museum markers
(async function() {
    let museums = await getMuseums();
    let museumLayer = L.geoJson(museums, {
        'pointToLayer': function(feature, latlng) {
            return L.marker(latlng, {icon: museumIcon});
        },

        'onEachFeature': function(feature, layer) {
            let museum = getMuseumInfo(feature.properties.Description)
            let museumCoordinates = feature.geometry.coordinates.slice(0,2);
            museum['coordinates'] = museumCoordinates;
            
            // Populate global MUSEUM variable with museum object
            MUSEUMS.push(museum);

            layer.bindPopup(`
                <h3 class="museum-name">${museum.name}</h3>
                <p class="museum-description">${museum.description}</p>
                <address class="museum-address">${museum.address}</address>
                <button class="btn-start" onclick="setStartPoint(${museum.coordinates[0]}, ${museum.coordinates[1]}, 'start')">Set as start point</button>
                <button class="btn-end" onclick="setStartPoint(${museumCoordinates[0]}, ${museumCoordinates[1]}, 'end')">Set as end point</button>
                ${museumCoordinates}
            `);
        }
    });

    museumLayer.addTo(markerCluster);

})();


