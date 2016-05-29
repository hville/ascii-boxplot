'use-strict'
var frzr = require('frzr')
var assign = require('object-assign')

function concatKeys(ks1, ks2) { //TODO
	if (ks2 === undefined) return ks1
	if (!Array.isArray(ks2)) return ks1.concat(ks2)
	if (ks2.length === 0) return ks1
	return ks1.concat(ks2)
}

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

//CONSTRUCTORS
function Co(sel, att, cnt, upd) {
	var args = [sel]
	if (att) args.push(att)
	if (cnt) args.push(cnt)
	this.el = frzr.el.apply(null, args)
	this.children = (cnt && cnt.length) ? cnt : null
	this.updateSelf = upd
	this.updateChild = undefined
	this.data = undefined
	this.root = [] //[]
	this.keys = [] //[]
}
Co.prototype.update = function(data, root, keys) {
	this.data = data
	this.root = root || []
	this.keys = keys || []
	if (this.updateSelf) this.updateSelf()
	if (this.children) {
		for (var i=0; i<this.children.length; ++i) {
			if (this.updateChild) this.updateChild(this.children[i], i, this.children)
			else if (this.children[i].update) this.children[i].update(this.data, this.root, this.keys)
		}
		frzr.setChildren(this.el, this.children)
	}
}
Co.prototype.dive = function(lvl) {
	if (this.keys && this.keys.length > 0) {
		if (!lvl) lvl = this.keys.length
		for (var i=0; i<lvl; ++i) this.data = this.data[this.keys[i]]
		this.root = concatKeys(this.root, this.keys.slice(0, lvl))
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

//ELEMENTS
function table(options) {
	return co('table',
		co('thead',	row(assign({section: 'thead'}, options)), null, null),
		body(options),
		co('tfoot',	row(assign({section: 'tfoot'}, options)), null, null)
	)
}

function body(options) {
	function createRow(rec, key) {
		//console.log(this.children)
		if (!this.children || !this.children[key]) return row(assign({section: 'tbody'}, options), rec, key)
	}
	return co('tbody', function() {
		this.children = maptoArray(this.pull(), createRow)
	})
}

function row(options, rec, kRec) {
	var Cells = options.columns.map(function(col) { return col[options.section] }),
			keys = options.columns.map(function(col) { return col.key })

	function createCell(kCol, iCol) {
		if (!this.children || !this.children[iCol]) {
			var cnt = options.columns[iCol][options.section] //a cell component or element or view
			//console.log('creating td with ', cnt, options.section , options.columns[iCol])
			return typeof cnt === 'function' ? cnt(options)
				: typeof cnt === 'object' ? cnt
				: options.section === 'thead' ? co('th', cnt)
				: co('td', cnt)
		}
	}
	return co('tr', function() {
		this.keys = concatKeys(this.keys, kRec)
		this.children = keys.map(createCell)
		console.log(this.children)
	})
}

function valueHandler(dispatch, act, pth) {
	//console.log('valueHandler this path:', pth)
	return function(e) {
		dispatch(act, pth, e.target.value)
	}
}

function inputCell(options) {
	return co('td', co(
		'input',
		{oninput: valueHandler(options.dispatch, 'r', concatKeys(this.root, this.keys))},
		updateValue
	))
}

function cell(options) {
	return co('td', function(){ console.log(this.data, this.root, this.keys, this.pull()); this.el.textContent = this.pull() })
}

function sumCell(/*options*/) {
	return co('td', function tdupdater() {
		if (!this.keys || (this.keys.length && this.keys[0]===undefined))	{console.log(this.el.tagName); throw Error()}
		//var sum = this.data.reduce(function(tot, rec) { return +rec[this.keys[1]] + tot}, 0)
		this.el.textContent = 'TODO sum'
	})
}

//UPDATERS
function updateValue() {
	this.el.value = this.pull()
}
