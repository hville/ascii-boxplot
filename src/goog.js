/* global google */
/* eslint no-console: 0 */
var h = require('@private/dom-co')

var goo = null
		//pok = null,

module.exports = function init(store, callback) {
	if (typeof google === 'undefined') return window.onload = init.bind(null, store, callback)
	goo = google.maps
	//pok = goo.places.PlacesServiceStatus.OK
	//srv = goo.places.PlacesService(map.el)
	callback({
		map: createMapCo('map', store),
		city: createCityCo('city', store)
	})
}

function createMapCo(id, store) {
	var el = document.getElementById(id),
			gm = new google.maps.Map(el, {
				zoom: store().map.zoom,
				center: store().map.city.location
			}),
			hot = new google.maps.visualization.HeatmapLayer(gm),
			hotStore = store.sub('heatMap'),
			co = h(el, {
				store: store,
				view: function(n, p) {
					if (!this.store.has(p)) return
					if (gm.getZoom() !== n.map.zoom) gm.setZoom(n.map.zoom)
					if (gm.getCenter() !== n.map.city.location) gm.setCenter(n.map.city.center)
					if (hotStore.has(p)) hot.setOptions(hotStore.get('options'))
				}
			})
	gm.addListener('zoom_changed', function() {
		console.log('google-zoom-changed event')
		co.act([['r', ['zoom'], gm.getZoom()]])
	})
	gm.addListener('center_changed', function() {
		console.log('google-center-changed event')
		co.act([['r', ['city', 'location'], gm.getCenter()]])
	})
	return co
}

function createCityCo(id, store) {
	var el = document.getElementById(id),
			ac = new goo.places.Autocomplete(el, {types: ['(cities)']}),
			//srv = new goo.places.AutocompleteService(),
			co = h(el, {
				store: store.sub('city'),
				view: function(n, p) {
					if (!this.store.has(p)) return
					if (this.el.value !== n.name) this.el.value = n.name
				}
			})
	ac.addListener('place_changed', function() {
		var place = ac.getPlace()
		console.log('google-place-changed event')
		if (place && place.geometry && place.geometry.location) co.store.set({
			id: place.place_id,
			name: place.name,
			location: place.geometry.location
		})
		//TODO else .getDetails(.getPlacePrediction(...id))
	})
	return co
}
/*
function changeGradient() {
				var gradient = [
					'rgba(0, 255, 255, 0)',
					'rgba(0, 255, 255, 1)',
					'rgba(0, 191, 255, 1)',
					'rgba(0, 127, 255, 1)',
					'rgba(0, 63, 255, 1)',
					'rgba(0, 0, 255, 1)',
					'rgba(0, 0, 223, 1)',
					'rgba(0, 0, 191, 1)',
					'rgba(0, 0, 159, 1)',
					'rgba(0, 0, 127, 1)',
					'rgba(63, 0, 91, 1)',
					'rgba(127, 0, 63, 1)',
					'rgba(191, 0, 31, 1)',
					'rgba(255, 0, 0, 1)'
				]
				heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
			}
*/
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
