import bp from './boxplot.js'
import t from 'assert-op'

var N = 500,
		source = ['patates', 'frites', 'poutines', 'choucroutte'].reduce(makeData, {})

t('wide and narrow', a => {
	bp({fat:[0,1,2,3,4,5,6,7,8],bit:[1,1,1,1,1,1,1,1,1]}, {
/* 		ondone: function(str) {
			str.split(/\n/).forEach(function(line) {
				console.log(line)
				a('<=', line.trim().length, 80-20)
			})
		}
 */	})
})
t('padding and columns', a => {
	bp(source, {
		padding: [10, 20],
		cols: 80,
		ondone: function(str) {
			str.split(/\n/).forEach(function(line) {
				console.log(line)
				a('<=', line.trim().length, 80-20)
			})
		}
	})
})
t('probs', a => {
	bp(source, {
		padding: [10, 10],
		probs: [.25, .50, .75],
		cols: 80,
		3: ' [=|=] ',
		ondone: function(str) {
			str.split(/\n/).forEach(function(line) {
				console.log(line)
				a('==', line.trim().slice(-1), ']')
			})
		}
	})
})
t('custom dist - Array', a => {
	bp([[1,2,3],[4,5,6],[7,8,9]], {
		padding: [5, 30],
		3: ' A<B<C ',
		ondone: function(str) {
			var len = 0
			str.split(/\n/).forEach(function(line) {
				console.log(line)
				a('>', line.trim().length, len)
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
