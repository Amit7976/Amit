"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const provider_1 = require("./prompts/provider");
const log_1 = require("./modules/log");
function activate(context) {
    // Create logger
    (0, log_1.registerLogger)(vscode.window.createOutputChannel('Llama Coder', { log: true }));
    (0, log_1.info)('Llama Coder is activated.');
    // Create status bar
    context.subscriptions.push(vscode.commands.registerCommand('llama.openSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:ex3ndr.llama-coder');
    }));
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'llama.toggle';
    statusBarItem.text = `$(chip) Llama Coder`;
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    // Create provider
    const provider = new provider_1.PromptProvider(statusBarItem, context);
    let disposable = vscode.languages.registerInlineCompletionItemProvider({ pattern: '**', }, provider);
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('llama.pause', () => {
        provider.paused = true;
    }));
    context.subscriptions.push(vscode.commands.registerCommand('llama.resume', () => {
        provider.paused = false;
    }));
    context.subscriptions.push(vscode.commands.registerCommand('llama.toggle', () => {
        provider.paused = !provider.paused;
    }));
}
exports.activate = activate;
function deactivate() {
    // Nothing to do now
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map