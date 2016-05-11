# TODO
* +test ~ before regex ++faster
* +CONCAT ++smaller, +faster
* +MainFunction ~smaller +faster
* ~MAPLOOKUP ~smaller, ~faster
* imm|mut versions ?
* ?split arr|obj ops ???
* README


# Introduction
# Goals
* atomic - the source document is not modified if the patch fails
* small and focused - only about applying a patch
* does not throw - the response includes the document and the errors if any.

# Use Cases
* immutable - shallow clones: document AND patch values are never changed
	* `result = patcher(smallPatch, anyDoc)` shallow clones on every path and every item
* mutable - NOT ATOMIC document and patches are changed. Clone First
	* `result = patcher(clone(smallPatch), clone(anyDoc))` 1-clone
* megaDoc - miniPatch: immutable - small changes
* miniDoc - megaPatch: mutable - big|all changed
* mega - mega - ???
* mini - mini - ???
*

`myNewDoc = treatResultOrErrors( patcher( preprocessor(customPatch), myDoc )`


#ideas
* patcher(patch)
	* patch first: `(patch, document) => document'`
	* `doc===undefined`
	* no cloning required: `MUTABLE`
* !doc || typeof doc !== object `MUTABLE`
* preprocessor query > prepath parent validation > path Array param



#benchmarks

## imm
starcounterjack 681-666-617-660-679-600-558-591-604
*minimu 297-304*-300-295-302-292 noegex-preregex 513 mainfcn 462-494
jiff 165-178-170-173-175-157-147-152
*miniim* SWITCH:150-141-143-143-147 lookup 148 splitAdd 140 concat 135 noegex 185-144 preregex 137 mainfcn 154-158
rfc 129 130 131 123 126-128-123-125
dharma 112 119 109 109 119-107-112-111




**/cars/?color=blue&type=sedan&doors=4**
**/cars/color:blue/type:sedan/doors:4**
**/cars/doors/4/name/cam*/colors/red,blue,green **
/cars?color=blue&type=sedan&doors=4
color=blue&type=sedan&doors=4/engines
/cars?color=blue;type=sedan	 #most prefered by me
/cars;color-blue+doors-4+type-sedan	 #looks good when using car-id
/cars?color=blue&doors=4&type=sedan	 #I don't recommend using &*
/cars[?;]color[=-:]blue[,;+&]
/cars?color=black,blue,red;doors=3,5;type=sedan	 #most prefered by me
/cars?color:black:blue:red;doors:3:5;type:sedan
/cars?color(black,blue,red);doors(3,5);type(sedan)	 #does not look bad at all
/cars?color:(black,blue,red);doors:(3,5);type:sedan	 #little difference
To search any cars, but not black and red:
?color=!black,!red
color:(!black,!red)
/garage[id=1-20,101-103,999,!5]/cars[color=red,blue,black;doors=3]
generic delimeters: :/?#[]@
sub-delimeters: !$&'()*+,;=
The CSS3 Selectors module introduces three new attribute selectors, which are grouped together under the heading “Substring Matching Attribute Selectors”.
These new selectors are as follows:
[att^=val] – the “begins with” selector
[att$=val] – the “ends with” selector
[att*=val] – the “contains” selector
'http://localhost:9200/twitter/tweet/_search?q=user:kimchy'
/path/file-name.suffix?query-string#hash
/path.html?p1=v1&p2=v2#more-details

`/foo?id=hu` : all prop where id===hu => `/foo/0`
`/foo?id=hu/name` : all prop where id===hu => `/foo/0/name`

`/foo/?id=hu` : first prop where id===hu => `/foo/0`
`/foo/?id=hu/name` : all prop where id===hu => `/foo/0/name`
`/foo/*id=hu` : all props where id===hu => `[/foo/0, /foo/1]`



HUPinter
JsonPinter ~, /
~2 => ?
~3 => &
~4 => |
~5 => *
!
^


/a/b/?c=1&d=2|e=f/
/a/b/*/?id=3


<a href="http://delicious.com/post?url=http://domain.tld/&title=The title of a post">Bookmark at Delicious</a>
PUT /gists/:id/star
GET /tickets?state=open
GET /tickets?sort=-priority
GET /tickets?state=closed&sort=-updated_at
http://maps.googleapis.com/maps/api/geocode/json?address=los+angeles,+ca&sensor=false


H1 pointer Query
/a/b/d=1&e=2,f=3/patate

H2 array
[a,b,*,?d=1&e=2|f=3,patate]

H2 regex
[a, b, /^.$/, ]

Glob
/a/b/**/c/*/?ar
/[0-2]/[abc]/?/[!abc]

URL Query String
/over/there?name=ferret
field1=value1&field1=value2&field2=value3

github sagold/json-library
glob pointer: #/usr/**/*/pw; #/input/*?valid:true
regex pointer: #/input/{name-.*}/id

github steenk/key-value-pointer
regex: pointer: /^abc$/

jsonapi.org
get /articles?include=author&fields[artiles]=title, body, author&fields[people]=name-

jsonpath
$.store.book[?(@.length-1)].title

jLinq
.omething().method().tralala()

jq
'.foo .projects[]'

RQL
rating=5&price=lt=10 //lt opertor i.e. lt(price.10)
/data?foo=3

JSONiq

ObjectPath
$..*[@..temp>25 and ...]

hapijs: ljharb/qs
foo[bar]=baz
foo[bar][baz]=foobarbaz
a[]=b&a[]=c




