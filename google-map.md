# TODO
* site spcific key
* dev key: AIzaSyAaQ9WZRglsGpwHYxLtOMn50JvpLbSTszk
* https://console.developers.google.com/apis/credentials?project=hvilleheatmaptst

# COST AND LIMITS
## Google Maps JavaScript && Google Static Maps & Google Street View Image
*	0 Free until exceeding 25,000 map loads per day for 90 consecutive days
*	$0.50 USD / 1,000 additional map loads above 25,000 per day after reaching 25,000 map load / 90 day usage limit, up to 1,000,000 daily
* Google Maps: Directions / Distance Matrix / Elevation / Geocoding / Geolocation / Roads / Time Zone
	-	0 Free up to 2,500 requests per day
	-	$0.50 USD / 1,000 additional requests, up to 100,000 daily
*Google Places
	-	150,000 free requests per day (after credit card validation)
* Heatmap Layer in Google Maps JavaScript API, part of the google.maps.visualization

# Places Library
## Searches
* service.nearbySearch(request, callback)
	- location: LatLngBounds OR LatLng object — and a radius, measured in meters integer < 50 000 meters
	- 20 results, 3 pagination = 60 points/search
	- Place Details: detailed information about a specific place, including user reviews
*	service.radarSearch(request, callback)
	- 20 results, 3 pagination = 60 points/search
*	service.radarSearch(request, callback)
	- less details
	- 200 results

