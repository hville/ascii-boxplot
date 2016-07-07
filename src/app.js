'use-strict'
/* eslint no-console:0 */

var user = require('./data'),
		goog = require('./goog'),
		h = require('@private/dom-co'),
		makeStore = require('./store')

var components = [],
		store = makeStore(components)
		//store = viewstore(onStoreChange)
		//elInputType = document.getElementById('type'),
		//elInputType = document.getElementById('options'),

/*
	COMPONENTS REGISTRATION
*/
goog(store.sub('map'), function(res) {
	components.push(res.map, res.city)
})

components.push(h(document.getElementById('footer'), {
	store: store.sub('log'),
	view: function(n, p, o) {
		if (!this.store.has(p)) return
		var lastIndex = o.log && o.log.length || 0
		for (var i=lastIndex; i<n.log.length; ++i) this.el.appendChild(document.createTextNode(n.log[i]))
	}
}))

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
