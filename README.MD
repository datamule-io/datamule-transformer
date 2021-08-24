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
So Rules is an array of methods that are executed in-order while the output of one rule is chained as an input to the next rule.
* Each rule is an array of a method-name + arguments. 
* If a rule has a method-name but no arguments, it can be simplified to just a string. E.g. `"length"` is the same as `["length"]`
* The `select` method that selects a field from the data by jsonpath can be shortened from `["select", "$.path"]` to just `"$.path"`

Let's take a deeper look into the rules above:

### select
`"name": ["!!", "$.name"]`  
This rule selects `name` property of the root element represented by `$`, and assigns it to 'name'.

### chaining
`"films": ["!!", "$.films", "length"]`  
This ruleset has 2 rules - the first selects the `films` property of the input data, which is an array. It then executes `length` method on the selected data, that returns 5

### selectAll
`"filmNames": ["!!", ["selectAll", "$.films..name"]]`  
The previous 2 selectors that we saw returned the first item that was found by jsonpath. If we want to select **all** items that match a jsonpath expression, then we have to use `selectAll` method, which will always return an array, even if only one item was found. So in this case `filmNames` will be an array that contains only the names from all films.

### select first item
`"firstFilm": ["!!", "$.films..name"]`  
Using the same expression as above, but with `select` rather than `selectAll`, `firstFilm` will get the value of the first film name.

