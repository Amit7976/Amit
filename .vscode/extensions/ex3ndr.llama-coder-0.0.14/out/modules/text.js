"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countSymbol = exports.trimEndBlank = exports.trimIndent = exports.indentWidth = exports.isBlank = exports.countLines = void 0;
function countLines(src) {
    return countSymbol(src, '\n') + 1;
}
exports.countLines = countLines;
function isBlank(src) {
    return src.trim().length === 0;
}
exports.isBlank = isBlank;
function indentWidth(src) {
    for (let i = 0; i < src.length; i++) {
        if (!isBlank(src[i])) {
            return i;
        }
    }
    return src.length;
}
exports.indentWidth = indentWidth;
function trimIndent(src) {
    // Prase lines
    let lines = src.split('\n');
    if (lines.length === 0) {
        return '';
    }
    if (lines.length === 1) {
        return lines[0].trim();
    }
    // Remove first and last empty line
    if (isBlank(lines[0])) {
        lines = lines.slice(1);
    }
    if (isBlank(lines[lines.length - 1])) {
        lines = lines.slice(0, lines.length - 1);
    }
    if (lines.length === 0) {
        return '';
    }
    // Find minimal indent
    let indents = lines.filter((v) => !isBlank(v)).map((v) => indentWidth(v));
    let minimal = indents.length > 0 ? Math.min(...indents) : 0;
    // Trim indent
    return lines.map((v) => isBlank(v) ? '' : v.slice(minimal).trimEnd()).join('\n');
}
exports.trimIndent = trimIndent;
function trimEndBlank(src) {
    let lines = src.split('\n');
    for (let i = lines.length - 1; i++; i >= 0) {
        if (isBlank(lines[i])) {
            lines.splice(i);
        }
    }
    return lines.join('\n');
}
exports.trimEndBlank = trimEndBlank;
function countSymbol(src, char) {
    let res = 0;
    for (let i = 0; i < src.length; i++) {
        if (src[i] === char) {
            res++;
        }
    }
    return res;
}
exports.countSymbol = countSymbol;
//# sourceMappingURL=text.js.map