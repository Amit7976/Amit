"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment = void 0;
function comment(text, language) {
    if (language.comment) {
        if (language.comment.end) {
            return `${language.comment.start} ${text} ${language.comment.end}`;
        }
        else {
            return `${language.comment.start} ${text}`;
        }
    }
    return null;
}
exports.comment = comment;
//# sourceMappingURL=comment.js.map