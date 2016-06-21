'use-strict'
/* eslint no-console:0 */
var //allTypes = require('./types'),
		gmap = require('./map'),
		user = require('./usr')

var userTypes = user.types,
		userLocation = user.location,
		topTypes = Object.keys(userTypes).sort(weightSorter).slice(0,5).map(typesMapper)

function weightSorter(a, b) {
	return Math.abs(userTypes[b]) - Math.abs(userTypes[a])
}
function typesMapper(name) {
	return { name: name, weight: userTypes[name] }
}

gmap.onmsg = function (context) {
	window.requestAnimationFrame(function(ms) {
		console.log('RAF', ms)
		console.log('RENDER HEATMAP with', context.places.length, 'locations')
		for (var i=0; i<context.typeList.length; ++i) {
			console.log(context.typeList[i].name, 'weight:', context.typeList[i].weight, 'count:', context.typeResults[i].length)
		}
		context.render()
	})
}

gmap.postMsg(userLocation, topTypes, 10000)
