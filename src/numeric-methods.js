
if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
}

if (Math.trunc === undefined) {
    Math.trunc = function(v) {
        return v < 0 ? Math.ceil(v) : Math.floor(v);
    };
}

function isRound (num, decimalPlaces) {
    //return decimalPlaces >= 0 &&
    //    +num.toFixed(decimalPlaces) === num;
    let p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p === num;
}

function decimalAdjust (type, num, decimalPlaces) {
    if (isRound(num, decimalPlaces || 0))
        return num;
    let p = Math.pow(10, decimalPlaces || 0);
    let n = (num * p) * (1 + Number.EPSILON);
    return Math[type](n) / p;
}

// Decimal round (half away from zero)
export function round (num, decimalPlaces) {
    return decimalAdjust('round', num, decimalPlaces);
}

// Decimal ceil
export function ceil (num, decimalPlaces) {
    return decimalAdjust('ceil', num, decimalPlaces);
}

// Decimal floor
export function floor (num, decimalPlaces) {
    return decimalAdjust('floor', num, decimalPlaces);
}

// Decimal trunc
export function trunc (num, decimalPlaces) {
    return decimalAdjust('trunc', num, decimalPlaces);
}

// Format using fixed-point notation
export function toFixed (num, decimalPlaces) {
    return decimalAdjust('round', num, decimalPlaces).toFixed(decimalPlaces);
}
