'use-strict'
var user = require('./data'),
		viewStore = require('@private/mini-view-store'),
		assign = require('object-assign')

var viewState = {}

module.exports = function (components) {
	//for (var key in user) {
		//if (localStorage[key]) user[key] = JSON.parse(localStorage[key])
		//else localStorage[key] = JSON.stringify(user[key])
	//}

	viewState = user

	return viewStore(user, transform, function(n,p,o,s) {
		for (var i=0; i<components.length; ++i) components[i].update(s) //render first
		//for (var k in n) if (n[k] !== o[k]) localStorage[k] = JSON.stringify(n[k])
	})
}

function weightSorter(a, b) { //[{name, weight}] by highest absolute weight, then alphabetical
	var diff = Math.abs(a.weight) - Math.abs(b.weight)
	return diff !== 0 ? diff
		: a.name > b.name ? 1
		: -1
}
function typesMapper(name) {
	return { name: name, weight: this.types[name] }
}
function transform(n, p, o, cb) {
	var lastState = viewState
	viewState = assign({
		sortedTypes: Object.keys(n.types).map(typesMapper, n).sort(weightSorter) //[{name, weight}]
	}, n)
	////user.hmap = [] //{id, loc, typ, wgt}
	cb(viewState, p, lastState)
}
