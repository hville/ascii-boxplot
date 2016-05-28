/*eslint no-console: 0*/
//var assign = require('object-assign')

/**
 * MODEL
 * a% == a/2*PI*N = f(r% == r/R)
 *
 * INPUT
 * N: number of turns
 * R: length of Radius
 * A: Angle of Radius
 * F: Sampling Frequency (nominal qty/turn)
 * b: tangent point (%R)
 *
 * CALCULATED
 * r = %R
 * a = %(2*PI*N)
 *
 * CURVE TYPES (a0=0, a1=1)
 * QUAD: a=2r-r^b; da/dr=2-br^(b-1); da0=2; da1=2-b; lin@ b=1, tan@b=2; max@ br^(b-1)=2
 *
 * EXP: a=r*exp(b(1-r)); da/dr=(1-br)*exp(b(1-r)); da0=exp(b); da1=(1-b); lin@ b=0; tan@ b=1 max@ r=1/b
 *
 * LOG: a=ln(br+1)/ln(b+1) da/dr= b / ((br+1)*ln(b+1))
 *
 * HYP: a = (z+1)r/(zr^b+1) da/dr= (z+1)/(zr^b+1) * (1 - b(zr^b)/(zr^b+1))
 */
function xy(center, radius, direction) { // actual position direction at stem
	return [center[0] + radius * Math.cos(direction), center[1] + radius * Math.sin(direction)]
}

function a(r, b) { // angle starting from 0 at leaf center
	//return r * Math.exp(b*(1-r))
	//console.log(1 - Math.pow(1-r, b), r, b)
	//return 1 - Math.pow(1-r, b)
	var aa=0.4
	return 1 - Math.pow(1-Math.pow(r,aa), b)
	//return Math.log(b*r +1) / Math.log(b +1)
	//return 5*r - 4*Math.pow(r,b)
	//var aa = 3
	//return (aa+1)*r - aa * Math.pow(r, b/aa + 1)
	//return Math.pow(r, 1/b)
}

function dadr(r, b) {
	//return (1-b*r) * Math.exp(b*(1-r))
	//return 1 + b*Math.pow(1-r, b-1)
	var aa=0.4
	return b*Math.pow(1-Math.pow(r,aa), b-1) * (-aa)*Math.pow(r,aa-1)
	//return b / ( (b*r+1)*Math.log(b*r +1) )
	//return 5 - 4*b*Math.pow(r,b-1)
	//var aa = 3
	//return (aa+1)*r - (aa+b) * Math.pow(r, b/aa)
	//return Math.pow(r, 1/b-1) / b
}

// TO GET AN APPROXIMATE CONSTANT ANGLE SAMPLING
function Δr(N, F, r, b) {
	return 1/(N*F * Math.sqrt( Math.pow(r*dadr(r, b), 2) + 1))
}

function curve(stemXY, radius, width, direction, turns, escape, frequency) {
	return {
		R: radius,
		W: width,
		A: direction - Math.PI - 2*Math.PI*turns,
		N: turns,
		b: escape,
		F: frequency,
		P0: stemXY,
		PN: xy(stemXY, radius, direction),
		r: 1, //current %R from leaf
		a: 1, //current angle from leaf
		xys: [stemXY],
		pts: []
	}
}

function step(itm) {
	var displayRadius = itm.r * itm.R,
			displayAngle = itm.A + itm.a * 2*Math.PI*itm.N

	itm.pts.push(xy(itm.PN, displayRadius, displayAngle+itm.W/itm.R))

	while (itm.r > 0) {
		var dr = Δr(itm.N, itm.F, itm.r, itm.b)
		if (dr > itm.r) {
			itm.r = 0
			itm.xys.push(itm.PN)
			itm.pts.push(itm.PN)
		} else {
			itm.r -= dr
			itm.a = a(itm.r, itm.b)
			displayRadius = itm.r * itm.R
			displayAngle = itm.A + itm.a * 2*Math.PI*itm.N
			itm.xys.push(xy(itm.PN, displayRadius, displayAngle))
			itm.pts.push(xy(itm.PN, displayRadius, displayAngle+itm.W/itm.R))
		}
	}
	for (var i=itm.xys.length; i--;) {
		itm.pts.push([
			2*itm.xys[i][0]-itm.pts[i][0],
			2*itm.xys[i][1]-itm.pts[i][1]
		])
	}
	itm.xys = itm.pts

	return itm
}

module.exports = function(da) {
	var itms = []
	var N = 10
	for (var i=0; i<N; ++i) {
		var angle = 2*Math.PI/N*i + da
		itms[i] = step(curve(
			[0,0], //center
			0.23 + 0.13*Math.cos(angle), //radius
			0.03 - 0.012*Math.cos(angle), //width
			angle-da, //direction
			4.5 - 4*Math.cos(angle), //turns
			3.1 + 0.3*Math.cos(angle), //escape
			60 // frequency
		))
	}
	return itms
}
