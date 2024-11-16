"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparePrompt = void 0;
const vscode_1 = __importDefault(require("vscode"));
const detectLanguage_1 = require("./processors/detectLanguage");
const fileHeaders_1 = require("./processors/fileHeaders");
const languages_1 = require("./processors/languages");
const config_1 = require("../config");
var decoder = new TextDecoder("utf8");
function getNotebookDocument(document) {
    return vscode_1.default.workspace.notebookDocuments
        .find(x => x.uri.path === document.uri.path);
}
async function preparePrompt(document, position, context) {
    // Load document text
    let text = document.getText();
    let offset = document.offsetAt(position);
    let prefix = text.slice(0, offset);
    let suffix = text.slice(offset);
    let notebookConfig = config_1.config.notebook;
    // If this is a notebook, add the surrounding cells to the prefix and suffix
    let notebookDocument = getNotebookDocument(document);
    let language = (0, detectLanguage_1.detectLanguage)(document.uri.fsPath, document.languageId);
    let commentStart = undefined;
    if (language) {
        commentStart = languages_1.languages[language].comment?.start;
    }
    if (notebookDocument) {
        let beforeCurrentCell = true;
        let prefixCells = "";
        let suffixCells = "";
        notebookDocument.getCells().forEach((cell) => {
            let out = "";
            if (cell.document.uri.fragment === document.uri.fragment) {
                beforeCurrentCell = false; // switch to suffix mode
                return;
            }
            // add the markdown cell output to the prompt as a comment
            if (cell.kind === vscode_1.default.NotebookCellKind.Markup && commentStart) {
                if (notebookConfig.includeMarkup) {
                    for (const line of cell.document.getText().split('\n')) {
                        out += `\n${commentStart}${line}`;
                    }
                }
            }
            else {
                out += cell.document.getText();
            }
            // if there is any outputs add them to the prompt as a comment
            const addCellOutputs = notebookConfig.includeCellOutputs
                && beforeCurrentCell
                && cell.kind === vscode_1.default.NotebookCellKind.Code
                && commentStart;
            if (addCellOutputs) {
                let cellOutputs = cell.outputs
                    .map(x => x.items
                    .filter(x => x.mime === 'text/plain')
                    .map(x => decoder.decode(x.data))
                    .map(x => x.slice(0, notebookConfig.cellOutputLimit).split('\n')))
                    .flat(3);
                if (cellOutputs.length > 0) {
                    out += `\n${commentStart}Output:`;
                    for (const line of cellOutputs) {
                        out += `\n${commentStart}${line}`;
                    }
                }
            }
            // update the prefix/suffix
            if (beforeCurrentCell) {
                prefixCells += out;
            }
            else {
                suffixCells += out;
            }
        });
        prefix = prefixCells + prefix;
        suffix = suffix + suffixCells;
    }
    // Trim suffix
    // If suffix is too small it is safe to assume that it could be ignored which would allow us to use
    // more powerful completition instead of in middle one
    // if (suffix.length < 256) {
    //     suffix = null;
    // }
    // Add filename and language to prefix
    // NOTE: Most networks don't have a concept of filenames and expected language, but we expect that some files in training set has something in title that 
    //       would indicate filename and language
    // NOTE: If we can't detect language, we could ignore this since the number of languages that need detection is limited
    if (language) {
        prefix = (0, fileHeaders_1.fileHeaders)(prefix, document.uri.fsPath, languages_1.languages[language]);
    }
    return {
        prefix,
        suffix,
    };
}
exports.preparePrompt = preparePrompt;
//# sourceMappingURL=preparePrompt.js.map