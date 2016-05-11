var mRouteModes	= {pathname: '', hash: '#', search: '?'}



function getRoute() {
	var rMode = m.route.mode;
	return location[rMode].slice(mRouteModes[rMode].length);
}


if (typeof window !== 'undefined') {		//skip for testing inside node
	window.addEventListener('popstate', function(e) {
		var eventState = e.state;
		var newRoute = getRoute();
		// if route has not changed, change the state and redraw
		if (eventState && newRoute === lastRoute) {
			var unit = pathMap[newRoute];
			unit.state(eventState)
			m.redraw()
			//m.mount(document.body, unit);
		}
		lastRoute = newRoute;
	})
}


function unitState(unit) {
	//unitMap[unit.unit] = unit;
	pathMap[unit.s.path] = unit;
	//saveMap[unit.unit] = {unit:unit.unit, time:, x:unit.x, u:unit.u};


	function state(stateObj) {	// app.state() getter-setter
		if (!stateObj) {
			if (!unit.u) return {unit: unit.unit, time:uidB64(6), proj: unit.proj, note: unit.note, x: unit.x}
			return {unit: unit.unit, time:uidB64(6), proj: unit.proj, note: unit.note, x: unit.x, u:unit.u}
		}
		if (!unit.validate(stateObj))	{ log.warn(unit.validate.error); return }
		unit.config.reset(stateObj.u)
		unit.items.reset(stateObj.x)
		unit.proj = stateObj.proj
		unit.note = stateObj.note
		unit.time = uidB64(6)
	}


	function setState() {
		if (history.state) pushState()
		else replaceState()
	}


	function pushState() {
		lastRoute = getRoute();
		history.pushState( state() , unit.unit);
	}


	function replaceState() {
		lastRoute = getRoute();
		history.replaceState( state() , unit.unit);
	}


	function saveState() {
		var stateObj = state()
		localStorage.setItem( stateObj.time+'.'+stateObj.proj+'.'+stateObj.unit+'.'+stateObj.note, JSON.stringify( stateObj ) )
	}


	function loadLast() {
		for (var i=0, keys=[], j=0; i<localStorage.length; ++i) {
			if (localStorage.key(i).split('.')[2] === unit.unit) keys[j++] = localStorage.key(i)
		}
		keys.sort()
		while(j--) {
			var savedUnit = tryJson(localStorage.getItem(keys[j]))
			if ( unit.validate(savedUnit) ) break
		}
		if (savedUnit && savedUnit.u && !Object.keys(savedUnit.u).length) savedUnit.u = undefined
		state( savedUnit )
	}


	//TODO should this be called directly or in sequence or through events???
	//TODO replace state.set with state.push
	//TODO replace all other state. method calls
	state.push = setState;
	//state.push = pushState;
	//state.replace = replaceState;
	state.load = loadLast;
	state.save = saveState;



	return state;
}


module.exports = unitState;
