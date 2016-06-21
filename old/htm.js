var DOCTYPE = '<!doctype html>',
		MANIFEST = '<html manifest="offline.manifest">'

//<html><head>
//<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
//<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
//<script></script>
//<meta charset="utf-8">
//<title>marcheville</title>
//<style type="text/css">@import "./node_modules/milligram/dist/milligram.css";</style>
//<meta charset="utf-8" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
//<!--<link href="styles.css" rel="stylesheet">-->
//</head>

var el0 = ['body',
	['#header',	['span', 'enMarche']],
	['#left', ['#map']],
	['#right',
		['input#city', {value:'Kuala Lumpur'}]
		['input#city', {value:'Kuala Lumpur'}]
	],
	['#footer',	['span', 'enMarche']],
	['script', {src:'app.js', async:true, defer:true}]
]

var el1 = body(
	div('#header',	span('enMarche')),
	div('#left', div('#map')),
	div('#right',
		input('#city', {value:'Kuala Lumpur'}),
		input('#city', {value:'Kuala Lumpur'})
	),
	div('#footer',	span('enMarche')),
	script({src:'app.js', async:true, defer:true})
)
<body>
	<div id="header">
		<span>enMarche</span>
	</div>
	<div id="left">
		<div id="map" ></div>
	</div>
	<div id="right">
		<input id="city" value="Kuala Lumpur"></input>
		<input id="types"></input>
	</div>
	<div id="footer"></div>
	<script src="app.js" async defer></script>
</body>
</html>
