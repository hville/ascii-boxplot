<!-- markdownlint-disable MD004 MD007 MD010 MD041	MD022 MD024	MD032 MD036 -->
# ascii-boxplot

*ascii, character-only horizontal boxplots*

```text
patates							·			•		[---[==|==]---]		•		·
frites							 ·		 •		 [----[=|===]--]		•	 ·
poutines								·	 •		[----[=|=]----]		 •		 ·
choucroutte							·	•		[----[=|=]-----]	 •	 ·
```

• [Introduction](#Introduction) • [API](#API) • [Options](#Options) • [License](#license) •

```javascript
var boxplot = require('boxplot')
boxplot({
	label1: arrayOfSamples1,
	label2: arrayOfSamples2,
	label3: arrayOfSamples3,
})
```

## API

`boxplot(sourceData[, options])`

* `sourceData` object or array of samples. The keys are used as labels an array of sorted samples
* `options` optionsal configuration object

## Options

The optional `options` object can override any or all of the internal defaults

```javascript
var defaults = {
	1: ' • ',
	2: ' [=] ',
	3: ' [=|=] ',
	5: ' [-[=|=]-] ',
	7: ' • [-[=|=]-] • ',
	9: ' · • [-[=|=]-] • · ',
	cols: 0, // will attempt to autodetect if cols is falsy, defaulting to 80
	padding: [4, 4],
	probs: [0, .02, .09, .25, .50, .75, .91, .98, 1],
	ondone: function(str) { console.log(str) }
}
```

* `1..9` are the templates for a given quantile size. The even chars are for the actual values, the odd ones are repeated in-between
* `cols` the maximum width of the screen in characters
* `padding` left and right padding (after the longest label and before the right edge)
* `probs` the probabilities to be used when calculating the sample quantiles. Can be 1,2,3,5,7 or 9 chars long.
* `ondone` the action to do with the completed string

If the sample size is less or equal to `probs.length` the sample values are used as-is.
This means that precomputed quantile values can also be used

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
