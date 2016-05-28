'use-strict'
/*eslint no-console:0*/
var frzr = require('frzr')

var el = frzr.el,
		svg = frzr.svg,
		List = frzr.List,
		TAGNAME = 'datagrid'

/*
var table = el('datagrid', {columns: mycolumns},
	el('caption', 'whatever'), //optional
	el('header'), //optional, for formatting only
	el('tbody'), //optional, for formatting ad grouping
	el('footer') //optional, for formatting only
)
*/

frzr.registerElement(TAGNAME, function(sel, att, cnt) {
	var innerTags = ['CAPTION', 'THEAD', 'TBODY', 'TR', 'TFOOT'],
			tableSel = sel.slice(TAGNAME.length),
			tableAtt = {},
			tableCnt = [],
			columns

	var childMap = innerTags.reduce(function(res, itm) {
		res[itm] = []
		return res
	}, {})

	for (var i=1; i<arguments.length;++i) {
		if (!arguments[i]) continue

		if (arguments[i].tagName) children[arguments[i].tagName].push(arguments[i])

		else if (arguments[i].columns) {
			columns = arguments[i].columns
			//copy all attributes except columns
			for (var i=0, keys=Object.keys(att); i<keys.length; ++i) {
				if (att[keys[i]] !== 'columns') tableAtt[keys[i]] = att[keys[i]]
			}
		}
	}

	return new DataGrid(tableSel, tableAtt, tableCnt, columns)
})

function DataGrid(sel, att, cnt, col) {
	this.el = el('table', el('tbody', el('tr', el('td', ))))
}





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

