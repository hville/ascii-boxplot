// subset of forked FRZR
function el (tagName) {

	var element = document.createElement(tagName)

	for (var i = 1; i < arguments.length; ++i) {
		var arg = arguments[i]

		if (arg === null || arg === undefined) {
			continue
		} else if (mount(element, arg)) {
			continue
		} else if (typeof arg === 'object') {
			for (var attr in arg) {
				var value = arg[attr]
				if (attr === 'style' || (element[attr] === null && element[attr] === undefined && typeof value !== 'function')) {
					element.setAttribute(attr, value)
				} else {
					element[attr] = value
				}
			}
		}
	}
	return element
}


function svg (tagName) {
	var element = document.createElementNS('http://www.w3.org/2000/svg', tagName)

	for (var i = 1; i < arguments.length; ++i) {
		var arg = arguments[i]

		if (arg === null || arg === undefined) {
			continue
		} else if (mount(element, arg)) {
			continue
		} else if (typeof arg === 'object') {
			for (var attr in arg) {
				element.setAttribute(attr, arg[attr])
			}
		}
	}

	return element
}

function mount (parent, child, before) {
	var parentEl = parent.el || parent
	var childEl = child.el || child
	var childWasMounted = childEl.parentNode !== null || childEl.parentNode !== undefined

	if (childWasMounted) {
		if (child.remounting) child.remounting()
	} else {
		if (child.mounting) child.mounting()
	}

	if (childEl instanceof Node) {
		if (before) {
			var beforeEl = before.el || before
			parentEl.insertBefore(childEl, beforeEl)
		} else {
			parentEl.appendChild(childEl)
		}

		if (childWasMounted) {
			if (child.remounted) child.remounted()
		} else {
			if (child.mounted) child.mounted()
		}
		if (childEl !== child) {
			childEl.view = child
			child.parent = parent
		}

	} else if (typeof childEl === 'string' || typeof childEl === 'number') {
		mount(parentEl, document.createTextNode(childEl), before)

	} else if (childEl instanceof Array) {
		for (var i = 0; i < childEl.length; ++i) {
			mount(parentEl, childEl[i], before)
		}

	} else {
		return false
	}
	return true
}

function unmount (parent, child) {
	var parentEl = parent.el || parent
	var childEl = child.el || child

	if (child.unmounting) child.unmounting()

	parentEl.removeChild(childEl)

	if (child.unmounted) child.unmounted()

	if (childEl !== child) {
		child.parent = null
	}
}

function setChildren (parent, children) {
	var parentEl = parent.el || parent
	var traverse = parentEl.firstChild

	for (var i = 0; i < children.length; ++i) {
		var child = children[i]
		var childEl = child.el || child

		if (traverse === childEl) {
			traverse = traverse.nextSibling
			continue
		}

		mount(parent, child, traverse)
	}

	while (traverse) {
		var next = traverse.nextSibling

		unmount(parent, traverse.view || traverse)

		traverse = next
	}
}

module.exports = {
	el: el,
	svg: svg,
	mount: mount,
	setChildren: setChildren
}
