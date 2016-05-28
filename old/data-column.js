'use-strict'
/*eslint no-console:0*/
var frzr = require('frzr')
var el = frzr.el

function GroupArray(sel, att, View, options) {
	this.el = el(sel, att,
		this.children = new List(Type, null, {origin: options.origin, dispatch: options.dispatch})
	)
}
GroupArray.prototype.update = function(values) {
	this.children.update(values)
}
GroupArray.prototype.mounted = function() {
	console.log(this.el.tagName, 'groupArray mounted')
}


function GroupTupple(sel, att, Views, options) {
	this.views = Views.map(function(View, i) {
		return new View({origin: options.origin, dispatch: options.dispatch})
	})
	this.el = el.apply(Array.prototype.push([sel, att], this.views))
}
GroupArray.prototype.update = function(values) {
	for (var i=0; i<this.views.length; ++i) this.views[i].update(values[i])
}




function SimpleCollectionTable1() {
	this.el = el('table',
		el('tbody',
			this.rows = new List(
				Row,
				'uid'
			)
		)
	)
}
SimpleCollectionTable1.prototype.update = function(collection) {
	this.rows.update(collection)
}
function Row(record) {
	Object.keys.reduce(function(key) {

	}, ['tr'])
}




var el = frzr.el,
		svg = frzr.svg,
		List = frzr.List,
		TAGNAME = ''

var integerInputColumn = {
	key: 'idKey',
	name: 'name',
	Header: 'TODO',
	Body: 'TODO', //View(initData, item, i)
	Footer: 'TODO'
}

function Table(defCols) {
	this.el = el('table',
		this.caption = el('caption', options.caption),
		el('thead',
			el('tr',
				this.headers = new List(defCols.Header, defCols)
			)
		),
		el('tbody',
			el('tr',
				this.rows = new List(
					this.cells = new List(defCols.Header),
					defCols
				)
			)
		),
		el('tfoot',
			el('tr',
				this.headers = new List(defCols.Header, defCols)
			)
		)
	)
}
Table.prototype.update = function (collection) {

}

/*
var column = new DataColumn (cellTemplate) el('datacolumn', {???},
	el('td'), //optional, for formatting only
)
*/
/*
new List(View, key, initData, skipRender) => list
?	view = new View(initData, item, i) //in list
new List(View, key, initData, skipRender) => {View, key, initData, skipRender, views, lookup, parent, update:(data, callback)=>void}

*/
function Column(key, dispatch) {
	this.th = el('th', key),
	this.td = el('td'),
	this.tf = el('td')
}
Column.prototype.update = function() {

}

var defCols = [
	new Column(key, dispatch)
]



var collectionRows = new List(Row, idRow, defCols)
var matrixRows = new List(Row)

function Row(defCols) {
	this.el = el('tr',
		this.cells = new List(Cell, defCols)
		//{View, key, initData, skipRender, views, lookup, parent, update:(data, callback)=>void}
	)
}
Row.prototype.update = function(val) {
	//TODO from defCols
}



function Cell(content) {
	this.td = el('td',
		this.content = content
	)
}
Cell.prototype.update = function(val) {
	if (this.content.update) this.content.update(val)
	else this.content = val
}


function Row() {
	this.el = el('tr',
		this.td = el('td'),
			this.content =
	)
}
Row.prototype.update = function(val) {
	this.td.
}

function DataColumn(cellTemplate) {
	this.el = el('table',
		this.rows = new List(Row)
		el('tr',
			el('td')
		)
	)
}



/*
var column = el('datacolumn', {???},
	el('td'), //optional, for formatting only
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

