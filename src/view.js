'use-strict'
/*eslint no-console:0*/
var h = require('snabbdom/h')
//var counter = 0

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

function Bezier(xys) {
	if (xys < 3) return ''
	var d = path('M', xys[0], 'Q', xys[1], mid(xys[1], xys[2]))

	for (var i=3; i<xys.length; i++) {
		d += path('L', mid(xys[i-1], xys[i]))
	}
	d += path('L', xys[i-1])
	return d
}

function curve(itm, idx) {
	ds[idx] = Bezier(itm.xys)
	//console.log(idx, ds[idx])
	return h('g', {key: idx}, [
		h('path', {attrs: {d: ds[idx] || 'M0,0'}})
	])
}


module.exports = function(itms) {
	//console.log(data)

	var curves = itms.map(curve)


	var circle = h('circle', {attrs: {cx: 0, cy: 0, r: 400, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}})
	var svg = h('svg', {attrs: {viewBox: viewBox, width: '100%'}}, [circle].concat(curves))
	var div = h('div', [svg])
	//console.log('DIV:', div)
	return div
}
