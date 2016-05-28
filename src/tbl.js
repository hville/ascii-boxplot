'use-strict'
var assign = require('object-assign'),
		elm = require('./elm')

var view = elm.view,
		list = elm.list,
		join = elm.join

module.exports = {
	table: table,
	inputCell: inputCell,
	sumCell: sumCell,
	cell: cell
}

//UPDATERS
function updateValue(v) {
	this.el.value = v
}
function createUpdateKeys(keys) {
	return function(obj) {
		this.children.forEach(function(el, i) {
			if (el.update) el.update(obj[keys[i]], keys[i], obj)
		})
	}
}

//ELEMENTS
function table(options) {
	return view('table',
		view('thead',	row(assign({section: 'thead'}, options))),
		body(options),
		view('tfoot',	row(assign({section: 'tfoot'}, options)))
	)
}

function nestOptions(options, key) {
	return assign({}, options, {origin: options.origin+'/'+key})
}

function body(options) {
	var rowView = row.bind(null, assign({section: 'tbody'}, options))
	return view('tbody', list(rowView))
}

function row(options, rec, irow) {
	var Cells = options.columns.map(function(col) { return col[options.section] }),
			keys = options.columns.map(function(col) { return col.key })

	var cells = Cells.map(function (View, icol) {
		return typeof View === 'function' ? View( nestOptions(options, irow+'/'+keys[icol]), rec && rec[keys[icol]], icol)
			: typeof View === 'object' ? (View.update ? View.update(rec && rec[keys[icol]], icol) : View)
			: options.section === 'thead' ? view('th', View)
			: view('td', View)
	})
	var child=join(cells, createUpdateKeys(keys))
	//child.update(rec)
	return view('tr', child)
}

function valueHandler(dispatch, act, pth) {
	return function(e) {
		dispatch(act, pth, e.target.value)
	}
}

function inputCell(options) {
	return view('td',
		view('input', {oninput: valueHandler(options.dispatch, 'r', options.origin)}, updateValue)
	)
}

function sumCell(/*options*/) {
	return view('td', function(undef, key, c) {
		var sum = c.reduce(function(s, rec) { return +rec[key] + s}, 0)
		this.el.textContent = sum
	})
}

function cell(/*options*/) {
	return view('td', function(v) { this.el.textContent = v })
}
