'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vscode = require('vscode');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var vscode__namespace = /*#__PURE__*/_interopNamespace(vscode);

const Selection = vscode__namespace.Selection;
const Position = vscode__namespace.Position;
const linebreaks = ['', '\n', '\r\n'];
let usedDeprecatedMessage = false;
function activate() {
    vscode__namespace.commands.registerCommand('l13Duplicate.after', () => {
        deprecated();
        duplicate(false);
    });
    vscode__namespace.commands.registerCommand('l13Duplicate.before', () => {
        deprecated();
        duplicate(true);
    });
    vscode__namespace.commands.registerCommand('l13Duplicate.action.duplicate.after', () => duplicate(false));
    vscode__namespace.commands.registerCommand('l13Duplicate.action.duplicate.before', () => duplicate(true));
}
function deactivate() {
}
function duplicate(moveSelection) {
    const activeTextEditor = vscode__namespace.window.activeTextEditor;
    if (!activeTextEditor)
        return;
    const document = activeTextEditor.document;
    activeTextEditor.edit((textEdit) => {
        const selections = sortSelections(document, activeTextEditor.selections);
        const eol = linebreaks[document.eol];
        selections.forEach((selection) => {
            if (selection.isEmpty) {
                const line = selection.start.line;
                const position = new Position(line + (moveSelection ? 0 : 1), 0);
                let text = document.lineAt(line).text;
                text = !moveSelection && line + 1 === document.lineCount ? eol + text : text + eol;
                textEdit.insert(position, text);
            }
            else {
                const text = document.getText(selection);
                textEdit.insert(selection.start, text);
            }
            return selection;
        });
    }).then(() => {
        if (moveSelection)
            return;
        const selections = sortSelections(document, activeTextEditor.selections);
        activeTextEditor.selections = selections.map((selection) => {
            if (selection.isEmpty) {
                const line = selection.start.line;
                if (line + 1 !== document.lineCount)
                    return selection;
                const position = new Position(line - 1, selection.start.character);
                return new Selection(position, position);
            }
            const text = document.getText(selection);
            const startOffset = document.offsetAt(selection.start) - text.length;
            return new Selection(document.positionAt(startOffset), selection.start);
        });
    });
}
function sortSelections(document, selections) {
    return selections.sort((selectionA, selectionB) => {
        const offsetA = document.offsetAt(selectionA.start);
        const offsetB = document.offsetAt(selectionB.start);
        return -(offsetA < offsetB) || +(offsetA > offsetB) || 0;
    });
}
function deprecated() {
    if (!usedDeprecatedMessage) {
        const text = 'The commands "l13Duplicate.after" and "l13Duplicate.before" are depricated. Please use "l13Duplicate.action.duplicate.after" and "l13Duplicate.action.duplicate.before" for your custom keyboard shortcuts.';
        vscode__namespace.window.showWarningMessage(text);
        usedDeprecatedMessage = true;
    }
}

exports.activate = activate;
exports.deactivate = deactivate;
