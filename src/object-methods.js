
export function map (ctx, obj, template) {
    return ctx.transform(obj, JSON.stringify(template));
}