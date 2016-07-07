module.exports = Co

function Co() {
	function eventHandler(evt) {
		var el = evt.target,
				ix = findId(this.els, el.id, 0),
				co = this.els[ix]
		if (ix === -1) return
		//evt.stopPropagation()
		co.on[evt.type].call(co, evt) //this===component. sweet!
	}
	this.els = [] //[{ id: el.id, el: el, on: {}, view: (el, data, patch)=>? }]
	this.eventHandler = eventHandler.bind(this)
}
Co.prototype.view = function(data, patch, old) {
	var root = this.els[0].el,
			ctx = {i:0, cs: this.els, data: data, patch: patch, old: old}
	runAllViews(root, runOneView, ctx)
	this.els.length = ctx.i
}
Co.prototype.mount = function(parent, component, before) {
	var parentEl = isCo(parent) ? parent.el : parent
	this.register(component)
	if (before) parentEl.insertBefore(component.el, isCo(before) ? before.el : before)
	else parentEl.appendChild(component.el)
}
Co.prototype.register = function register(co) {
	var id = co.el.id || co.id || uid(2),
			els = this.els,
			ix = findId(els, id, 0)
	if (!co.el) co.el = document.getElementById('id')
	if (ix === -1) ix = els.length
	else if (els[ix].el !== co.el) throw Error('Component registration error. Id "'+co.el.id+'" already exists')
	els[ix] = {id: id, el: co.el, on: co.on || {}, view: co.view || noop}
	if (co.el.id !== id) co.el.id = id
	for (var key in els[ix].on) {
		//document.addEventListener(key, this.eventHandler, true)
	}
}

function isCo(co) {
	return co.el
}
function runAllViews(elm, red, ctx) {
	while (elm) {
		if (elm.id) red(ctx, elm)
		runAllViews(elm.firstElementChild, red, ctx)
		elm = elm.nextElementSibling
	}
}
function runOneView(cx, el) {
	if (cx.cs[cx.i] !== el.id) {
		var j = findId(cx.cs, el.id, cx.i)
		if (j === -1) return
		swap(cx.cs, cx.i, j)
	}
	cx.cs[cx.i].view(cx.data, cx.patch, cx.old)
	++cx.i
}
function swap(a, i, j) {
	var t = a[i]
	a[i] = a[j]
	a[j] = t
}
function findId(arr, id, idx) {
	for (var i=idx; i<arr.length; ++i) if (arr[i].id === id) return i
	return -1
}
function noop() {}

var nums = '0 1 2 3 4 5 6 7 8 9'.split(' ')
var lows = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(' ')
var high = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ')
var pres = lows.concat(high)
var full = nums.concat(pres)
function uid(len) {
	var id = pres[Math.floor(Math.random()*pres.length)]
	for (var i=1; i<len; ++i) id += full[Math.floor(Math.random()*pres.length)]
	if (document.getElementById(id)) return uid(len+1)
	return id
}
