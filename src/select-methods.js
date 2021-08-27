import jp from 'jsonpath';
import jsonata from 'jsonata';

export function jsonataEval (ctx, data, expr) {
    const expression = jsonata(expr);
    return expression.evaluate(data);
}

export function selectAll (ctx, data, expr, limit) {
    return jp.query(data, expr, limit)
}

export function select (ctx, data, expr) {
    return jp.value(data, expr);
}