/* eslint no-console: 0, no-loop-func: 0*/
'use strict'
var tt = require('tt')//,
//		patch = require('@private/json-patch')

var setTests = require('../node_modules/json-patch-test-suite/tests.json')
var setSpecs = require('../node_modules/json-patch-test-suite/spec_tests.json')

var patcher = require('../src/index.js')

function tSet(t, set) {
	var result
	for (var i=0; i<set.length; ++i) {
		var src = set[i].doc
		if (set[i].disabled) t.comment(i + ': disabled')
		// must not fail
		else if (set[i].expected) {
			result = patcher(set[i].patch, src)
			t.deepEqual(result.doc, set[i].expected)
			t.ok(!result.err, 'result.err must be undefined')
			if (result.err) console.log('UNEXPECTED ERROR: ',result.err, set[i])
		}
		else if (set[i].error !== undefined) t.throws(function(){
			result = patcher(set[i].patch, src)
			t.deepEqual(result.doc, src)
			t.ok(result.err, 'result.err must be defined')
			console.log(result.err)
			if (result.err) throw result.err
			else console.log('MISSED ERROR: ',set[i])
		})
	}
}

tt('tests', function(t) {
	tSet(t, setTests)
	t.end()
})

tt('spec_tests', function(t) {
	tSet(t, setSpecs)
	t.end()
})

