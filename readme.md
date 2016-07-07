# TODO
## Collection Path
`id = collection[0].id; path = ['collection', '0', 'id']`
If the data is resorted, the id no longer matches the index

## CONCLUSION
### URI STYLE
* `&` or `;` for AND: `?id=x&val=3&closed=` or `?id=x;val=3;closed=`
* `,` for OR `?id=x,val=3,closed=`
* `...&x=&...` for undefined
* `...&sold&...` for truthy

### MAYBE
`/foo?id=hu` : all prop where id===hu => `/foo/0`
`/foo?id=hu/name` : all prop where id===hu => `/foo/0/name`
`/foo/?id=hu` : first prop where id===hu => `/foo/0`
`/foo/?id=hu/name` : all prop where id===hu => `/foo/0/name`
`/foo/*id=hu` : all props where id===hu => `[/foo/0, /foo/1]`
`-` for neg numbers
* JsonPinter Escapes `~0:~`, `~1:/`
- `~2:?`, `~3:&`, `~4|`, `~5:*`, !, ^

### PATH STYLE
* array: `['collection', '0', 'id']` => `['collection', '?id=key', 'val']`
* pointer: `['collection', '0', 'id']` => `/collection/?id=key/val']`

## OTHER
regex: [a, b, /^.$/, ]
Glob: /a/b/**/c/*/?ar, /[0-2]/[abc]/?/[!abc]

# BACKGROUND
## REQUIREMENTS
* need to access specific key, regardless of index `first index where id=key`
* need to be a string to be used inside a JSON pointer or a path array
- need to specify if one or many results `all indices where id=key`
- ?multiple `all | first index WHERE id=key AND ready=true`

## CSS3 SELECTORS
for ideas only.
`[att^=val]` – the “begins with” selector
`[att$=val]` – the “ends with” selector
`[att*=val]` – the “contains” selector
`[att]` – all where att === true
`[att~=val]` – strick equal
`[att|=val]` – ???
`[?:first-child]` – ???

## [URI](http://www.ietf.org/rfc/rfc3986.txt)
safe: `~-_A-Za-z0-9`
query: `? query # fragment` eg. `?name=ferret#nose`
url encoding: `*~-._A-Za-z0-9` are left as-is
uri: `!$&'()*+,;=` are permitted by generic URI unencoded in the user information, host, and path as delimiters
...the semicolon (";"), comma (",") and equals ("=") reserved characters are often used to delimit parameters and parameter
For example,
one URI producer might use a segment such as `name;v=1.1` to indicate a reference to version 1.1 of "name",
whereas another might use a segment such as `name,1.1` to indicate the same
Thus commas are explicitly allowed within query strings

## [URI TEMPLATE DRAFT](https://datatracker.ietf.org/doc/rfc6570/)
`http://www.example.com/foo?query=mycelium&number=100`
 `.../content?parentList=15,16&type=note`
`?list=val1&list=val2&list=val3`
`http://example.com/search?q=chien&lang=fr`
`?x=1024&y=768&empty=` - for undefined values

## SOMEWHERE ON THE NET
* `/cars/?color=blue&type=sedan&doors=4`
* `/cars?color=blue;type=sedan`
* `/cars?color=black,blue,red;doors=3,5;type=sedan`
To search any cars, but not black and red:
`?color=!black,!red`
`color:(!black,!red)`

* github sagold/json-library
	* glob: `#/usr/**/*/pw`
	* filter: `#/input/*?valid:true`
	* regex pointer: `#/input/{name-.*}/id`
	* `#/pointer/{regex.*}/**/*?property:hasValue||property:otherValue`

* http://jmespath.org/
locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}
people[*].first

* npm json-query 4900dwld/m
`people[country=NZ].name` find the index in people where country=NZ
`lookup[*]`
`people[* rating >= 3 & starred = true]`


github steenk/key-value-pointer
regex: pointer: /^abc$/

- jsonapi.org
big objects

- jsonpath
$.store.book[?(@.length-1)].title

- jLinq
.omething().method().tralala()

- jq
'.foo .projects[]'

- RQL
rating=5&price=lt=10 //lt opertor i.e. lt(price.10)
/data?foo=3

- JSONiq
Objects

- hapijs: ljharb/qs (The qs module was originally created and maintained by TJ Holowaychuk.)
foo[bar] -> {foo:{bar: val}}
foo[bar][baz]=foobarbaz
a[]=b&a[]=c

- searchjs / jsql
Objects



