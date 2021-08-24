import * as d3array from "d3-array";
import * as array from './array-methods.js';
import * as numeric from './numeric-methods.js';
import * as select from './select-methods.js';
import jp from 'jsonpath';

function transform(data, jsonString) {
    if (!jsonString) {
        throw new Error("jsonString config must be provided")
    }
    return JSON.parse(jsonString,
        function (key, value) {
            if (Array.isArray(value) && value[0] === '!!') {
                value.shift();
                return applyRules(data, value)
            }
            return value
        })
}

function applyRules (data, config) {
    if (!Array.isArray(config)) {
        throw new Error("config must be an array");
    }
    return config.reduce(applyRule, data);
}

function applyRule (data, rule) {
    let m;
    let options = [];
    if (typeof rule === 'string') {
        if (rule.startsWith('$')) {
            // '$.foo' is a shorthand for ['select', '$.foo']
            m = 'select';
            options = [rule];
        } else {
            // rules with no params can be expresses as string, such as 'length' instead of ['length']
            m = rule;
        }
    } else if (Array.isArray(rule)) {
        m = rule.shift();
        options = rule;
    }
    const method = methods[m];
    if (!method) {
        throw new Error(`Rule type ${rule.type} not defined`);
    }
    const that = method.t === '$data' ? data : method.t;
    return method.m.call(that, data, ...options)
}

//all methods should accept 'data' as first parameter, and any number of following parameters from the rule
const methods = {
    join: {m: array.join, t:'$data'},
    length: {m: array.length, t:'$data'},
    min: {m: d3array.min, t: d3array},
    max: {m: d3array.max, t: d3array},
    extent: {m: d3array.extent, t: d3array},
    minIndex: {m: d3array.minIndex, t: d3array},
    maxIndex: {m: d3array.maxIndex, t: d3array},
    select: {m: select.select, t: null},
    selectAll: {m: select.selectAll, t: null},
    sum: {m: d3array.sum, t: d3array},
    mean: {m: d3array.mean, t: d3array},
    median: {m: d3array.median, t: d3array},
    cumsum: {m: array.cumsum, t: d3array},
    fcumsum: {m: array.fcumsum, t: d3array},
    quantile: {m: d3array.quantile, t: d3array},
    quantileSorted: {m: d3array.quantileSorted, t: d3array},
    variance: {m: d3array.variance, t: d3array},
    deviation: {m: d3array.deviation, t: d3array},
    round: {m: numeric.round, t: null},
    ceil: {m: numeric.ceil, t: null},
    floor: {m: numeric.floor, t: null},
    trunc: {m: numeric.trunc, t: null},
    toFixed: {m: numeric.toFixed, t: null},
    fsum: {m: d3array.fsum, t: d3array},
    // stopped at bisect https://github.com/d3/d3-array/blob/v3.0.2/README.md#bisectLeft
}

export const dmt = {
    applyRules,
    transform
}