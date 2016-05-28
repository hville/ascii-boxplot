'use-strict'
/*eslint no-console:0*/
var frzr = require('frzr')

var el = frzr.el,
		svg = frzr.svg,
		List = frzr.List

var table = el('datagrid', {columns: mycolumns},
	el('caption', 'whatever'), //optional
	el('header'), //optional, for formatting only
	el('tbody'), //optional, for formatting ad grouping
	el('footer') //optional, for formatting only
)

var DATAGRIDTAGNAME = 'datagrid'
frzr.registerElement(DATAGRIDTAGNAME, function(sel, att, cnt) {
	var innerTags = ['CAPTION', 'THEAD', 'TBODY', 'TR', 'TFOOT'],
			tableAtt = {}
			columns
	var children = innerTags.reduce(function(res, itm) {
		res[itm] = []
		return res
	}, {})

	for (var i=0; i<arguments.length;++i) {
		if (!arguments[i]) continue
		if (arguments[i].tagName) children[arguments[i].tagName].push(arguments[i])
		else if (arguments[i].columns) 	{
			columns = arguments[i].columns
			for (var i=0, keys=Object.keys(att); i<keys.length; ++i) {
				if (att[keys[i]] !== 'columns') tableAtt[keys[i]] = att[keys[i]]
			}
		}
	}

	var tableSel = sel.slice(DATAGRIDTAGNAME.length)
	// head OR children.HEAD OR columns.HEAD

	return el('table', el('tbody', el('tr', el('td', ))))
})

frzr.registerElement('col', function(sel, att, cnt) {
	return el('table', el('tbody', el('tr', el('td', ))))
})

// table: el('table', attrs[, caption][, colgroup][, thead], tfoot[, tbody][, tbody])
// table: el('table', attrs[, caption][, colgroup][, thead], tfoot, tr, [, tr])
// table: el('table', attrs[, caption][, colgroup][, thead][, tbody][, tbody][, tfoot])
// table: el('table', attrs[, caption][, colgroup][, thead], tr, [, tr][, tfoot])

// (tag?, att?, arr) => {el:?, update(arr)}


frzr.registerElement('col', function(sel, att, cnt) {
	return el('table', el('tbody', el('tr', el('td', ))))
})




var viewBox = [-1000, -500, 2000, 1000].join(' '),
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

function Curve() {
	this.el = svg('g',
		this.path = svg('path', {d: 'M0,0'})
	)
	//console.log('%O', this.path)
}
Curve.prototype.update = function(itm) {
	this.path.attributes.d.value = Bezier(itm.xys)
	//console.log('%O', this.path.attributes.d)
}
// issues: list is misterious amd magical
// issues: list must be the only child
module.exports = function() {
	var curves = new List(Curve)
	var tempItm = {xys:[[0,0], [0,0], [0,0]]}
	//curves.update([tempItm])
	var circle = svg('circle', {cx: 0, cy: 0, r: 400, stroke: 'green', 'stroke-width': 4, fill: 'yellow'})
	//console.log(circle)
	var div = el('div', svg('svg', {viewBox: viewBox, width: '100%'},
		circle,
		svg('g', curves)
	))
	return {
		el: div,
		update: function(itms) {
			curves.update(itms)
		}
	}
}
