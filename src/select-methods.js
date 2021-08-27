import jp from 'jsonpath';
import jsonata from 'jsonata';

export function jsonataEval (data, expr) {
    const expression = jsonata(expr);
    return expression.evaluate(data);
}

export function selectAll (data, expr, limit) {
    return jp.query(data, expr, limit)
}

export function select (data, expr) {
    return jp.value(data, expr);
}