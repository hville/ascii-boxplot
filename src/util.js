'use-strict'
var assign = require('object-assign')

module.exports = {
	svgEventHandler: svgEventHandler,
	rgb: rgb,
	hsl: hsl,
	eventCb: eventCb,
	mapper: mapper
}

function svgEventHandler(e) { // get zoom&pan, adjust
	var svgEl0 = e.currentTarget.farthestViewportElement,
			svgEl1 = document.getElementsByTagName('svg')[0],
			scale = svgEl0.currentScale,
			shift = svgEl1.currentTranslate
	return {
		x: (e.pageX - shift.x)/scale, //TODO test clientX and pageX
		y: (e.pageY - shift.y)/scale
	}
}

function rgb(r, g, b, a) {
	var val = [r, g, b],
			cmd = 'rgb'

	if (a !== undefined) {
		val.push(a)
		cmd += 'a'
	}

	var cString = ((r <= 1 && g <= 1 && b <=1)
		? val.map(function(v) { return Math.round(v*100) + '%' })
		: val).join(',')

	return [cmd, '(', cString, ')'].join('')
}

function hsl(h, s, l, a) {
	var val = [h, s, l],
			cmd = 'hsl'

	if (a !== undefined) {
		val.push(a)
		cmd += 'a'
	}

	var cString = ((h <= 1 && s <= 1 && l <=1)
		? val.map(function(v) { return Math.round(v*100) + '%' })
		: val).join(',')

	return [cmd, '(', cString, ')'].join('')
}

//to cancell simultaneous events on mouse+touch devices
function doubleEvent(minTime) {
	if (minTime) doubleEvent.minTime = minTime;
	if (doubleEvent.lastCall + doubleEvent.minTime > Date.now()) return true;
	doubleEvent.lastCall = Date.now();
	return false;
}
doubleEvent.minTime = 125;
doubleEvent.lastCall = 0;


// to create a ui event callback with function and event transformation
// e.g. eventCB(dag.edit.editIdCb(id), evt2str)
// e.g. eventCB(dag.edit.editTimeCb(id), evt2arr)
function eventCb(fcn, xfo) {
	return function(e) {
		if (doubleEvent()) return;
		return fcn(xfo(e));
	};
}

// merges inputs and results if they have the same Id
// length can be different, Input source takes priority while new results are on the way.
function mapper(target, srcX, srcY) {
	var len = srcX.length

	// make sure we have a valid target
	if (Array.isArray(target)) target.length = len
	else target = Array(len)

	//merge all records
	for (var i = 0; i < len; ++i) {
		if (srcX[i].id === srcY[i].id) { //matching field - srcY is valid
			if (typeof target[i] !== 'object') target[i] = {}
			assign(target[i], srcY[i], srcX[i]) // all fields replaced
		}
		else {	// srcY is still being updated. only show x while waiting for the results
			target[i] = JSON.parse(JSON.stringify(srcX[i])) // replace complete row to remove old values
		}
		// store the toposorted index
		target[i].idx = i
	}
	return target
}
