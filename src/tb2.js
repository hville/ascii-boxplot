'use-strict'
var frzr = require('frzr')
var assign = require('object-assign')//,
		//elm = require('./elm')

//var view = elm.view,
//		list = elm.list,
//		join = elm.join

module.exports = {
	table: table,
	inputCell: inputCell,
	sumCell: sumCell,
	cell: cell
}

function maptoArray(obj, fcn) {
	if (Array.isArray(obj)) return obj.map(fcn)
	var res = []
	for (var k in obj) res.push(fcn(obj[k], k, obj))
	return res
}

function updater(data, root, keys) {
	this.data = data
	this.root = root || []
	this.keys = keys || []
}

//CONSTRUCTORS
function Co(sel, att, cnt, upd) {
	var args = [sel]
	if (att) args.push(att)
	if (cnt && cnt.length) args.push(cnt)
	this.el = frzr.el.apply(null, args)
	this.children = (cnt && cnt.length) ? cnt : null
	this.updater = upd || updater
	this.data = null //{} || []
	this.root = [] //[]
	this.keys = [] //[]
}
Co.prototype.update = function(data, root, keys) {
	this.updater(data, root, keys)
	if (this.children) {
		for (var i=0; i<this.children.length; ++i) {
			if (this.children[i].update) this.children[i].update(this.data, this.root, this.keys)
		}
		frzr.setChildren(this.el, this.children)
	}
}
Co.prototype.dive = function(lvl) {
	if (this.keys && this.keys.length > 0) {
		if (!lvl) lvl = this.keys.length
		for (var i=0; i<lvl; ++i) this.data = this.data[this.keys[i]]
		this.root = this.root.concat(this.keys.slice(0, lvl) || [])
		this.keys = this.keys.slice(lvl)
	}
	return this.data
}
Co.prototype.pull = function(lvl) {
	if (!lvl) lvl = this.keys.length
	for (var i=0, res = this.data; i<lvl; ++i) res = res[this.keys[i]]
	return res
}


//HELPERS
function isAttribute(arg) {
	return typeof arg === 'object' && !(arg instanceof Node || arg instanceof Co)
}

function co() {
	var sel = '',
			cnt = [],
			att,
			upd
	for (var i=0; i<arguments.length; ++i) {
		if (i === 0 && typeof arguments[0] === 'string') sel = arguments[0]
		else if (typeof arguments[i] === 'function') upd = arguments[i]
		else if (i < 2 && isAttribute(arguments[i])) att = arguments[i]
		else cnt = cnt.concat(arguments[i] || [])
	}
	return new Co(sel || 'div', att, cnt, upd)
}

//UPDATERS
function updateValue(data, root, keys) {
	this.data = data
	this.root = root || []
	this.keys = keys || []
	this.el.value = this.el.textContent = this.pull()
}
function updateDown(key) {
	return function(data, root, keys) {
		this.data = data
		this.root = root || []
		this.keys = keys.concat(key)
	}
}

//ELEMENTS
function table(options) {
	return co('table',
		co('thead',	row(assign({section: 'thead'}, options))),
		body(options),
		co('tfoot',	row(assign({section: 'tfoot'}, options)))
	)
}

function body(options) {
	function createRow(rec, key) {
		if (!this.children[key]) this.children[key] = row(options, rec, key)
	}
	return co('tbody', function(data, root, keys) {
		this.data = data
		this.root = root || []
		this.keys = keys || []
		this.children = maptoArray(this.pull(), createRow)
	})
}

function row(options, rec, kRec) {
	function createCell(val, icol) {
		if (!this.children[icol]) {
			var sel = options.section === 'thead' ? 'th' : 'td'
			var key = options.columns[icol].key
			var upd = options.columns[icol][options.section]
			this.children[icol] = co(sel, cnt, updateDown(key))
		}
	}
	return co('tr', function(data, root, keys) {
		this.data = data
		this.root = root || []
		this.keys = keys.concat(kRec)
		this.children = maptoArray(this.pull(), createCell)
	})
}

function valueHandler(dispatch, act, pth) {
	return function(e) {
		dispatch(act, pth, e.target.value)
	}
}

function inputCell(options) {
	return co('td',
		co('input', {oninput: valueHandler(options.dispatch, 'r', options.origin)}, updateValue)
	)
}

function sumCell(/*options*/) {
	return co('td', function(data, root, keys) {
		this.data = data
		this.root = root || []
		var sum = data.reduce(function(tot, rec) { return +rec[colKey] + tot}, 0)
		this.el.textContent = sum
	})
}

function cell(/*options*/) {
	return co('td', function(data, root, keys) {
		this.data = data
		this.root = root || []
		this.keys = keys.concat(colKey)
		this.el.textContent = this.pull()
	})
}


