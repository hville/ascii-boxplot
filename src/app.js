'use-strict'
/* global google */
/* eslint no-console:0 */
var h = require('@private/dom-co').htm,
		c = require('@private/dom-co').co,
		viewEl = require('./viewEl'),
		makeStore = require('./store'),
		createMapCo = require('./co-map'),
		createCityCo = require('./co-city')

var components = [],
		store = makeStore(components)

document.body.appendChild(viewEl)
document.getElementById('google').addEventListener('load', onGoo, true)

		//elInputType = document.getElementById('type'),
		//elInputType = document.getElementById('options'),

function onGoo() {
	var mapEl = document.getElementById('gmap'),
			mapStore = store.sub('map'),
			cityStore = mapStore.sub('city')
	var gmap = new google.maps.Map(mapEl, {
		//zoom: mapStore.get().zoom,
		//center: cityStore.get().location
	})
	var mapCo = createMapCo({
		el: mapEl,
		store: mapStore,
		gmap: gmap
	})
	var locCo = createCityCo({
		el: document.getElementById('city'),
		store: cityStore,
		gmap: gmap
	})
	var footCo = c(document.getElementById('footer'), {
		store: store.sub('log'),
		view: function(n, o, ms) {
			this.el.appendChild(h('li', 'render : ' + ms.toFixed(0)))
		}
	})
	components.push(mapCo, locCo, footCo)
}

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
