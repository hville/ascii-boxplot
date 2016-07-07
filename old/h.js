var SVGNS = 'http://www.w3.org/2000/svg'

module.exports = {
	htm: htm,
	svg: svg,
	decorate: decorate,
	mount: mount
}

function htm(sel /*[,opt][,cnt]*/) { //options: {props, attrs}
	var elem = document.createElement(sel)
	for (var i=1, args=[]; i<arguments.length; ++i) args.push(arguments[i])
	return decorate(elem, args)
}

function svg(sel /*[,opt][,cnt]*/) { //options: {props, attrs}
	var elem = document.createElementNS(SVGNS, sel)
	for (var i=1, args=[]; i<arguments.length; ++i) args.push(arguments[i])
	return decorate(elem, args)
}

function decorate(elem, children) {
	if (!children || !children.length) return elem
	if (children[0] && (children[0].props || children[0].attrs)) {
		var opts = children.shift()
		if (opts.props) for (var prop in opts.props) elem[prop] = opts.props[prop]
		if (opts.attrs) for (var attr in opts.attrs) elem.setAttribute(attr, opts.attrs[attr])
	}
	mount(elem, children)
	return elem
}

function isText(val) { return typeof val === 'string' || typeof val === 'number' }

function mount(parent, child, before) {
	if (isText(child)) return mount(parent, document.createTextNode(child), before)

	if (child instanceof Node) return before ? parent.insertBefore(child, before)
	: parent.appendChild(child)

	if (Array.isArray(child)) return child.map(function(itm) {
		return mount(parent, itm, before)
	})
}
