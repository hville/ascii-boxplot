var h = require('@private/dom-co').htm
var GOOGLEMAPS_API_KEY = 'AIzaSyAaQ9WZRglsGpwHYxLtOMn50JvpLbSTszk' //process.env.GOOGLEMAPS_API_KEY

var header = h('#header.row',
	h('span', 'enMarche')
)
var leftPane = h('#left.column.column-25',
	h('label', 'City',
		h('input#city', {type: 'text', placeholder: 'city'})
	),
	h('label', 'Zoom',
		h('input#zoom', {type: 'text', placeholder: 'city'})
	)
)
var gmap = h('#gmap')
var rightPane = h('#right.column.column-75', gmap)
var footer = h('.row',	h('ui#footer'))

module.exports = h('div.container', {style: 'height: 100%'},
	header,
	h('.row', {style: 'height: 75%'},
		leftPane,
		rightPane
	),
	footer,
	h('script#google', {
		src: 'https://maps.googleapis.com/maps/api/js?key='+GOOGLEMAPS_API_KEY+'&libraries=visualization,places',
		async: true,
		defer: true
	})
)
