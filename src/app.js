'use-strict'
var show = require('./show'),
		view = require('./view'),
		//Calc = require('./calc'),
		h = require('snabbdom/h'),
		calc = require('./calc')

//var calc = Calc(),
var opts = {props: {onclick: render}}
var N = 500,
		qty = 0,
		lms = 0
function render(t) {
	if (!lms) lms = t
	var itms = calc(t)
	var vdom = h('div', opts, [view(itms)])
	window.requestAnimationFrame(function(ms) {
		++qty
		//tms += (ms-lms) * (1 + qty*(N-qty)/N )
		show(vdom)

		//lms = ms
		if (qty<N) render(ms * Math.sin(qty/N*Math.PI/2) / 200)
		else console.log(ms, 'ms/f:', (ms-lms)/qty, 'fps', 1000*qty/(ms-lms))
	})
}

render(0)
