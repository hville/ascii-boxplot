'use-strict'
/*eslint no-console:0*/
var frzr = require('frzr')

var el = frzr.el,
		testCollection = [{id: 'one', val: 1}, {id: 'two', val: 2}]
		testMatrix = [['one', 1],['two', 2]]
		ViewTh = Generic('th'),
		ViewTd = Generic('td'),
		tableChildrenTags = ['caption', 'thead', 'tbody', 'tfoot'],
		testColumns = [
			{key:'id', thead:ViewTh, tbody:ViewTd, tfoot:ViewTh},
			{key:'val', thead:ViewTh, tbody:ViewTd, tfoot:ViewTh}
		]





function ViewTableSection(tagName, options) { //options: attributes, Child:Row
	this.el = el(tagName, options.attributes,
		this.children = new List(options.Child)
	)
	this.update = function(sets) {
		this.children.update(sets)
	}
}

function ViewTableRow(options) { //options: attributes, Child:Cells
	this.el = el('tr', options.attributes,
		this.children = new Cells()
	)
	this.update = function(sets) {
		this.children.update(sets)
	}
}

function ViewTableCells(columns, section) {
	this.children = columns.map(function(col) { return new col[section]() })
	this.update = function(arr) { this.children.forEach}
	return
}





module.exports = SimpleCollectionTable({
	columns: testColumns,
})

function GenericRow(tagName, options) {
	function update(text) {
		this.el.innerHTML = text
	}
	return function(options) {
		this.el = options && options.attributes ? el(tagName, options.attributes) : el(tagName)
		this.update = update
	}
}


function Generic(tagName) {
	function update(text) {
		this.el.innerHTML = text
	}
	return function(options) {
		this.el = options && options.attributes ? el(tagName, options.attributes) : el(tagName)
		this.update = update
	}
}


//anyView: (options) => {el, update, mounted}
//dataSet: => {key, name, units, transform, translate}
//Column: {key, thead:View, tbody:View, tfoot:View}
//ViewItem: (options, item, i)
//List (View, key, initData, skipRender)



var




var eltest = SimpleCollectionTable




function transpose(collection, key) {
	return collection.map(function(rec) { return rec.key })
}

function makeRowConstructor(columns, key) {
	var elArgs = ['key']
	return function(options) {
		for (var i=0; i<columns.length; ++i) {

		}
	}
}


function SimpleCollectionTable(options) { //caption, thead, tbody, tfoot, columns
	var tableArgs = ['table']
	if (options.attributes) tableArgs.push(options.attributes)
	if (options.Caption) table.push(
		this.caption = new options.Caption()
	)
	if (options.THead) table.push(
		this.thead = new options.THead()
	)
	if (options.TBody) table.push(
		this.tbody = new options.TBody()
	)
	if (options.TFoot) table.push(
		this.tfoot = new options.TFoot()
	)

	this.RowHead = function(options) {

	}

	this.el = el('table',
		this.caption = options.caption ? el('caption', options.caption) : el('caption'),
		this.thead = options.thead ? el('thead', options.thead) : el('thead'),
		this.tbody = options.tbody ? el('tbody', options.tbody) : el('tbody'),
		this.tfoot = options.tfoot ? el('tfoot', options.tfoot) : el('tfoot')
	)
}
SimpleCollectionTable.prototype.update = function(data) {
			// get Views from the column definition, if any
			if (!options.columns || !options.columns[tagName]) return res
		options.columns && options.columns[tagName] && elArgs.push(options[tagName])
		Array.prototype.push(elArgs, options)
}














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





