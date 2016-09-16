var bp = require('../boxplot')
var c = require('cotest')

var N = 500,
		source = ['patates', 'frites', 'poutines', 'choucroutte'].reduce(makeData, {})

c('padding and columns', function() {
	bp(source, {
		padding: [10, 20],
		cols: 80,
		ondone: function(str) {
			str.split(/\n/).forEach(function(line) {
				console.log(line)
				c('<=', line.trim().length, 80-20)
			})
		}
	})
})
c('probs', function() {
	bp(source, {
		padding: [10, 10],
		probs: [.25, .50, .75],
		cols: 80,
		3: ' [=|=] ',
		ondone: function(str) {
			str.split(/\n/).forEach(function(line) {
				console.log(line)
				c('==', line.trim().slice(-1), ']')
			})
		}
	})
})
c('custom dist - Array', function() {
	bp([[1,2,3],[4,5,6],[7,8,9]], {
		padding: [5, 30],
		3: ' A<B<C ',
		ondone: function(str) {
			var len = 0
			str.split(/\n/).forEach(function(line) {
				console.log(line)
				c('>', line.trim().length, len)
				len = line.trim().length
			})
		}
	})
})
function makeData(obj, key) {
	obj[key] = []
	for (var i=0; i<N; ++i) obj[key][i] = i * (Math.random() + Math.random() - 1)
	return obj
}
