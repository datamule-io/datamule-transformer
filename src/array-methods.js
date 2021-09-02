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

/**
 * sorts an array.
 * @param order {string} optional. 'asc' or 'desc'. Default is 'asc'.
 * @param byField {string} optional. If sorting objects, you can specify by which field in the object you'd like to sort
 */
export function sort (ctx, array, order, byField) {
    let sortFuntion = order === 'desc' ? d3array.descending : d3array.ascending;
    if (byField) {
      return d3array.sort(array, (a, b) => {
          return sortFuntion(a[byField], b[byField])
      })
    }
    return d3array.sort(array, sortFuntion);
}
/**
 * Concatinates multiple arrays or any other item into one array
 */
export function concat (ctx, items) {
    return [].concat(...items);
}

/**
 * @returns an array containing every value in arrays that is not in any of the others arrays.
 */
export function difference (ctx, arrays) {
    return Array.from(d3array.difference(...arrays));
}

/**
 * @returns an array containing every distinct value that appears in any of the given arrays. The order of values in the returned Array is based on their first occurrence in the given arrays.
 */
export function union (ctx, arrays) {
    return Array.from(d3array.union(...arrays));
}

/**
 * @returns an array containing every distinct value that appears in all of the given arrays. The order of values in the returned array is based on their first occurrence in the given arrays.
 */
export function intersection (ctx, arrays) {
    return Array.from(d3array.intersection(...arrays));
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
