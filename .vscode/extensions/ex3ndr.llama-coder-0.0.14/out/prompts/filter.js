"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotNeeded = exports.isSupported = void 0;
function isSupported(doc) {
    return doc.uri.scheme === 'file' || doc.uri.scheme === 'vscode-notebook-cell' || doc.uri.scheme === 'vscode-remote';
}
exports.isSupported = isSupported;
function isNotNeeded(doc, position, context) {
    // Avoid autocomplete on empty lines
    // const line = doc.lineAt(position.line).text.trim();
    // if (line.trim() === '') {
    //     return true;
    // }
    // Avoid autocomplete when system menu is shown (ghost text is hidden anyway)
    // if (context.selectedCompletionInfo) {
    //     return true;
    // }
    return false;
}
exports.isNotNeeded = isNotNeeded;
//# sourceMappingURL=filter.js.map