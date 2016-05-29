'use-strict'
var frzr = require('frzr')

module.exports = {
	Co: Co,
	co: co
}
/**
 * elem: STATIC: dom elem, instanceof Node, DYNAMIC: {el:elem, update:(v,i,a)=>0, child:elem|list|elems}
 * list: {views:[view|elem], update:(v,i,a)=>0}
 * view: (sel, att, cnt..., update)=>elem
 * join: (elems..., update)=>list
 */

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
		this.root = this.root.concat(this.keys.slice(0, lvl))
		this.keys = this.keys.slice(lvl)
	}
	return this.data
}
Co.prototype.pull = function(lvl) {
	if (!lvl) lvl = this.keys.length
	for (var i=0, res = this.data; i<lvl; ++i) res = res[this.keys[i]]
	return res
}
Co.prototype.set = function(att, val) {
	this[att] = val
	return this
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
		else if (typeof arguments[i] === 'function') upd = arguments[i] //TODO
		else if (i < 2 && isAttribute(arguments[i])) att = arguments[i]
		else cnt = cnt.concat(arguments[i] || [])
	}
	return new Co(sel || 'div', att, cnt, upd)
}
