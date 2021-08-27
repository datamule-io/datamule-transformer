// import * as d3array from 'd3-array';
// import * as d3fetch from 'd3-fetch'
import * as array from './array-methods.js';
import * as numeric from './numeric-methods.js';
import * as select from './select-methods.js';
import * as fetchMethods from './fetchers.js';
import * as object from './object-methods.js';

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
export function transform(data, template) {
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
                    return applyRules(data, value)
                }
            }
            return value
        })
}

export function applyRules (data, rules) {
    if (!Array.isArray(rules)) {
        throw new Error("config must be an array");
    }
    const ctx = {
        applyRules,
        transform
    }
    const reducer = getApplyRuleFunction(ctx);
    return rules.reduce(reducer, data);
}

function getApplyRuleFunction (ctx) {
    return function applyRule (data, rule) {
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
            // m = rule.shift();
            m = rule[0];
            options = rule.slice(1)
            // options = rule;
        }
        const method = methods[m];
        if (!method) {
            throw new Error(`Rule type ${rule.type} not defined`);
        }
        // const that = method.t === '$data' ? data : method.t;
        return method.call(null, ctx, data, ...options)
    }
}


//all methods should accept 'data' as first parameter, and any number of following parameters from the rule
const methods = {
    "!!": j => j,
    join: array.join,
    length: array.length,
    min: array.min,
    max: array.max,
    extent: array.extent,
    minIndex: array.minIndex,
    maxIndex: array.maxIndex,
    select: select.select,
    selectAll: select.selectAll,
    sum: array.sum,
    mean: array.mean,
    median: array.median,
    cumsum: array.cumsum,
    fcumsum: array.fcumsum,
    quantile: array.quantile,
    quantileSorted: array.quantileSorted,
    variance: array.variance,
    deviation: array.deviation,
    round: numeric.round,
    ceil: numeric.ceil,
    floor: numeric.floor,
    trunc: numeric.trunc,
    toFixed: numeric.toFixed,
    fsum: array.fsum,
    // stopped at bisect https://github.com/d3/d3-array/blob/v3.0.2/README.md#bisectLeft
    jsonata: select.jsonataEval, // todo: remove this?
    each: array.each,
    map: object.map
}

const fetchers = {
    csv: fetchMethods.csv,
    dsv: fetchMethods.dsv,
    tsv: fetchMethods.tsv,
    json: fetchMethods.json
}