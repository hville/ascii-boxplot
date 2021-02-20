import sampleQuantile from 'sample-quantile'

const defaults = {
	1: ' • ',
	2: ' [=] ',
	3: ' [=|=] ',
	5: ' [-[=|=]-- ',
	7: ' • --[=|=]-- • ',
	9: ' · • --[=|=]-- • · ',
	cols: (typeof process !== 'undefined' && process?.stdout?.columns) || 80,
	padding: [4, 4],
	probs: [0, .02, .09, .25, .50, .75, .91, .98, 1],
	ondone: function(str) { console.log(str) }
}

export default function(source, options={}) {
	const cfg = Object.assign({}, defaults, options),
			names = Object.keys(source),
			data = getQuantiles(names, source, cfg),
			cols = cfg.cols,
			ranges = getRange(names, data),
			scale = (cols - cfg.padding[0] - cfg.padding[1] - 1 - ranges[0]) / (ranges[2] - ranges[1]),
			offset = ranges[0] + cfg.padding[0] - ranges[1] * scale

	for (let name of names) {
		var vals = data[name],
				chars = cfg[vals.length]
		if (!chars) throw Error('invalid box plot dataset')

		for (var j=0; j<vals.length; ++j) {
			while (name.length < Math.round(vals[j] * scale + offset)) name += chars[2*j]
			name += chars[2*j + 1]
		}
		name += chars[2*j]
		cfg.ondone(name)
	}
}
function getQuantiles(names, source, cfg) {
	var data = {}
	for (var i=0; i<names.length; ++i) {
		if (source[names[i]].length <= cfg.probs.length) data[names[i]] = source[names[i]]
		else data[names[i]] = sampleQuantile(source[names[i]], cfg.probs, true)
	}
	return data
}
function getRange(names, series) {
	var len = 0,
			min = Number.POSITIVE_INFINITY,
			max = Number.NEGATIVE_INFINITY
	for (var i=0; i<names.length; ++i) {
		var serie = series[names[i]]
		if (names[i].length > len) len = names[i].length
		if (serie[0] < min) min = serie[0]
		if (serie[serie.length-1] > max) max = serie[serie.length-1]
	}
	return [len, min, max]
}
