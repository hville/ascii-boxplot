'use-strict'
var frzr = require('frzr'),
		patch = require('@private/json-patch'),
		tableViews = require('./tbl'),
		tableViews2 = require('./tb2')
		//view = require('./view'),
		//calc = require('./calc')
//require('./map')

var store = [
	{id: 'one', val: 1, txt: '1'},
	{id: 'two', val: 2, txt: '2'},
	{id: 'six', val: 2, txt: '3'}
]

var tableView = tableViews.table,
		inputCell = tableViews.inputCell,
		sumCell = tableViews.sumCell,
		cell = tableViews.cell

var tableView2 = tableViews2.table,
		inputCell2 = tableViews2.inputCell,
		sumCell2 = tableViews2.sumCell,
		cell2 = tableViews2.cell

var columns = [
	{key: 'id', tbody:cell, thead: frzr.el('th', 'myid1'), tfoot: frzr.el('th', 'myid1')},
	{key: 'val', tbody:inputCell, thead: frzr.el('th', 'myid2'), tfoot: sumCell},
	{key: 'txt', tbody:inputCell, thead: frzr.el('th', 'myid3'), tfoot: 'justText'}
]

var columns2 = [
	{key: 'id', tbody:cell2, thead: frzr.el('th', 'myid1'), tfoot: frzr.el('th', 'myid1')},
	{key: 'val', tbody:inputCell2, thead: frzr.el('th', 'myid2'), tfoot: sumCell2},
	{key: 'txt', tbody:inputCell2, thead: frzr.el('th', 'myid3'), tfoot: 'justText'}
]


function dispatch(act, pth, arg) {
	store = patch([{op:'replace', path:pth, value:arg}], store).doc
	window.requestAnimationFrame(function() {
		table.update(store)
	})
}

var table =	tableView({origin: '', dispatch: dispatch, columns: columns})
table.update(store.slice(1))
frzr.mount(document.body, table)

var table2 =	tableView2({origin: '', dispatch: dispatch, columns: columns2})
table2.update(store.slice(1))
console.log(table2)
frzr.mount(document.body, table2)


var update = table.update.bind(table)
var update2 = table2.update.bind(table2)

setTimeout(update, 200, store.slice(2))
setTimeout(update2, 400, store.slice(2))

setTimeout(update, 600, store.slice(0))
setTimeout(update2, 800, store.slice(0))

setTimeout(update, 1000, store)
setTimeout(update2, 1200, store)
