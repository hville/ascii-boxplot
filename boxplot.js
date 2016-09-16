var sampleQuantile = require('sample-quantile')

module.exports = boxplot

var defaults = {
	1: ' • ',
	2: ' [=] ',
	3: ' [=|=] ',
	5: ' [-[=|=]-] ',
	7: ' • [-[=|=]-] • ',
	9: ' · • [-[=|=]-] • · ',
	cols: 0, // will attempt to autodetect if cols is falsy
	padding: [4, 4],
	probs: [0, .02, .09, .25, .50, .75, .91, .98, 1],
	ondone: function(str) { console.log(str) }
}

function boxplot(source, options) {
	var cfg = options ? merge(defaults, options) : defaults,
			names = Object.keys(source),
			data = getQuantiles(names, source, cfg),
			cols = cfg.cols || (process && process.stdout && process.stdout.columns) || 80,
			ranges = getRange(names, data),
			scale = (cols - cfg.padding[0] - cfg.padding[1] - 1 - ranges[0]) / (ranges[2] - ranges[1]),
			offset = ranges[0] + cfg.padding[0] - ranges[1] * scale

	for (var i=0; i< names.length; ++i) {
		var str = names[i],
				vals = data[names[i]],
				chars = cfg[vals.length]
		if (!chars) throw Error('invalid box plot dataset')

		for (var j=0; j<vals.length; ++j) {
			while (str.length < Math.round(vals[j] * scale + offset)) str += chars[2*j]
			str += chars[2*j + 1]
		}
		str += chars[2*j]
		cfg.ondone(str)
	}
}
function merge(def, opt) {
	var cfg = {}
	for (var i=0, ks = Object.keys(def); i<ks.length; ++i) cfg[ks[i]] = opt[ks[i]] || def[ks[i]]
	return cfg
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
