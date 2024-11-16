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
suite("Hungry Delete on line", () => {
    // Inesrt the sample text for each text case
    setup(() => {
        let sampleText = "public static void  main\n"
            + "public static void  main \n"
            + "public static void  main  \n"
            + "let a = b;\n"
            + "let a == b;\n"
            + "!!??abc\n"
            + "\"abc\"\n"
            + "<abc>\n"
            + "'abc'''''\n"
            + "'abc''''\n"
            + "a\"\"b\n";
        return (0, testHelper_1.insertSampleText)(sampleText);
    });
    //    public static void  main|
    // => public static void  |
    test("Delete World Left, End of Line, No Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let line = editor.document.lineAt(0);
        let eol = line.range.end;
        editor.selection = new vscode_1.Selection(eol, eol);
        yield (0, testHelper_1.executeHungryDelete)("Delete World Left, End of Line, No Space");
        let text = (0, testHelper_1.getText)(0, 0, 0, 20);
        assert.equal(text, "public static void  ");
    }));
    //    public static void  main |
    // => public static void  |
    test("Delete World Left, End of Line, One Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let line = editor.document.lineAt(0);
        let eol = line.range.end;
        editor.selection = new vscode_1.Selection(eol, eol);
        yield (0, testHelper_1.executeHungryDelete)("Delete World Left, End of Line, One Space");
        let text = (0, testHelper_1.getText)(1, 0, 1, 20);
        assert.equal(text, "public static void  ");
    }));
    //    public static void  main  |
    // => public static void  main|
    test("Delete World Left, End of Line, Two or More Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let line = editor.document.lineAt(0);
        let eol = line.range.end;
        editor.selection = new vscode_1.Selection(eol, eol);
        yield (0, testHelper_1.executeHungryDelete)("Delete World Left, End of Line, Two or More Space");
        let text = (0, testHelper_1.getText)(2, 0, 2, 24);
        assert.equal(text, "public static void  main");
    }));
    //    public static |void main
    // => public |void main
    test("Delete World Left, Head of right word, One Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let position = new vscode_1.Position(0, 14);
        editor.selection = new vscode_1.Selection(position, position);
        yield (0, testHelper_1.executeHungryDelete)("Delete World Left, Head of right word, One Space");
        let text = (0, testHelper_1.getText)(0, 0, 0, 17);
        assert.equal(text, "public void  main");
    }));
    //    public static void  |main
    // => public static void|main
    test("Delete World Left, Head of right word, Two or more Space", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let position = new vscode_1.Position(0, 20);
        editor.selection = new vscode_1.Selection(position, position);
        yield (0, testHelper_1.executeHungryDelete)("Delete World Left, Head of right word, Two or more Space");
        let text = (0, testHelper_1.getText)(0, 0, 0, 22);
        assert.equal(text, "public static voidmain");
    }));
    // let a = |b;
    // => let a |b;
    test("Delete Single Operator", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 3;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 8), new vscode_1.Position(lineIdx, 8));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Single Operator");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 8);
        assert.equal(text, "let a b;");
    }));
    // let a == |b;
    // => let a |b;
    test("Delete Two Continuous Operator", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 4;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 9), new vscode_1.Position(lineIdx, 9));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Two Continuous Operator");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 8);
        assert.equal(text, "let a b;");
    }));
    // !!??|abc
    // =>
    // !!|abc
    test("Delete Different Operator", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 5;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 4), new vscode_1.Position(lineIdx, 4));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Different Operator");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 5);
        assert.equal(text, "!!abc");
    }));
    // "abc"|
    // =>
    // "abc
    test("Delete Couple Character 1", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 6;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 5), new vscode_1.Position(lineIdx, 5));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Couple Character 1");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 4);
        assert.equal(text, "\"abc");
    }));
    // <abc>|
    // =>
    // <abc
    test("Delete Couple Character 2", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 7;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 5), new vscode_1.Position(lineIdx, 5));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Couple Character 2");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 5);
        assert.equal(text, "<abc");
    }));
    // 'abc'''''|
    // =>
    // 'abc
    test("Delete Couple Character 3", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 8;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 9), new vscode_1.Position(lineIdx, 9));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Couple Character 3");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 4);
        assert.equal(text, "'abc");
    }));
    // 'abc''|''
    // =>
    // 'abc''
    test("Delete Couple Character 4", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 9;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 6), new vscode_1.Position(lineIdx, 6));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Couple Character 4");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 6);
        assert.equal(text, "'abc''");
    }));
    // a"|"b
    // =>
    // ab
    test("Delete Couple Character fallback Smart Backspace", () => __awaiter(void 0, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        const lineIdx = 10;
        let selection = new vscode_1.Selection(new vscode_1.Position(lineIdx, 2), new vscode_1.Position(lineIdx, 2));
        editor.selection = selection;
        yield (0, testHelper_1.executeHungryDelete)("Delete Couple Character fallback Smart Backspace");
        let text = (0, testHelper_1.getText)(lineIdx, 0, lineIdx, 2);
        assert.equal(text, "ab");
    }));
});
//# sourceMappingURL=hungry-delete-on-line.test.js.map