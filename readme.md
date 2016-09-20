<!-- markdownlint-disable MD004 MD007 MD010 MD041  MD022 MD024  MD032 MD036 -->
# ascii-boxplot

*ascii, character-only horizontal boxplots*

```text
patates        ·      •    [----[==|==]----]    •    ·
frites       ·   •   [---[=|===]--]   •   ·
poutines       ·   •    [----[=|=]----]     •     ·
choucroutte       ·  •    [----[=|=]-----]   •   ·
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

* `sourceData` object or array of samples. The object keys or array indices are used as labels
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

* `1..9` are the templates for a given quantile size. More info in the [template section](#templlate) below
* `cols` the maximum width of the screen in characters
* `padding` left and right padding (after the longest label and before the right edge)
* `probs` the probabilities to be used when calculating the sample quantiles. Can be 1,2,3,5,7 or 9 chars long.
* `ondone` the action to do with the completed string

If the sample size is less or equal to `probs.length` the sample values are used as-is.
This means that precomputed quantile values can also be used

### Templates

There are different templates for different number of probability points.
For example, the default probability `[0, .02, .09, .25, .50, .75, .91, .98, 1]`
has nine points and the display of the resulting values will use template #9.

A template string has `2n+1` characters and has the form `svsvsv...`
where alternating characters are used for actual values `v` and for spacing.

Examples:

```javascript
boxplot(data, {
  probs: [0.25, 0.5, 0.75],
  3:`.L-M-H.`
}) // --> something like '....L----M---H....'
boxplot(data, {
  probs: [0.09, 0.25, 0.5, 0.75, 0.],
  3:` |-##|##-| `
}) // --> something like ' |---###|####-----| '
```

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
