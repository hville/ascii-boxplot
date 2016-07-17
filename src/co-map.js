/* global google */
var c = require('@private/dom-co').co

/**
 * @param	{{el:{object}, store:{object}, gmap:{object}}} opts Options for the new map component
 * @return {object} component
 */
module.exports = function(opts) { //el, store, gmap
	var hot = new google.maps.visualization.HeatmapLayer(),
			gmap = opts.gmap
	var co = c(opts.el, {
		store: opts.store,
		view: function(n, o) {
			if (n === o) return
			if (gmap.getZoom() !== n.zoom) gmap.setZoom(n.zoom)
			if (gmap.getCenter() !== n.city.location) gmap.setCenter(n.city.location)
			if (n.heatMap !== n.heatMap) hot.setOptions(n.heatMap)
		}
	})
	hot.setMap(gmap)
	gmap.addListener('zoom_changed', function() {
		co.store.act([['r', ['zoom'], gmap.getZoom()]])
	})
	gmap.addListener('center_changed', function() {
		co.store.act([['r', ['city', 'location'], gmap.getCenter()]])
	})
	return co
}

/*
function changeGradient() {
				var gradient = [
					'rgba(0, 255, 255, 0)',
					'rgba(0, 255, 255, 1)',
					'rgba(0, 191, 255, 1)',
					'rgba(0, 127, 255, 1)',
					'rgba(0, 63, 255, 1)',
					'rgba(0, 0, 255, 1)',
					'rgba(0, 0, 223, 1)',
					'rgba(0, 0, 191, 1)',
					'rgba(0, 0, 159, 1)',
					'rgba(0, 0, 127, 1)',
					'rgba(63, 0, 91, 1)',
					'rgba(127, 0, 63, 1)',
					'rgba(191, 0, 31, 1)',
					'rgba(255, 0, 0, 1)'
				]
				heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
			}
*/
/*function getTyp(ctr, key, rad) {
	ctx.typ.push(key)
	//console.log('SEARCHING type '+key+' in '+ctr.toString(), 'meta')
	ctx.srv.radarSearch({
		location: ctr, //OR bounds: map.getBounds()
		radius: rad,
		type: key
	}, function(res, status) {
		if (status !== ctx.pok) return callback('err', 'radarSearch error')
		ctx.lst.push(res)
		callback('typ', ctx)
	})
}
*/
