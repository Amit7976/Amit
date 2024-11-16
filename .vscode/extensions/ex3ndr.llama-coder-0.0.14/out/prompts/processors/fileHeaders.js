"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileHeaders = void 0;
const comment_1 = require("./comment");
function fileHeaders(content, uri, language) {
    let res = content;
    if (language) {
        // Add path marker
        let pathMarker = (0, comment_1.comment)('Path: ' + uri, language);
        if (pathMarker) {
            res = pathMarker + '\n' + res;
        }
        // Add language marker
        let typeMarker = (0, comment_1.comment)('Language: ' + language.name, language);
        if (typeMarker) {
            res = typeMarker + '\n' + res;
        }
    }
    return res;
}
exports.fileHeaders = fileHeaders;
//# sourceMappingURL=fileHeaders.js.map