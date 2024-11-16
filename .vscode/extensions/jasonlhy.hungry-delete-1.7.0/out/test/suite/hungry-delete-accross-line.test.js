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
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode_1 = require("vscode");
const myExtension = require("../../src/extension");
const ConfigurationProvider_1 = require("../../src/ConfigurationProvider");
const testHelper_1 = require("../helper/testHelper");
suite("Hungry Delete across line", () => {
    // Inesrt the sample text for each text case
    // main with 12 leading spaces
    setup(() => {
        myExtension.setConfig(ConfigurationProvider_1.ConfigurationProvider.getDefaultConfiguration());
        let sampleText = "public\n"
            + "static\n"
            + "\n"
            + "void\n"
            + "\n"
            + "\n"
            + "            main";
        return (0, testHelper_1.insertSampleText)(sampleText);
    });
    // the test only works for using space for tabs
    // because getText() doesn't quite work for \t ...
    test("Assert Sample Text", () => __awaiter(void 0, void 0, void 0, function* () {
        let firstLine = (0, testHelper_1.getText)(0, 0, 0, 6);
        assert.equal(firstLine, "public");
        let secondLine = (0, testHelper_1.getText)(1, 0, 1, 6);
        assert.equal(secondLine, "static");
        let fourLine = (0, testHelper_1.getText)(3, 0, 3, 4);
        assert.equal(fourLine, "void");
        let sevenLine = (0, testHelper_1.getText)(6, 12, 6, 16);
        assert.equal(sevenLine, "main");
    }));
    // public
    // |static
    // =>
    // public|static
    test("No Skip line, No Leading Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(1, 0), new vscode_1.Position(1, 0));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("No Skip line, No Leading Space");
        let text = (0, testHelper_1.getText)(0, 0, 0, 12);
        assert.equal(text, "publicstatic");
    }));
    // public
    // static
    //
    // |void
    // =>
    // public
    // static|void
    test("Skip line, No Leading Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(3, 0), new vscode_1.Position(3, 0));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Skip line, No Leading Space");
        let text = (0, testHelper_1.getText)(1, 0, 1, 10);
        assert.equal(text, "staticvoid");
    }));
    // public
    // static
    //
    // void
    //
    //
    //          |main
    // =>
    // public
    // static
    //
    // void|main
    test("Skip line, With Leading Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(6, 12), new vscode_1.Position(6, 12));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Skip line, With Leading Space");
        let line = (0, testHelper_1.getText)(3, 0, 3, 8);
        assert.equal(line, "voidmain");
    }));
    // public
    // static
    //
    // void
    //
    // |
    //          main
    // =>
    // public
    // static
    //
    // void|
    //          main
    test("Empty Line", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection = new vscode_1.Selection(new vscode_1.Position(5, 0), new vscode_1.Position(5, 0));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Empty Line");
        let line = (0, testHelper_1.getText)(4, 12, 4, 16);
        assert.equal(line, "main");
    }));
    // public
    // |static
    //
    // |void
    //
    //
    //          |main
    // =>
    // publicstaticvoidmain
    test("Multiple Cursors", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let selection1 = new vscode_1.Selection(new vscode_1.Position(1, 0), new vscode_1.Position(1, 0));
        let selection2 = new vscode_1.Selection(new vscode_1.Position(3, 0), new vscode_1.Position(3, 0));
        let selection3 = new vscode_1.Selection(new vscode_1.Position(6, 12), new vscode_1.Position(6, 12));
        editor.selections = [selection1, selection2, selection3];
        yield (0, testHelper_1.executeHungryDelete)("Mutliple Cursors");
        let line = (0, testHelper_1.getText)(0, 0, 0, 20);
        assert.equal(line, "publicstaticvoidmain");
    }));
});
//# sourceMappingURL=hungry-delete-accross-line.test.js.map