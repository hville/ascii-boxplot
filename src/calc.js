/*eslint no-console: 0*/
var assign = require('object-assign')

function step(itm) {
	if (itm.tv <= 0) return itm
	var dt = 1 / itm.N,
			dx = itm.tv * Math.cos(itm.pa) * dt,
			dy = itm.tv * Math.sin(itm.pa) * dt,
			dv = itm.ta * dt

	var dθ = itm.tv ? Math.atan(itm.ca * dt / itm.tv)
		: itm.ca > 0 ? Math.PI/2
		: - Math.PI/2

	itm.t += dt
	itm.px += dx
	itm.py += dy
	itm.pa += dθ
	itm.ca += itm.cc * dt
	itm.tv += dv

	console.log('0:',
		'dr/dt', (Math.sqrt(dx*dx + dy*dy)/dt).toPrecision(3),
		'dθ/dt', (dθ/dt).toPrecision(3),
		'dv/dt', (dv/dt).toPrecision(3)
	)

	return itm
}

function step2(itm) {
	if (itm.tv <= 0) return itm
	//itm.cω = itm.ca / itms.tv // 1/T
	//itm.dt = opt.fdraw * opt.fcalc / itm.cω
	//++itm.n
	//var ω = itm.tv ? Math.tan(	itm.ca / itm.tv) : Math.PI/2 //Math.atan(itm.ca / itm.tv)
	//var dt = ω ? Math.abs(2 * Math.PI / ω / opt.fdraw / opt.fcalc) : (1-itm.t)/(itm.N-itm.n)

	var dt = 1 / itm.N,
			dx = itm.tv * Math.cos(itm.θ) * dt,
			dy = itm.tv * Math.sin(itm.θ) * dt,
			dv = itm.ta * dt,
			dθ = itm.ω * dt,
			dω = itm.α * dt

	itm.t += dt
	itm.px += dx
	itm.py += dy
	itm.tv += dv
	itm.θ += dθ
	itm.ω += dω

	console.log('1:',
		'dr/dt', (Math.sqrt(dx*dx + dy*dy)/dt).toPrecision(3),
		'dθ/dt', (dθ/dt).toPrecision(3),
		'dv/dt', (dv/dt).toPrecision(3),
		'dω/dt', (dω/dt).toPrecision(3),
		'dθ', dθ.toPrecision(3)
	)

	return itm
}

module.exports = function(items, options) {
	// a pair of lines with each tip an attractor to the other
	var itm = {
		N: 40,
		// POSITION
		px: +0, // %R
		py: +0,	// %R
		pa: +0, // rad
		// VELOCITY
		tv: +2, // R/T
		// SWIRL
		ca: -7, // R/T**2
		cc: +40, // R/T**3
		// Branching
		nb: 1, // branching / T
		// CALCULATED / OTHER
		ta: 0, // R/T**2, = -v/T
		init: function() {
			this.ta = -this.tv
		}
	}
	itm.init()

	var itm2 = {
		N: 40,
		// POSITION
		px: +0, // %R
		py: +0,	// %R
		θ: +Math.PI, // rad
		// VELOCITY
		tv: +2, // R/T
		// SWIRL
		nt: 2,
		ω: -2*Math.PI,
		// Branching
		nb: 1, // branching / T
		// CALCULATED / OTHER
		α: 0,
		ta: 0, // R/T**2, = -v/T
		init: function() {
			this.α = 2 * (2*Math.PI * this.nt - this.ω)
			this.ta = -this.tv
		}
	}
	itm2.init()

	var opt = assign({
		//T: 1,
		//R: 1,
		thick: 0.05, // uLength/uSpeed = uTime
		fdraw: 9, // elements/rotation
		fcalc: 2 // samples/elements = samples/(uRotVel*uTime) =
	}, options)

	var res = [[itm.px, itm.py, itm.tv]]
	var res2 = [[itm2.px, itm2.py, itm2.tv]]

	function next() {
		if (itm.tv < 0) return {done: true, value: [res, res2]}
		for (var i=0; i<opt.fcalc; ++i) {
			itm = step(itm, opt)
			itm2 = step2(itm2, opt)
		}
		res.push([itm.px, itm.py, itm.tv])
		res2.push([itm2.px, itm2.py, itm2.tv])
		return itm.tv < 0 ? {done: true, value: [res, res2]} : {value: [res, res2]}
	}

	return {
		next: next
	}
}
