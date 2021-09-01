import * as d3array from "d3-array";

export function join (ctx, array, separator) {
    return array.join(separator);
}

export function length (ctx, array) {
    return array.length;
}

export function reverse (ctx, array) {
    return d3array.reverse(array);
}

// todo: add ability to send selector parameter, if we're sorting objects
export function sort (ctx, array, order) {
    const sortFuntion = order === 'desc' ? d3array.descending : d3array.ascending;
    return d3array.sort(array, sortFuntion);
}
/**
 * Concatinates multiple arrays or any other item into one array
 */
export function concat (ctx, items) {
    return [].concat(...items);
}


export function cumsum (ctx, array) {
    return Array.from(d3array.cumsum(array));
}

export function fcumsum (ctx, array) {
    return Array.from(d3array.fcumsum(array));
}

export function min (ctx, array) {
    return d3array.min(array);
}
export function max (ctx, array) {
    return d3array.max(array);
}
export function extent (ctx, array) {
    return d3array.extent(array);
}
export function minIndex (ctx, array) {
    return d3array.minIndex(array);
}
export function maxIndex (ctx, array) {
    return d3array.maxIndex(array);
}
export function sum (ctx, array) {
    return d3array.sum(array);
}
export function mean (ctx, array) {
    return d3array.mean(array);
}
export function median (ctx, array) {
    return d3array.median(array);
}
export function quantile (ctx, array, p) {
    return d3array.quantile(array, p);
}
export function quantileSorted (ctx, array, p) {
    return d3array.quantileSorted(array, p);
}
export function variance (ctx, array) {
    return d3array.variance(array);
}
export function deviation (ctx, array) {
    return d3array.deviation(array);
}
export function fsum (ctx, array) {
    return d3array.fsum(array);
}

export function each (ctx, array, rules) {
    const reducer = (accumelator, currentItem) => {
        accumelator.push(ctx.applyRules(currentItem, rules));
        return accumelator;
    }
    return array.reduce(reducer, []);
}
