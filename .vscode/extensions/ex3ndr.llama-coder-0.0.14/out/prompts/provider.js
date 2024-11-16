"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptProvider = void 0;
const vscode_1 = __importDefault(require("vscode"));
const log_1 = require("../modules/log");
const autocomplete_1 = require("./autocomplete");
const preparePrompt_1 = require("./preparePrompt");
const lock_1 = require("../modules/lock");
const promptCache_1 = require("./promptCache");
const filter_1 = require("./filter");
const ollamaCheckModel_1 = require("../modules/ollamaCheckModel");
const ollamaDownloadModel_1 = require("../modules/ollamaDownloadModel");
const config_1 = require("../config");
class PromptProvider {
    lock = new lock_1.AsyncLock();
    statusbar;
    context;
    _paused = false;
    _status = { icon: "chip", text: "Llama Coder" };
    constructor(statusbar, context) {
        this.statusbar = statusbar;
        this.context = context;
    }
    set paused(value) {
        this._paused = value;
        this.update();
    }
    get paused() {
        return this._paused;
    }
    update(icon, text) {
        this._status.icon = icon ? icon : this._status.icon;
        this._status.text = text ? text : this._status.text;
        let statusText = '';
        let statusTooltip = '';
        if (this._paused) {
            statusText = `$(sync-ignored) ${this._status.text}`;
            statusTooltip = `${this._status.text} (Paused)`;
        }
        else {
            statusText = `$(${this._status.icon}) ${this._status.text}`;
            statusTooltip = `${this._status.text}`;
        }
        this.statusbar.text = statusText;
        this.statusbar.tooltip = statusTooltip;
    }
    async delayCompletion(delay, token) {
        if (config_1.config.inference.delay < 0) {
            return false;
        }
        await new Promise(p => setTimeout(p, delay));
        if (token.isCancellationRequested) {
            return false;
        }
        return true;
    }
    async provideInlineCompletionItems(document, position, context, token) {
        if (!await this.delayCompletion(config_1.config.inference.delay, token)) {
            return;
        }
        try {
            if (this.paused) {
                return;
            }
            // Ignore unsupported documents
            if (!(0, filter_1.isSupported)(document)) {
                (0, log_1.info)(`Unsupported document: ${document.uri.toString()} ignored.`);
                return;
            }
            // Ignore if not needed
            if ((0, filter_1.isNotNeeded)(document, position, context)) {
                (0, log_1.info)('No inline completion required');
                return;
            }
            // Ignore if already canceled
            if (token.isCancellationRequested) {
                (0, log_1.info)(`Canceled before AI completion.`);
                return;
            }
            // Execute in lock
            return await this.lock.inLock(async () => {
                // Prepare context
                let prepared = await (0, preparePrompt_1.preparePrompt)(document, position, context);
                if (token.isCancellationRequested) {
                    (0, log_1.info)(`Canceled before AI completion.`);
                    return;
                }
                // Result
                let res = null;
                // Check if in cache
                let cached = (0, promptCache_1.getFromPromptCache)({
                    prefix: prepared.prefix,
                    suffix: prepared.suffix
                });
                // If not cached
                if (cached === undefined) {
                    // Config
                    let inferenceConfig = config_1.config.inference;
                    // Update status
                    this.update('sync~spin', 'Llama Coder');
                    try {
                        // Check model exists
                        let modelExists = await (0, ollamaCheckModel_1.ollamaCheckModel)(inferenceConfig.endpoint, inferenceConfig.modelName, inferenceConfig.bearerToken);
                        if (token.isCancellationRequested) {
                            (0, log_1.info)(`Canceled after AI completion.`);
                            return;
                        }
                        // Download model if not exists
                        if (!modelExists) {
                            // Check if user asked to ignore download
                            if (this.context.globalState.get('llama-coder-download-ignored') === inferenceConfig.modelName) {
                                (0, log_1.info)(`Ingoring since user asked to ignore download.`);
                                return;
                            }
                            // Ask for download
                            let download = await vscode_1.default.window.showInformationMessage(`Model ${inferenceConfig.modelName} is not downloaded. Do you want to download it? Answering "No" would require you to manually download model.`, 'Yes', 'No');
                            if (download === 'No') {
                                (0, log_1.info)(`Ingoring since user asked to ignore download.`);
                                this.context.globalState.update('llama-coder-download-ignored', inferenceConfig.modelName);
                                return;
                            }
                            // Perform download
                            this.update('sync~spin', 'Downloading');
                            await (0, ollamaDownloadModel_1.ollamaDownloadModel)(inferenceConfig.endpoint, inferenceConfig.modelName, inferenceConfig.bearerToken);
                            this.update('sync~spin', 'Llama Coder');
                        }
                        if (token.isCancellationRequested) {
                            (0, log_1.info)(`Canceled after AI completion.`);
                            return;
                        }
                        // Run AI completion
                        (0, log_1.info)(`Running AI completion...`);
                        res = await (0, autocomplete_1.autocomplete)({
                            prefix: prepared.prefix,
                            suffix: prepared.suffix,
                            endpoint: inferenceConfig.endpoint,
                            bearerToken: inferenceConfig.bearerToken,
                            model: inferenceConfig.modelName,
                            format: inferenceConfig.modelFormat,
                            maxLines: inferenceConfig.maxLines,
                            maxTokens: inferenceConfig.maxTokens,
                            temperature: inferenceConfig.temperature,
                            canceled: () => token.isCancellationRequested,
                        });
                        (0, log_1.info)(`AI completion completed: ${res}`);
                        // Put to cache
                        (0, promptCache_1.setPromptToCache)({
                            prefix: prepared.prefix,
                            suffix: prepared.suffix,
                            value: res
                        });
                    }
                    finally {
                        this.update('chip', 'Llama Coder');
                    }
                }
                else {
                    if (cached !== null) {
                        res = cached;
                    }
                }
                if (token.isCancellationRequested) {
                    (0, log_1.info)(`Canceled after AI completion.`);
                    return;
                }
                // Return result
                if (res && res.trim() !== '') {
                    return [{
                            insertText: res,
                            range: new vscode_1.default.Range(position, position),
                        }];
                }
                // Nothing to complete
                return;
            });
        }
        catch (e) {
            (0, log_1.warn)('Error during inference:', e);
        }
    }
}
exports.PromptProvider = PromptProvider;
//# sourceMappingURL=provider.js.map