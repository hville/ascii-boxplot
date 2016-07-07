/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

var user = __webpack_require__(3),
		Store = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./mini-store\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

module.exports = UserStore

function weightSorter(a, b) {
	return Math.abs(user.types[b]) - Math.abs(user.types[a])
}

function typesMapper(name) {
	return { name: name, weight: user.types[name] }
}

function UserStore(cb) {
	for (var key in user) {
		if (localStorage[key]) user[key] = JSON.parse(localStorage[key])
		else localStorage[key] = JSON.stringify(user[key])
	}

	user.meta = ''
	user.list = Object.keys(user.types).sort(weightSorter).map(typesMapper) //[{name, weight}]
	user.hmap = [] //{id, loc, typ, wgt}

	return Store(user, function(n,p,o) {
		for (var k in n) {
			if (n[k] !== o[k]) localStorage[k] = JSON.stringify(n[k])
		}
		cb(n,p,o)
	})
}


/***/ },
/* 1 */
/***/ function(module, exports) {

/* global google */

var goo = null,
		//pok = null,
		map = null,
		//srv = null,
		//typ = [],
		src,
		//lst = [],
		city

module.exports = function init(store, callback) {
	if (typeof google === 'undefined') return window.onload = init.bind(null, store, callback)
	goo = google.maps
	//pok = goo.places.PlacesServiceStatus.OK

	map = createMapCo('map', store)
	src = store
	city = createCityCo('city')
	//srv = goo.places.PlacesService(map.el)
	callback({map: map, city:city})
}

function createMapCo(id, store) {
	var el = document.getElementById(id),
			hot = new google.maps.visualization.HeatmapLayer()

	var gm = new google.maps.Map(el, {
		zoom: 8,
		center: {lat: -34.397, lng: 150.644}
	})

	gm.addListener('zoom_changed', function() {
		store([['r', ['mapOptions', 'zoom'], gm.getZoom()]])
	})
	gm.addListener('center_changed', function() {
		store([['r', ['mapOptions', 'center'], gm.getCenter()]])
	})
	return {
		el: el,
		view: function(n, p, o) {
			//if (n.mapOptions.center !== o.mapOptions.center) gm.setCenter({lat: -34.397, lng: 150.644})
			if (n.mapOptions.zoom !== o.mapOptions.zoom) gm.setZoom(n.mapOptions.zoom)
			if (n.heatMap !== o.heatMap) hot.setOptions(n.heatMap)
			if (!hot.getMap()) hot.setMap(gm)
		},
		store: function() {},
		on: {}
	}
}

function createCityCo(id) {
	var el = document.getElementById(id),
			ac = new goo.places.Autocomplete(el, {types: ['(cities)']})

	ac.addListener('place_changed', function() {
		var place = ac.getPlace()
		console.log('place_changed', place, place.address_components)
		src([
			['r',	['city'], {
				id: place.place_id,
				address: place.address_components[1],
				name: place.name,
				location: place.geometry.location
			}],
			['a', ['log', '-'], 'AutoComplete getPlace(): '+place.toString()]
		])
	})

	return {
		el: el,
		view: function() { console.log('ac view')}
	}
}

/*function getTyp(ctr, key, rad) {
	ctx.typ.push(key)
	//console.log('SEARCHING type '+key+' in '+ctr.toString(), 'meta')
	ctx.srv.radarSearch({
		location: ctr, //OR bounds: map.getBounds()
		radius: rad,
		type: key
	}, function(res, status) {
		if (status !== ctx.pok) return callback('err', 'radarSearch error')
		ctx.lst.push(res)
		callback('typ', ctx)
	})
}
*/


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

'use-strict'
/* eslint no-console:0 */

var Data = __webpack_require__(0),
		goog = __webpack_require__(1),
		Co = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./co\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
		viewstore = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"@private/mini-view-store\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

var co = new Co(),
		data = Data(scheduleRender),
		//typeIn = document.getElementById('type'),
		//optsIn = document.getElementById('options'),
		oldState = {},
		newState = {},
		fullPatch = [],
		rafId = NaN

goog(data, function(res) {
	co.register(res.map)
	co.register(res.city)
})

co.register({
	el: document.getElementById('footer'),
	view: function(n, p, o) {
		for (var i=o.log.length; i<n.log.length; ++i) this.el.appendChild(document.createTextNode(n.log[i]))
	}
})

/*function typMapper(ctx) {
	var typ = this.typ
	var types = data.get('types')
	return {
		id: itm.place_id,
		location: itm.geometry.location,
		type: typ,
		weight: types[typ]
	}
}
*/

function scheduleRender(n, p) {
	newState = n
	Array.prototype.push.apply(fullPatch, p)
	if (rafId === null) rafId = window.requestAnimationFrame(render)
}

function render() {
	co.view(newState, fullPatch, oldState)
	oldState = newState
	fullPatch = []
}


/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = {
	city: {
		id: null,
		address: 'ho chi minh, district 2',
		name: 'ho chi minh, district 2',
		location: null
	},
	radius: 10000,
	log: [],
	mapOptions: {
		center: {lat: -34.397, lng: 150.644},
		zoom: 12
	},
	heatMap: {
		data: [],
		opacity: 0.5, //default 0.6
		dissipating: true, //default true(shape independent of zoom) false(shape grows on zoom)
		radius: 20 //datapoint in pixels
	},
	list: [], //{ name: name, weight: user.types[name] }
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


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map