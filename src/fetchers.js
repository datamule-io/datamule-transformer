import * as d3fetch from 'd3-fetch'

export function csv (url, options) {
    return d3fetch.csv (url, options.init);
}

export function tsv (url, options) {
    return d3fetch.csv (url, options.init);
}

export function dsv (url, options) {
    const init = options.init || {};
    const row
}