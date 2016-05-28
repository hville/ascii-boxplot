'use-strict'
var frzr = require('frzr')

module.exports = {
	Element: Element,
	Group: Group,
	view: view,
	list: list,
	join: join
}
/**
 * elem: STATIC: dom elem, instanceof Node, DYNAMIC: {el:elem, update:(v,i,a)=>0, child:elem|list|elems}
 * list: {views:[view|elem], update:(v,i,a)=>0}
 * view: (sel, att, cnt..., update)=>elem
 * join: (elems..., update)=>list
 */

//UTILS
function isElement(itm) {
	return itm instanceof Node || itm instanceof Element || typeof itm === 'string' || typeof itm === 'number'
}

function isGroup(itm) {
	return Array.isArray(itm) ? itm.every(function(elm) { return isElement(elm) || isGroup(elm) })
		: itm instanceof Group
}

//CONSTRUCTORS
function Element(sel, att, cnt, upd) {
	var args = [sel]
	if (att) args.push(att)

	this.child = cnt.length ? join(cnt)	: null

	if (this.child) args.push(this.child.els)
	this.el = frzr.el.apply(null, args)

	this.updater = upd
}
Element.prototype.update = function(val, key, src) {
	if (this.updater) this.updater(val, key, src)
	if (this.child) {
		this.child.update(val, key, src)
		frzr.setChildren(this.el, this.child.el || this.child.els)
	}
}

function Group(children, upd) { //children: views, els: elements
	this.els = []
	this.updater = upd
	this.children = Array.isArray(children) ? children : [children]
	this.setChildren()
}
Group.prototype.update = function(val, key, src) {
	if (this.updater) this.updater(val, key, src)
	else this.children.forEach(function(children) { if (children.update) children.update(val, key, src) })
	this.setChildren()
}
Group.prototype.setChildren = function() {
	this.els = this.children.reduce(function(res, child) {
		return child instanceof Group ? res.concat(child.els)
			: child instanceof Element ? res.concat(child.el)
			: res.concat(child)
	}, [])
}

//HELPERS
function view() {
	var sel = '',
			cnt = [],
			att,
			upd

	for (var i=0; i<arguments.length; ++i) {
		if (i === 0 && typeof arguments[0] === 'string') sel = arguments[0]
		else if (typeof arguments[i] === 'function') upd = arguments[i]
		else if (i < 2 && !isElement(arguments[i]) && !isGroup(arguments[i])) att = arguments[i]
		else cnt = cnt.concat(arguments[i])
	}
	return new Element(sel || 'div', att, cnt, upd)
}

function join() { //join: (elems..., update)=>list
	var children = [],
			upd
	for (var i=0; i<arguments.length; ++i) {
		if (isGroup(arguments[i]) || isElement(arguments[i])) children = children.concat(arguments[i])
		else if (typeof arguments[i] === 'function') upd = arguments[i]
	}
	if (children.length === 1 && isGroup(children[0])) {
		return upd ? new Group(children[0].children, upd) : children[0]
	}
	return new Group(children, upd)
}

function list(itemView) {
	return new Group([], createUpdateList(itemView))
}

//UPDATERS
function createUpdateList(vfcn) {
	return function(data) {
		for (var i=0; i<data.length; ++i) {
			if (!this.children[i]) this.children[i] = vfcn(data[i], i, data)
			this.children[i].update(data[i], i, data)
		}
		this.children.length = i
	}
}
