# Datamule Transformer

Transformer is a JSON to JSON declarative processing library for node.

It accepts data object and a transformation template, and returns a new JSON.

## Example
Let's take the following data: 
```json
{
    "name": "Luke Skywalker",
    "height": "172",
    "homeworld": "https://swapi.co/api/planets/1/",
    "films": [
        { "name":"film2", "url":"https://swapi.co/api/films/2/"},
        { "name":"film6", "url":"https://swapi.co/api/films/6/"},
        { "name":"film3", "url":"https://swapi.co/api/films/3/"},
        { "name":"film1", "url":"https://swapi.co/api/films/1/"},
        { "name":"film7", "url":"https://swapi.co/api/films/7/"}
    ]
}
```
And the following transformation template
```json
{
    "type": "character",
    "name": ["!!", "$.name"],
    "films": ["!!", "$.films", "length"],
    "filmNames": ["!!", ["selectAll", "$.films..name"]],
    "firstFilm": ["!!", "$.films..name"]
}
```
If we run `dmt.transform(data, template)` we will get:
```json
{
    "type": "character",
    "name": "Luke Skywalker",
    "films": 5,
    "filmNames": ["film2", "film6", "film3", "film1", "film7"],
    "firstFilm": "film2"
}
```

### What is going on here?
As you can see, the template is a json. All literal strings, numbers, booleans, objects and arrays are simply output as is. 
This is why `"type": "character"` from the template appears in the output.
All arrays that have `"!!"` as their first item are executed as set of rules

## rules
So Rules is an array where each item is a separate rule. They are executed in-order while the output of one rule is chained as an input to the next rule.
* Each rule is an array of a method-name + arguments. 
* If a rule has a method-name but no arguments, it can be simplified to just a string. E.g. `"length"` is the same as `["length"]`
* The `select` method that selects a field from the data by jsonpath can be shortened from `["select", "$.path"]` to just `"$.path"`

Let's take a deeper look into the rules above:

* **select**  
    `"name": ["!!", "$.name"]`  
    This rule selects `name` property of the root element represented by `$`, and assigns it to `name` property.

* **chaining**  
    `"films": ["!!", "$.films", "length"]`  
    This ruleset has 2 rules - the first selects the `films` property of the input data, which is an array. It then executes `length` method on the selected data, that returns 5

* **selectAll**  
    `"filmNames": ["!!", ["selectAll", "$.films..name"]]`  
    The previous 2 selectors that we saw returned the first item that was found by jsonpath. If we want to select **all** items that match a jsonpath expression, then we have to use `selectAll` method, which will always return an array, even if only one item was found. So in this case `filmNames` will be an array that contains only the names from all films.

* **select first item**  
    `"firstFilm": ["!!", "$.films..name"]`  
    Using the same expression as above, but with `select` rather than `selectAll`, `firstFilm` will get the value of the first film name.

## API
DatamuleTransformer exposes 2 main methods: 
* `applyRules (data, rules, options)` - applies the provided rules (array) in order on the data. The rules array does not have to start with '!!', but it can. Returns the transformed data.
* `transform (data, template, options)` - executes the transformation template on `data`. Returns the transformed data.  

`options` is an object that currently can optionally have one property only: `extensionsProvider`. See details below.
For the docs below we'll be using the following sample data:  
```javascript 
const cities = ["London", "Paris", "New York", "Jerusalem"];
const king = "Arthur";
const numbers = [13, 1, 22, 100.5];
const decimals = [0.5, 3.001, 29.999, -2.01, -5.5];
const book = {
  "author": "Stephan King",
  "isbn": "9884958-3837485",
  "title": "IT",
  "price": "39.9"
};
const contacts = [{
      "id": "61281445910b9d4c3bc0ed50",
      "balance": "$1,025.68",
      "picture": "http://placehold.it/32x32",
      "age": 30,
      "name": "Elise Landry",
      "gender": "female",
      "email": "eliselandry@unia.com",
      "phone": "+1 (902) 442-3272",
      "tags": [
        "ad",
        "ipsum",
        "id",
        "aliquip",
        "irure",
        "aute",
        "et"
      ]
    },
    {
      "id": "6128144551fd14ee6d6239ce",
      "balance": "$1,135.05",
      "picture": "http://placehold.it/32x32",
      "age": 21,
      "name": "Constance Craig",
      "gender": "female",
      "email": "constancecraig@tribalog.com",
      "phone": "+1 (941) 541-2934",
      "tags": [
        "sit",
        "est",
        "eu",
        "voluptate",
        "dolor",
        "laboris",
        "ad"
      ]
    }
]
```
#### join
`["join", <separator>]` - concatenates all items in an array, with `separator` between each item.
```javascript
dmt.applyRules(cities, [["join", ","]])
// "London,Paris,New York,Jerusalem"
```
#### length
Returns the length of an array or a string. Length of other data types is not defined.
```javascript
dmt.applyRules(cities, ["length"])
// 4

dmt.applyRules(king, ["length"])
// 6
```

#### min
Returns the min value from an array. Ignores `undefined`, `null` and `NaN` values. Works for any comparable data type. If no comparable data types found in the array, returns `undefined`
```javascript
dmt.applyRules(numbers, ["min"])
// 1
dmt.applyRules(numbers, ["min"])     
// "Jerusalem"
```
#### max
Returns the max value from an array. Ignores `undefined`, `null` and `NaN` values. Works for any comparable data type. If no comparable data types found in the array, returns `undefined`
```javascript
dmt.applyRules(numbers, ["max"])
// 100.5
dmt.applyRules(numbers, ["max"])     
// "Paris"
```
#### extent
#### minIndex
#### maxIndex
#### select
#### selectAll
#### sum
#### mean
#### median
#### cumsum
#### fcumsum
#### quantile
#### quantileSorted
#### variance
#### deviation
#### round
#### ceil
#### floor
#### trunc
#### toFixed
#### fsum
#### each
Runs a set of rules on each item in an array, and returns the result. The rules parameter doesn't have to start with `"!!"` since it's expected to be executable rules.
```javascript
dmt.applyRules(decimals, [
  ["each", ["round"]]
]);
// [1, 3, 30, -2, -6]
```
#### map
Runs a transformation on a given object. Commonly useful in combination with `each`. The transformation is expressed as a template, exactly as `dmt.transform` expects.
```javascript
dmt.applyRules(book, [["map", {
  "Author": "$.author",
  "Name": "$.title"
}]]);
/*
{
  "Author": "Stephan King",
  "Name": "IT"  
}
*/

dmt.applyRules(contacts, [
    ["each",
        [["map", {
            "name": ["!!", "$.name"],
            "email": ["!!", "$.email"],
            "tags": ["!!", "$.tags", ["join", ","]]
        }]]
    ]
]);
/*
[
    {
        "name": "Elise Landry",
        "email": "eliselandry@unia.com",
        "tags": "ad,ipsum,id,aliquip,irure,aute,et"
    },{
        "name": "Constance Craig",
        "email": "constancecraig@tribalog.com",
        "tags": "sit,est,eu,voluptate,dolor,laboris,ad"
    }    
]
*/
```

### extensions 
You can extend the functionality of DatamuleTransformer by providing a callback function that will handle your extensions. 
To pass the callback function, add it to the `options` parameter as follows:
```javascript
const options = {
    extensionsProvider: (ctx, data, ext, options) => {
      // implement your extensions
    }
}
dmt.applyRules(data, rules, options);
```

The signature of the `extensionsProvider` method, as you can see above, has 4 parameters:
* `ctx` - context parameter that has reference to `applyRules`, `transform` and your own `extensionsProvider` methods. You can use it if your extension needs to recursively call one of these methods.
* `data` - the data on which you need to operate. 
* `ext` - the name of the extension that was used by the rule that triggered the extension
* `options` - additional parameters that were passed by the rule that triggered the extension.

To call an extension, the rule should prepand the extension name it with `$$.`
Let's see some examples:
```javascript
// an extension provider that simply echos the name of the extension
const extensionsProvider = (ctx, data, ext) => {
    return ext;
}
const data = {};
const rules = ['$$.foo']
console.log (dmt.applyRules(data, rules, { extensionsProvider }));
// 'foo'
);
```

```javascript
// an extension that adds the provided parameter to data 
const extensionsProvider = (ctx, data, ext, options) => {
    if (typeof data !== 'number') {
        return data;
    }
    const arg = options && options[0] ? options[0] : 0;
    return data + arg;
}
const data = 5;
const rules = [['$$.add', 7]]
console.log (dmt.applyRules(data, rules, { extensionsProvider }));
// 12
);
```