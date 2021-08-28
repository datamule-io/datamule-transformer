import * as d3timeFormat from "d3-time-format";

export function now () {
    return new Date();
}

export function timeFormat (ctx, data, formatString, locale) {
    //todo: dynamically import locale file from here, and use it: https://github.com/d3/d3-time-format/tree/main/locale
    const formatter = d3timeFormat.timeFormat(formatString);
    return formatter(data)
}