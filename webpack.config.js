/* global __dirname */

// INDEX.HTML
//var fs = require('fs')
//fs.writeFileSync('./bld/index.html', fs.readFileSync('./htm/index.html'))

module.exports = {
	entry: {
		app: './src/app.js'
	},
	target: 'web',
	devtool: 'source-map',
	//	node: { fs: 'empty' }, //for devtool source-map
	output: {
		path: __dirname,
		filename: '[name].js',
		sourceMapFilename: '[file].map',
	},
	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	}
}
