/* global __dirname */
var webpack = require('webpack'),
		nodeEnv = require('@private/node-env')

var envVars = {}

nodeEnv('TODO').forEach(function(k) {
	envVars[k] = process.env[k]
})

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
	},
	plugins: [ //process.env.NODE_ENV === 'development' ? process.env.GOOGLE_DEV_KEY : process.env.GOOGLE_API_KEY
		new webpack.DefinePlugin({'process.env': envVars})
/*		new webpack.DefinePlugin({'process.env': {
			'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'GOOGLEMAPS_DEV_KEY': JSON.stringify(process.env.GOOGLEMAPS_DEV_KEY),
			'GOOGLEMAPS_API_KEY': JSON.stringify(process.env.GOOGLEMAPS_API_KEY),
			'API_URL': JSON.stringify(process.env.API_URL)
		}})*/
	]
}
