'use-strict'
var assign = require('object-assign'),
		domCo = require('@private/dom-co')

var co = domCo.co

module.exports = {
	table: table,
	inputCell: inputCell,
	sumCell: sumCell,
	cell: cell
}

//ELEMENTS
function table(options) {
	return co('table',
		co('thead',	row(assign({section: 'thead'}, options), null, null)),
		body(options),
		co('tfoot',	row(assign({section: 'tfoot'}, options), null, null))
	)
}

function body(options) {
	var bodyCo = co('tbody', function updateSelf() {
		var data = this.pull(),
				keys = Object.keys(data)
		if (!this.children) this.children = Array(keys.length)
		for (var i=0; i<keys.length; ++i) {
			if (!this.children[i]) this.children[i] = row(assign({section: 'tbody'}, options), data[keys[i]], keys[i])
		}
		this.children.length = keys.length
	})

	return bodyCo
}

function row(options, rec, kRec) {
	var keys = options.columns.map(function(col) { return col.key }),
			rowCo = co('tr')
			.set('updateSelf', function() {
				this.keys = this.keys.concat(kRec)
				this.children = keys.map(createCell)
			})
			.set('updateChild', function(child, idx) {
				if (child.update) child.update(
					this.data,
					this.root,
					keys[idx] === undefined ? this.keys : this.keys.concat(keys[idx]))
			})

	function createCell(kCol, iCol) {
		if (rowCo.children && rowCo.children[iCol]) return rowCo.children[iCol]
		var cnt = options.columns[iCol][options.section] //a cell component or element or view
		return typeof cnt === 'function' ? cnt(options)
			: typeof cnt === 'object' ? cnt
			: options.section === 'thead' ? co('th', cnt)
			: co('td', cnt)
	}

	return rowCo
}

function inputCell(options) {
	var inputCo = co('input', {oninput: inputHandler},	updateValue)

	function inputHandler(e) {
		options.dispatch('r', '/' + inputCo.root.concat(inputCo.keys).join('/'), e.target.value)
	}

	return co('td', inputCo)
}

function cell(/*options*/) {
	return co('td', function(){ this.el.textContent = this.pull() })
}

function sumCell(/*options*/) {
	return co('td')
		.set('updateSelf', function tdupdater() { //this=window
			var colKey = this.keys[1] //this=td
			var sum = this.data.reduce(function(tot, rec) { return +rec[colKey] + tot	}, 0)
			this.el.textContent = sum
		})
}

//UPDATERS
function updateValue() {
	this.el.value = this.pull()
}
