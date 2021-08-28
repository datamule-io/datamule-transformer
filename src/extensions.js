

export function extension (ctx, data, ext, ...options) {
    return ctx.extensionsProvider(ctx, data, ext, options);
}