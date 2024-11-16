"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugContent = exports.executeSmartBackspace = exports.executeHungryDelete = exports.getText = exports.getTextByRange = exports.insertSampleText = void 0;
// The module 'assert' provides assertion methods from node
const assert = require("assert");
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode_1 = require("vscode");
const myExtension = require("../../src/extension");
/**
 * Insert sample text for testing
 */
function insertSampleText(sampleText) {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let result = yield editor.edit(editorBuilder => {
            let position = new vscode_1.Position(0, 0);
            editorBuilder.insert(position, sampleText);
        });
        assert.ok(result);
    });
}
exports.insertSampleText = insertSampleText;
function getTextByRange(range) {
    var document = vscode_1.window.activeTextEditor.document;
    if (document.validateRange(range)) {
        return document.getText(range);
    }
}
exports.getTextByRange = getTextByRange;
// this method have different name exists because no method overloading
// this exclude the character at ecol
function getText(sline, scol, eline, ecol) {
    let start = new vscode_1.Position(sline, scol);
    let end = new vscode_1.Position(eline, ecol);
    return getTextByRange(new vscode_1.Range(start, end));
}
exports.getText = getText;
function executeHungryDelete(title) {
    return __awaiter(this, void 0, void 0, function* () {
        let r = yield myExtension.hungryDelete();
        if (!r && title) {
            console.log("execute command failed for: " + title);
        }
    });
}
exports.executeHungryDelete = executeHungryDelete;
function executeSmartBackspace(title) {
    return __awaiter(this, void 0, void 0, function* () {
        let r = yield myExtension.smartBackspace();
        if (!r && title) {
            console.log("execute command failed for: " + title);
        }
    });
}
exports.executeSmartBackspace = executeSmartBackspace;
// this is used to debug the content in the async test method
// because run vscode debugg not work
function debugContent() {
    console.log('1 line: ' + vscode_1.window.activeTextEditor.document.lineAt(0).text);
    console.log('2 line: ' + vscode_1.window.activeTextEditor.document.lineAt(1).text);
    console.log('3 line: ' + vscode_1.window.activeTextEditor.document.lineAt(2).text);
    console.log('4 line: ' + vscode_1.window.activeTextEditor.document.lineAt(3).text);
}
exports.debugContent = debugContent;
//# sourceMappingURL=testHelper.js.map