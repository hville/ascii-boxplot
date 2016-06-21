var tableView = tableViews.table//,
//		inputCell = tableViews.inputCell

var placesColumns = [
	{key: 'name', tbody:cell, thead: 'name', tfoot: 'name'},
	{key: 'types', tbody:cell, thead: 'types', tfoot: 'types'}
	//{key: 'location', tbody:view('td'), thead: 'location', tfoot: 'location'},
	//{key: 'score', tbody:inputCell, thead: 'score', tfoot: 'score'}
]
var typesColumns = [
	{key: 'type', tbody:cell, thead: 'types', tfoot: 'types'},
	{key: 'weight', tbody:inputCell, thead: 'weight', tfoot: 'weight'}
]

var placeTable =	tableView({origin: '', columns: placesColumns})
var typesTable =	tableView({origin: '', columns: typesColumns})
typesTable.update(Object.keys(type1).map(function(k){
	return {type: k, weight: type1[k]}
}).sort(function(a,b) {
	return b.weight - a.weight
}))
