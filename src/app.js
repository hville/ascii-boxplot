'use-strict'
var show = require('./show'),
		view = require('./view'),
		Calc = require('./calc'),
		h = require('snabbdom/h')

var calc = Calc(),
		opts = {props: {onclick: render}}

function render() {
	var data = calc.next()
	//console.log(data.value)
	var vdom = h('div', opts, [view(data.value)])
	window.requestAnimationFrame(function(ms) {
		show(vdom)
		//if (!data.done) render()
	})
}

render()
