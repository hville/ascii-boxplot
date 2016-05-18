'use-strict'
var show = require('./show'),
		view = require('./view'),
		//Calc = require('./calc'),
		h = require('snabbdom/h'),
		calc1 = require('./calc1')



//var calc = Calc(),
var opts = {props: {onclick: render}}
var N = 500,
		qty = 0,
		tms = 0,
		lms = 0
function render(t) {
	var itms = calc1(t)
	var vdom = h('div', opts, [view(itms)])
	window.requestAnimationFrame(function(ms) {
		++qty
		//tms += (ms-lms) * (1 + qty*(N-qty)/N )
		show(vdom)
		//console.log(ms, ms-lms, 'ms/f:', ms/qty, qty*(N-qty)/N)
		//lms = ms
		if (qty<N) render(ms * Math.sin(qty/N*Math.PI/2) / 200)
	})
}

render(0)
