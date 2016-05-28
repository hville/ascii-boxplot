/* global google */
/* eslint no-console:0 */
var frzr = require('frzr'),
		tableViews = require('./tbl')//,
		//elm = require('./elm')

var type1 = { //in results AND search
	accounting: 0,
	airport: 0,
	amusement_park: 0,
	aquarium: 0,
	art_gallery: 3,
	atm: 1,
	bakery: 3,
	bank: 1,
	bar: 1,
	beauty_salon: 0,
	bicycle_store: 1,
	book_store: 2,
	bowling_alley: 0,
	bus_station: 1,
	cafe: 3,
	campground: 0,
	car_dealer: 0,
	car_rental: 0,
	car_repair: 0,
	car_wash: 0,
	casino: 0,
	cemetery: 1,
	church: 0,
	city_hall: 0,
	clothing_store: 0,
	convenience_store: 0,
	courthouse: 0,
	dentist: 0,
	department_store: 0,
	doctor: 0,
	electrician: 0,
	electronics_store: 0,
	embassy: 1,
	fire_station: 0,
	florist: 0,
	funeral_home: 0,
	furniture_store: 0,
	gas_station: 0,
	grocery_or_supermarket: 0,
	gym: 0,
	hair_care: 0,
	hardware_store: 0,
	hindu_temple: 0,
	home_goods_store: 0,
	hospital: 0,
	insurance_agency: 0,
	jewelry_store: 0,
	laundry: 1,
	lawyer: 0,
	library: 2,
	liquor_store: 0,
	local_government_office: 0,
	locksmith: 0,
	lodging: 1,
	meal_delivery: 0,
	meal_takeaway: 0,
	mosque: 0,
	movie_rental: 0,
	movie_theater: 0,
	moving_company: 0,
	museum: 4,
	night_club: 1,
	painter: 0,
	park: 5,
	parking: 0,
	pet_store: 0,
	pharmacy: 1,
	physiotherapist: 0,
	plumber: 0,
	police: 0,
	post_office: 0,
	real_estate_agency: 0,
	restaurant: 1,
	roofing_contractor: 0,
	rv_park: 0,
	school: 0,
	shoe_store: 0,
	shopping_mall: 0,
	spa: 0,
	stadium: 0,
	storage: 0,
	store: 1,
	subway_station: 2,
	synagogue: 0,
	taxi_stand: 1,
	train_station: 2,
	transit_station: 1,
	travel_agency: 0,
	university: 6,
	veterinary_care: 0,
	zoo: 0
}

//var view = elm.view,
//var	list = elm.list,
//var join = elm.join,
var cell = tableViews.cell,
		inputCell = tableViews.inputCell

var TODOKEY = 'AIzaSyAaQ9WZRglsGpwHYxLtOMn50JvpLbSTszk'
var URLGM = 'https://maps.googleapis.com/maps/api/js?key=' + TODOKEY + '&libraries=visualization,places'
frzr.mount(document.head, frzr.el('script', {src: URLGM, onload: scriptLoadCallback}))
frzr.mount(document.body,
	frzr.el('div', {style: 'width:100%; height:30vh'},
		frzr.el('div', {id:'map', style: 'width:100%; height:100%'})
	)
)

var tableView = tableViews.table//,
//		inputCell = tableViews.inputCell

var placesColumns = [
	{key: 'name', tbody:cell, thead: 'name', tfoot: 'name'},
	{key: 'types', tbody:cell, thead: 'types', tfoot: 'types'}
	//{key: 'location', tbody:view('td'), thead: 'location', tfoot: 'location'},
	//{key: 'score', tbody:inputCell, thead: 'score', tfoot: 'score'}
]
var typesColumns = [
	{key: 'type', tbody:cell, thead: 'types', tfoot: 'types'},
	{key: 'weight', tbody:inputCell, thead: 'weight', tfoot: 'weight'}
]

var placeTable =	tableView({origin: '', columns: placesColumns})
var typesTable =	tableView({origin: '', columns: typesColumns})
typesTable.update(Object.keys(type1).map(function(k){
	return {type: k, weight: type1[k]}
}).sort(function(a,b) {
	return b.weight - a.weight
}))
frzr.mount(document.body, placeTable)
frzr.mount(document.body, typesTable)

var placesData = [],
		placeService,
		gMap,
		gHeatMap

function logLocation(itm) {
	console.log('name:',itm.name, 'types', itm.types.join(','), itm.geometry.location)
	placesData.push(itm)
}
function scriptLoadCallback() {
	google.maps.event.addDomListener(window, 'load', googleMapStart)
}
function myMapIdle() { console.log('myMapIdle') }


// CHAIN
function stringSearch(string) {
	console.log('textSearch init')
	placeService.textSearch({query: string}, nearSearch)
}
function nearSearch(res) {
	res.forEach(logLocation)
	if (google.maps.places.PlacesServiceStatus.OK) console.log('...OK')
	else console.log('...not.OK')
	console.log('nearSearch init')
	placeService.nearbySearch({
		location: res[0].geometry.location,
		radius: 5000
		//keyword: 'park'
	}, nearAction)
}
function nearAction(res, status, pagination) {
	res.forEach(logLocation)
	if (status === google.maps.places.PlacesServiceStatus.OK) console.log('...OK')
	else console.log('...not.OK')
	if (false || pagination.hasNextPage) pagination.nextPage()
	else allDone()
}
function allDone(){
	placeTable.update(placesData)
	var heatmapData2 = placesData.map(function(itm) { return itm.geometry.location })
	gMap.setCenter(heatmapData2[0])
	var gHeatMap2 = new google.maps.visualization.HeatmapLayer({
		data: heatmapData2
	})
	gHeatMap2.setMap(gMap)
	var locs = placesData.reduce(function(res, itm) {
		itm.types.forEach(function(t) { res[t] ? ++res[t] : res[t]=1 })
		return res
	}, {})
	console.log('***DONE***', placesData.length, locs)
}

function googleMapStart() {
	gMap = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(37.782, -122.447),
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	})
	placeService = new google.maps.places.PlacesService(gMap)
	//stringSearch('Kuala Lumpur City Center')

	gMap.addListener('idle', myMapIdle)

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

	gHeatMap = new google.maps.visualization.HeatmapLayer({
		data: heatmapData,
		opacity: 0.4, //default 0.6
		dissipating: true, //default true(shape independent of zoom) false(shape grows on zoom)
		radius: 40, //datapoint in pixels
		map:gMap
	})
	//gHeatMap.setMap(gMap)
}

var type2 = { //in results but not in search
	administrative_area_level_1: 0,
	administrative_area_level_2: 0,
	administrative_area_level_3: 0,
	administrative_area_level_4: 0,
	administrative_area_level_5: 0,
	colloquial_area: 0,
	country: 0,
	establishment: 0,
	finance: 0,
	floor: 0,
	food: 0,
	general_contractor: 0,
	geocode: 0,
	health: 0,
	intersection: 0,
	locality: 0,
	natural_feature: 0,
	neighborhood: 0,
	place_of_worship: 0,
	political: 0,
	point_of_interest: 0,
	post_box: 0,
	postal_code: 0,
	postal_code_prefix: 0,
	postal_code_suffix: 0,
	postal_town: 0,
	premise: 0,
	room: 0,
	route: 0,
	street_address: 0,
	street_number: 0,
	sublocality: 0,
	sublocality_level_4: 0,
	sublocality_level_5: 0,
	sublocality_level_3: 0,
	sublocality_level_2: 0,
	sublocality_level_1: 0,
	subpremise: 0
}
