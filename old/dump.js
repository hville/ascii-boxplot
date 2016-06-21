function performSearch() {
	var request = {
		bounds: map.getBounds(),
		keyword: 'best view'
	};
	service.radarSearch(request, callback);
}

function callback(results, status) {
	if (status !== google.maps.places.PlacesServiceStatus.OK) {
		console.error(status);
		return;
	}
	for (var i = 0, result; result = results[i]; i++) {
		addMarker(result);
	}
}

function addMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: {
			url: 'http://maps.gstatic.com/mapfiles/circle.png',
			anchor: new google.maps.Point(10, 10),
			scaledSize: new google.maps.Size(10, 17)
		}
	});

	google.maps.event.addListener(marker, 'click', function() {
		service.getDetails(place, function(result, status) {
			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				console.error(status);
				return;
			}
			infoWindow.setContent(result.name);
			infoWindow.open(map, marker);
		});
	});
}



function addMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: {
			url: 'http://maps.gstatic.com/mapfiles/circle.png',
			anchor: new google.maps.Point(10, 10),
			scaledSize: new google.maps.Size(10, 17)
		}
	});

	google.maps.event.addListener(marker, 'click', function() {
		service.getDetails(place, function(result, status) {
			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				console.error(status);
				return;
			}
			infoWindow.setContent(result.name);
			infoWindow.open(map, marker);
		});
	});
}

var heatmapData = [
		{location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
		new google.maps.LatLng(37.782, -122.445),
		{location: new google.maps.LatLng(37.782, -122.443), weight: 2},
		new google.maps.LatLng(37.782, -122.437),
		{location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},
		{location: new google.maps.LatLng(37.785, -122.447), weight: 5},
		{location: new google.maps.LatLng(37.785, -122.445), weight: 2},
		new google.maps.LatLng(37.785, -122.443),
		{location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
		new google.maps.LatLng(37.785, -122.439),
		{location: new google.maps.LatLng(37.785, -122.437), weight: 2},
		{location: new google.maps.LatLng(37.785, -122.435), weight: 3}
	]