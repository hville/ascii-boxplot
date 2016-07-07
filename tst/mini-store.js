/* eslint no-console:0 */
require('untap').pipe()
var tt = require('tt'),
		Store = require('../src/mini-store')

tt('basic', function(t) {
	var store = Store({a:'a'}, function(n,p,o) {
		t.notEqual(n,o)
	})
	t.equal(store().a, 'a')
	store([['a', ['b'], 'b']])
	t.equal(store().b, 'b')
	store.undo()
	t.equal(store().b, undefined)
	store.redo()
	t.equal(store().b, 'b')

	var subA = store.sub('a')
	var subB = store.sub(['b'])
	t.equal(subA(), 'a')
	t.equal(subB(), 'b')
	subA('aa')
	t.equal(subA(), 'aa')
	t.equal(subB(), 'b')
	subB('bb')
	t.equal(subA(), 'aa')
	t.equal(subB(), 'bb')

	t.end()
})
