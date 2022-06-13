mapboxgl.accessToken = 'pk.eyJ1IjoicmViZWNjYWJ1ZWhsZXIiLCJhIjoiY2w0ZDB6Z2FuMDJrcTNjcXl3b2NwaDVzbCJ9.NvnkMS75q0B6XZlzWNet3g'

var map;
var markers = [];

//loading the map

function init() {
	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [-71.091525, 42.353350],
		zoom: 14
	});
	addMarkers();
}

//adding the bus markers to the map
async function addMarkers(){

	markers.forEach((marker, index) => {
		markers[index].remove()
		if (index === markers.length - 1) {
			markers = []
		}
	});
	//get bus data
	var locations = await getBusLocations();

	//loop through the data to find where the markers go
	locations.forEach(function(bus) {
		var marker = getMarker(bus.id);

		if(marker) {
			moveMarker(marker, bus);
		} else {
			addMarker(bus);
		}
	});

	//timer
	console.log(new Date());
	setTimeout(addMarkers, 15000);
}
 
async function run(){
    // get bus data    
	const locations = await getBusLocations();
	console.log(new Date());
	console.log(locations);

	// timer
	setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

function addMarker(bus) {
	var lng = bus.attributes.longitude;
	var lat = bus.attributes.latitude;
	var marker = new mapboxgl.Marker()
		.setLngLat([lng, lat])
		.addTo(map);
	markers.push(marker);
}


function moveMarker(marker, bus) {
	//move icon to new position
	marker.setPosition( {
		lat: bus.attributes.latitude,
		lng: bus.attributes.longitude
	});
}

function getMarker(id) {
	var marker = markers.find(function(item) {
		return item.id === id;
	});
	return marker;
}

window.onload = init;