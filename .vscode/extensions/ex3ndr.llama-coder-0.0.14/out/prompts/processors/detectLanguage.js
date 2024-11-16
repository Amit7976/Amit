"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLanguage = void 0;
const path_1 = __importDefault(require("path"));
const languages_1 = require("./languages");
let aliases = {
    'typescriptreact': 'typescript',
    'javascriptreact': 'javascript',
    'jsx': 'javascript'
};
function detectLanguage(uri, languageId) {
    // Resolve aliases
    if (!!languageId && aliases[languageId]) {
        return aliases[languageId];
    }
    // Resolve using language id
    if (!!languageId && !!languages_1.languages[languageId]) {
        return languageId;
    }
    // Resolve using filename and extension
    let basename = path_1.default.basename(uri);
    let extname = path_1.default.extname(basename).toLowerCase();
    // Check extensions
    for (let lang in languages_1.languages) {
        let k = languages_1.languages[lang];
        for (let ex of k.extensions) {
            if (extname === ex) {
                return lang;
            }
        }
    }
    // Return result
    return null;
}
exports.detectLanguage = detectLanguage;
//# sourceMappingURL=detectLanguage.js.map