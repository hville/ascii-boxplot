/* global google */
/* eslint no-console: 0 */
var c = require('@private/dom-co')

module.exports = function(opts) {	//el, store, gmap
	var ac = new google.maps.places.Autocomplete(opts.el, {types: ['(cities)']}),
			okSt = google.maps.places.PlacesServiceStatus.OK,
			acSrv = new google.maps.places.AutocompleteService(),
			plSrv = new google.maps.places.PlacesService(opts.gmap)
	var co = c(opts.el, {
		store: opts.store,
		view: function(n) {
			if (this.el.value !== n.name) this.el.value = n.name
		}
	})
	function setPlace(place) {
		//console.log('setting place:', place.geometry.location)
		co.store.set({
			id: place.place_id,
			name: place.name,
			location: place.geometry.location
		})
	}
	function completeInput(predictions, status) {
		var place = Array.isArray(predictions) ? predictions[0] : predictions
		if (status === okSt) {
			//console.log(predictions)
			if (place.geometry) setPlace(place)
			else plSrv.getDetails(place, completeInput)
		}
	}
	ac.addListener('place_changed', function() {
		var place = ac.getPlace()
		//console.log('google-place-changed event')

		if (place.geometry) co.store.set(place)
		else acSrv.getQueryPredictions(
			{input: place.name, types: ['(cities)']},
			completeInput
		)
	})
	return co
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
