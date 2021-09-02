// import * as d3array from 'd3-array';
// import * as d3fetch from 'd3-fetch'
import * as array from './array-methods.js';
import * as numeric from './numeric-methods.js';
import * as select from './select-methods.js';
import * as fetchMethods from './fetchers.js';
import * as object from './object-methods.js';
import * as extensions from './extensions.js';
import * as datetime from './datetime-methods.js';

export async function fetch(type, url, options) {
    const fetcher = fetchers[type];
    if (!fetcher) {
        throw new Error("fetch type must be one of 'csv', 'dsv', 'tsv', 'json'");
    }
    if (!url) {
        throw new error("url must be provided");
    }
    return fetcher(url);
}

/**
 *
 * @param data - the data to transform
 * @param template - stringified JSON of the transformation template
 * @returns {any}
 */
export function transform(data, template, options) {
    if (!template) {
        throw new Error("jsonString config must be provided")
    }
    let innerRules = 0;
    return JSON.parse(template,
        function (key, value) {
            if (value === '!!') {
                innerRules++;
            } else if (Array.isArray(value) && value[0] === '!!') {
                if (innerRules > 1) {
                    innerRules --
                } else {
                    innerRules = 0;
                    value.shift();
                    return applyRules(data, value, options)
                }
            }
            return value
        })
}

export function applyRules (data, rules, options) {
    if (!Array.isArray(rules)) {
        throw new Error("config must be an array");
    }
    const ctx = {
        applyRules,
        transform,
        extensionsProvider: options && options.extensionsProvider ? options.extensionsProvider : () => undefined
    }
    const reducer = getApplyRuleFunction(ctx);
    return rules.reduce(reducer, data);
}

function getApplyRuleFunction (ctx) {
    return function applyRule (data, rule) {
        let m;
        let options = [];
        if (typeof rule === 'string') {
            if (rule.startsWith('$$.')) {
                m = 'extension';
                options = [rule.substr(3)]; // "$$.".length
            }
            else if (rule.startsWith('$')) {
                // '$.foo' is a shorthand for ['select', '$.foo']
                m = 'select';
                options = [rule];
            } else {
                // rules with no params can be expresses as string, such as 'length' instead of ['length']
                m = rule;
            }
        } else if (Array.isArray(rule)) {
            // m = rule.shift();
            m = rule[0];
            options = rule.slice(1)
            if (m.startsWith('$$.')) {
                options.unshift(m.substr(3));
                m = 'extension';
            }
        }
        const method = methods[m];
        if (typeof rule == 'string' && method.minParams) {
            throw new Error(`Rule '${rule}' must have params. Did you forget to enclose it with []?`);
        }
        if (!method) {
            throw new Error(`Rule type ${rule.type} not defined`);
        }
        // const that = method.t === '$data' ? data : method.t;
        return method.m.call(null, ctx, data, ...options)
    }
}


//all methods should accept 'data' as first parameter, and any number of following parameters from the rule
const methods = {
    "!!": {m:j => j, minParams: 0},
    join: {m:array.join, minParams: 0},
    length: {m:array.length, minParams: 0},
    min: {m:array.min, minParams: 0},
    max: {m:array.max, minParams: 0},
    extent: {m:array.extent, minParams: 0},
    minIndex: {m:array.minIndex, minParams: 0},
    maxIndex: {m:array.maxIndex, minParams: 0},
    select: {m:select.select, minParams: 0},
    selectAll: {m:select.selectAll, minParams: 1},
    sum: {m:array.sum, minParams: 0},
    mean: {m:array.mean, minParams: 0},
    median: {m:array.median, minParams: 0},
    cumsum: {m:array.cumsum, minParams: 0},
    fcumsum: {m:array.fcumsum, minParams: 0},
    quantile: {m:array.quantile, minParams: 1},
    quantileSorted: {m:array.quantileSorted, minParams: 1},
    variance: {m:array.variance, minParams: 0},
    deviation: {m:array.deviation, minParams: 0},
    round: {m:numeric.round, minParams: 0},
    ceil: {m:numeric.ceil, minParams: 0},
    floor: {m:numeric.floor, minParams: 0},
    trunc: {m:numeric.trunc, minParams: 0},
    toFixed: {m:numeric.toFixed, minParams: 0},
    fsum: {m:array.fsum, minParams: 0},
    // stopped at bisect https://github.com/d3/d3-array/blob/v3.0.2/README.md#bisectLeft
    jsonata: {m:select.jsonataEval, minParams: 0}, // todo: {m:remove this?
    each: {m:array.each, minParams: 1},
    map: {m:object.map, minParams: 1},
    extension: {m: extensions.extension, minParams:0},
    now: {m: datetime.now, minParams:0},
    timeFormat: {m: datetime.timeFormat, minParams:1},
    concat: {m:array.concat, minParams:0},
    sort: {m:array.sort, minParams:0},
    reverse: {m:array.reverse, minParams:0},
    // difference: {m:array.difference, minParams:0}, //removed because it's a difference of the first array from all the others. We need only methods that operate on all input arrays equally. 
    union: {m:array.union, minParams:0},
    intersection: {m:array.intersection, minParams:0}
}

const fetchers = {
    csv: fetchMethods.csv,
    dsv: fetchMethods.dsv,
    tsv: fetchMethods.tsv,
    json: fetchMethods.json
}