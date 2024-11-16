"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPromptToCache = exports.getFromPromptCache = void 0;
// Remove all newlines, double spaces, etc
function normalizeText(src) {
    src = src.split('\n').join(' ');
    src = src.replace(/\s+/gm, ' ');
    return src;
}
function extractPromptCacheKey(args) {
    if (args.suffix) {
        return normalizeText(args.prefix + ' ##CURSOR## ' + args.suffix);
    }
    else {
        return normalizeText(args.prefix);
    }
}
// TODO: make it LRU
let cache = {};
function getFromPromptCache(args) {
    const key = extractPromptCacheKey(args);
    return cache[key];
}
exports.getFromPromptCache = getFromPromptCache;
function setPromptToCache(args) {
    const key = extractPromptCacheKey(args);
    cache[key] = args.value;
}
exports.setPromptToCache = setPromptToCache;
//# sourceMappingURL=promptCache.js.map