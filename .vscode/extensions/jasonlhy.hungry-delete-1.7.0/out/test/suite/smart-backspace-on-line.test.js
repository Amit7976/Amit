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
// The module 'assert' provides assertion methods from node
const assert = require("assert");
const vscode_1 = require("vscode");
const testHelper_1 = require("../helper/testHelper");
suite("Smart backspace on line", () => {
    // Inesrt the sample text for each text case
    // main with 12 leading spaces
    setup(() => {
        let sampleText = "abcd\n"
            + "a bcd\n"
            + "if () {\n"
            + "if (a) {\n";
        return (0, testHelper_1.insertSampleText)(sampleText);
    });
    // a|bcd
    // => bcd
    test("Delete Single Letter", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(0, 1), new vscode_1.Position(0, 1));
        editor.selection = selection;
        yield (0, testHelper_1.executeSmartBackspace)("Delete Single Letter");
        let text = (0, testHelper_1.getText)(0, 0, 0, 3);
        assert.equal(text, "bcd");
    }));
    // a |bcd
    // => abcd
    test("Delete Single Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(1, 2), new vscode_1.Position(1, 2));
        editor.selection = selection;
        yield (0, testHelper_1.executeSmartBackspace)("Delete Single Space");
        let text = (0, testHelper_1.getText)(1, 0, 1, 4);
        assert.equal(text, "abcd");
    }));
    // if (|) {
    // => if | {
    test("Delete One Pair", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 2;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 4), new vscode_1.Position(lineIdx, 4));
        editor.selection = selection;
        yield (0, testHelper_1.executeSmartBackspace)("Delete One Pair");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 5);
        assert.equal(text, "if  {");
    }));
    // if (|a) {
    // => if |a) {
    test("Not Delete One Pair if not empty", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 3;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 4), new vscode_1.Position(lineIdx, 4));
        editor.selection = selection;
        yield (0, testHelper_1.executeSmartBackspace)("Not Delete One Pair if not empty");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 7);
        assert.equal(text, "if a) {");
    }));
});
//# sourceMappingURL=smart-backspace-on-line.test.js.map