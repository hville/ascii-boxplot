var minipatch = require('@private/json-patch').mini

module.exports = Store

function Store(initialState, callback) {
	var state = JSON.parse(JSON.stringify(initialState)),
			history = [],
			undone = []

	function store(cmd) {
		if (cmd && cmd[0] && cmd[0][0]) return store.patch(cmd)
		return store.get(cmd)
	}

	store.get = function(cmd) {
		return getter(state, cmd)
	}

	store.patch = function(patch) {
		var oldState = state
		state = minipatch(state, patch)
		if (state !== oldState) {
			history.push(patch)
			undone.length = 0
			callback(state, patch, oldState)
		}
		return state
	}

	store.undo = function() {
		var oldState = state
		undone.push(history.pop())
		state = JSON.parse(JSON.stringify(initialState))
		for (var i=0; i<history.length; ++i) state = minipatch(state, history[i])
		callback(state, [['r'], [], state], oldState)
		return state
	}

	store.redo = function() {
		if (undone.length) store(undone.pop())
	}

	store.sub = function(root) {
		if (!Array.isArray(root)) root = [root]
		return function(cmd) {
			if (cmd === undefined) return store.get(root)
			return store.patch([['r', root, cmd]])
		}
	}

	return store
}

function getter(obj, ks) {
	if (ks === undefined) return obj
	if (!Array.isArray(ks)) return obj[ks]
	for (var i=0, res=obj; i<ks.length; ++i) res = res[ks[i]]
	return res
}
