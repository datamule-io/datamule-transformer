import * as d3array from "d3-array";

export function join (array, separator) {
    return array.join(separator);
}

export function length (array) {
    return array.length;
}

export function cumsum (array) {
    return Array.from(d3array.cumsum(array));
}

export function fcumsum (array) {
    return Array.from(d3array.fcumsum(array));
}