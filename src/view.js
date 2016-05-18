'use-strict'
var h = require('snabbdom/h')

var viewBox = [-1000, -500, 2000, 1000].join(' '),
		ds = ['', ''],
		R = Math.sqrt(1000*1000 + 2000*2000)/2

function point(xy) {
	return (xy[0]*R).toPrecision(5) + ',' + (xy[1]*R).toPrecision(5)
}

function mid(xy0, xy1) {
	return [(xy0[0]+xy1[0])/2, (xy0[1]+xy1[1])/2]
}

function path(cmd) {
	var res = cmd
	for (var i=1; i<arguments.length; ++i) {
		res += Array.isArray(arguments[i]) ? point(arguments[i]) : arguments[i]
		res += ' '
	}
	return res
}

function Bezier(xyvs, d) {
	console.log(xyvs)
	return xyvs.length > 3 ? d + path('T', mid(xyvs[xyvs.length-2], xyvs[xyvs.length-1]))
		: xyvs.length === 3 ? path('M', xyvs[0], 'Q', xyvs[1], mid(xyvs[1], xyvs[2]))
		: ''
}

function curve(set, idx) {
	ds[idx] = Bezier(set, ds[idx])
	console.log(idx, ds[idx])
	return h('g', {key: idx}, [
		h('path', {attrs: {d: ds[idx] || 'M0,0'}})
	])
}

module.exports = function(data) {
	return h('div', [
		h('svg', {attrs: {viewBox: viewBox, width: '100%'}}, [
			h('circle', {attrs: {cx: 0, cy: 0, r: 400, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
			h('g', data.map(curve))
		])
	])
}
