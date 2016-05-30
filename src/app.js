'use-strict'
var domCo = require('@private/dom-co'),
		patch = require('@private/json-patch'),
		tableViews = require('./tbl')

var store = [
	{id: 'one', val: 1, txt: '1'},
	{id: 'two', val: 2, txt: '2'},
	{id: 'six', val: 2, txt: '3'}
]

var tableView = tableViews.table,
		inputCell = tableViews.inputCell,
		sumCell = tableViews.sumCell,
		cell = tableViews.cell

var columns = [
	{key: 'id', tbody:cell, thead: domCo.el('th', 'myid1'), tfoot: domCo.el('th', 'myid1')},
	{key: 'val', tbody:inputCell, thead: domCo.el('th', 'myid2'), tfoot: sumCell},
	{key: 'txt', tbody:inputCell, thead: domCo.el('th', 'myid3'), tfoot: 'justText'}
]

function dispatch(act, pth, arg) {
	store = patch([{op:'replace', path:pth, value:arg}], store).doc
	window.requestAnimationFrame(function() {
		table.update(store)
	})
}

var table =	tableView({origin: '', dispatch: dispatch, columns: columns})
table.update(store.slice(1))
domCo.mount(document.body, table)

var update = table.update.bind(table)

setTimeout(update, 200, store.slice(2))

setTimeout(update, 600, store.slice(0))

setTimeout(update, 1000, store)
