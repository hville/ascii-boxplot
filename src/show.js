var snabbdom = require('snabbdom'),
		props = require('snabbdom/modules/props'),
		attrs = require('snabbdom/modules/attributes')

var	patch = snabbdom.init([ // Init patch function with choosen modules
	props, // for setting properties on DOM elements
	attrs
])

var oldNode = document.getElementById('container') //document.body //
var styleNode = document.getElementsByTagName('style')[0]
styleNode.sheet.insertRule('patate{color:red}', 3)

/*console.log(styleNode.sheet)
console.log(styleNode.sheet.rules)
console.log(styleNode.sheet.rules.length)
console.log(styleNode.sheet.rules[0])
console.log(styleNode.sheet.cssRules) //CSSStyleSheet.deleteRule //stylesheet.insertRule(rule, index)
console.log(styleNode.sheet.ownerRule) //CSSStyleSheet.insertRule
console.log(styleNode.sheet.ownerNode )
console.log(styleNode.scoped)
console.log(styleNode.style)
console.log(document.styleSheets)*/
// innerHTML === innerText === textContent

module.exports = function view(vdom) {
	patch(oldNode, vdom)
	oldNode = vdom
	//console.log(vdom.elm)
}
