module.exports = {
	map: { // from cityAutoComplete to Map
		city: {
			id: null,	// cityCo
			address: 'ho chi minh, district 2', // cityCo
			name: 'ho chi minh, district 2', // cityCo -> cityCo
			location: {lat: -34.397, lng: 150.644}, // cityCo & mapCo -> mapCo
		},
		zoom: 12, // mapCo -> mapCo
		heatMap: {
			bias: 0,
			factor: 1,
			options: { //heatmap.setOptions()
				data: [], //{location, weight}
				dissipating: true, //default true(shape independent of zoom) false(shape grows on zoom)
				//gradient: [] array of CSS color strings. All CSS3 colors except for extended named colors
				//maxIntensity: 10,
				opacity: 0.5, //default 0.6
				radius: 20 //datapoint in pixels
			}
		},
		search: {
			radius: 10000,
		}
	},
	log: [],
	types: {
		airport: -3,
		art_gallery: 4,
		atm: 1,
		bakery: 3,
		bank: 1,
		bar: 2,
		bicycle_store: 2,
		book_store: 3,
		bus_station: 1,
		cafe: 9,
		campground: -1,
		car_dealer: -1,
		car_rental: -1,
		car_repair: -2,
		car_wash: -2,
		cemetery: 2,
		church: 1,
		embassy: 2,
		furniture_store: -1,
		gas_station: -3,
		gym: 1,
		laundry: 1,
		library: 2,
		liquor_store: 1,
		lodging: 2,
		museum: 4,
		night_club: 2,
		park: 4,
		parking: 1,
		pharmacy: 1,
		restaurant: 5,
		rv_park: -1,
		school: 1,
		stadium: -1,
		storage: -1,
		store: 2,
		subway_station: 5,
		taxi_stand: 2,
		train_station: 6,
		transit_station: 7,
		university: 8
	}
}
