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
const myExtension = require("../../src/extension");
const ConfigurationProvider_1 = require("../../src/ConfigurationProvider");
const testHelper_1 = require("../helper/testHelper");
suite("Smart backspace above line", () => {
    // Inesrt the sample text for each text case
    // main with 12 leading spaces
    setup(() => {
        let sampleText = "a\n"
            + "b\n"
            + "     \n"
            + "c \n"
            + "d";
        return (0, testHelper_1.insertSampleText)(sampleText);
    });
    // a<EOL>
    // |b
    // => ab<EOL>
    test("No Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(1, 0), new vscode_1.Position(1, 0));
        editor.selection = selection;
        myExtension.setConfig({
            keepOneSpace: false,
            coupleCharacters: ConfigurationProvider_1.ConfigurationProvider.coupleCharacters
        });
        yield (0, testHelper_1.executeSmartBackspace)("No Space");
        let text = (0, testHelper_1.getText)(0, 0, 0, 3);
        assert.equal(text, "ab");
    }));
    // a<EOL>
    // |b
    // => a b<EOL>
    test("Keep One Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(1, 0), new vscode_1.Position(1, 0));
        editor.selection = selection;
        myExtension.setConfig({
            keepOneSpace: true,
            coupleCharacters: ConfigurationProvider_1.ConfigurationProvider.coupleCharacters
        });
        yield (0, testHelper_1.executeSmartBackspace)("Keep One Space");
        let text = (0, testHelper_1.getText)(0, 0, 0, 4);
        assert.equal(text, "a b");
    }));
    // b<EOL>
    // |
    // c <EOL>
    // =>
    // b<EOL>
    // c <EOL>
    test("Keep One Space But Empty Line", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(2, 0), new vscode_1.Position(2, 0));
        editor.selection = selection;
        myExtension.setConfig({
            keepOneSpace: true,
            coupleCharacters: ConfigurationProvider_1.ConfigurationProvider.coupleCharacters
        });
        yield (0, testHelper_1.executeSmartBackspace)("Keep One Space But Empty Line");
        assert.equal((0, testHelper_1.getText)(1, 0, 1, 1), "b");
        assert.equal((0, testHelper_1.getText)(2, 0, 2, 2), "c ");
    }));
    // c <EOL>
    // d<EOL>
    // =>
    // c d<EOL>
    test("Keep One Space But above line has space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(4, 0), new vscode_1.Position(4, 0));
        editor.selection = selection;
        myExtension.setConfig({
            keepOneSpace: true,
            coupleCharacters: ConfigurationProvider_1.ConfigurationProvider.coupleCharacters
        });
        yield (0, testHelper_1.executeSmartBackspace)("Keep One Space But above line has space");
        assert.equal((0, testHelper_1.getText)(3, 0, 3, 3), "c d");
    }));
});
//# sourceMappingURL=smart-backspace-above-line.test.js.map