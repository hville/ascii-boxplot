/* global google */
var placeService,
		gMap,
		onHoldFcn = null,
		onHoldArgs = [],
		callback

module.exports = {
	postMsg: searchAndMap,
	set onmsg(fcn) { callback = fcn }
}

//ONE-OFF INITIATION CYCLE
window.onload = gMapStart

function onHold() {
	if(arguments.length) {
		onHoldFcn = arguments[0]
		for (var i=1; i<arguments.length; ++i) onHoldArgs.push(arguments[i])
	}	else {
		if (onHoldFcn) onHoldFcn.apply(null, onHoldArgs)
		onHoldFcn = null
		onHoldArgs.length = 0
	}
}

function gMapStart() {
	gMap = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(Math.random()*90-45, Math.random()*180-360),
		zoom: 3
	})
	placeService = new google.maps.places.PlacesService(gMap)
	gMap.addListener('idle', gMapIdle) //debounced
	onHold()
}

function gMapIdle() {} //debounced

// EXPORT
function searchAndMap(location, types, radius) {
	if (!placeService) return onHold(searchAndMap, location, types)
	var context = {
		googlemaps: gMap,
		locationName: location,
		typeList: types, //{name, weight}
		typeResults: [],
		typeIndex: -1,
		searchRadius: radius || 10000,
		locations: [],
		locationIndex: -1,
		places: [],
		status: google.maps.places.PlacesServiceStatus.OK,
		error: null,
		render: null
	}
	placeService.textSearch({query: location}, onLocation.bind(context))
}

function onLocation(res, status) {
	var context = this
	context.locations = res
	if (status !== google.maps.places.PlacesServiceStatus.OK) {
		context.status = status
		context.error = 'location textSearch error'
		return context
	}
	console.log('onLocation: locations:', res)
	context.locationIndex = 0
	searchPlace(context)
}

function searchPlace(context) {
	++context.typeIndex
	if (context.typeIndex >= context.typeList.length) return allDone(context)
	var typeName = context.typeList[context.typeIndex].name,
			city = context.locations[context.locationIndex]

	console.log('SEARCHING', typeName, 'in', city.formatted_address)

	placeService.radarSearch({
		location: city.geometry.location, //OR bounds: map.getBounds()
		radius: context.searchRadius,
		type: typeName
	}, onPlaces.bind(context))
}

function onPlaces(res, status) {
	var context = this
	var typeItem = context.typeList[context.typeIndex]

	if (status !== google.maps.places.PlacesServiceStatus.OK) {
		context.status = status
		context.error = 'radarSearch error'
		return context
	}

	console.log('RECEIVED', res.length, 'results for', typeItem.name)

	context.typeResults[context.typeIndex] = res
	for (var i=0; i<res.length; ++i) {
		context.places.push({
			place_id: res[i].place_id,
			location: res[i].geometry.location,
			type: typeItem.name,
			weight: typeItem.weight
		})
	}
	searchPlace(context)
}

function allDone(context){
	if (context.error) callback(context)
	var heatmapArr = context.places
	var typeHeatMap = new google.maps.visualization.HeatmapLayer({
		data: heatmapArr,
		opacity: 0.5, //default 0.6
		dissipating: true, //default true(shape independent of zoom) false(shape grows on zoom)
		radius: 20 //datapoint in pixels
		//map:gMap
	})
	context.render = function render() {
		gMap.setCenter(context.locations[context.locationIndex].geometry.location)
		gMap.setZoom(12)
		typeHeatMap.setMap(gMap)
	}
	callback(context)
}
