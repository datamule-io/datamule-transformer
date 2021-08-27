import * as d3fetch from 'd3-fetch'

export function csv (ctx, url, options) {
    return d3fetch.csv (url, options.init);
}

export function tsv (ctx, url, options) {
    return d3fetch.csv (url, options.init);
}

export function dsv (ctx, url, options) {
    const init = options.init || {};
    // const row
}