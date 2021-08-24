import jp from 'jsonpath';

export function selectAll (data, expr, limit) {
    return jp.query(data, expr, limit)
}

export function select (data, expr) {
    return jp.value(data, expr);
}