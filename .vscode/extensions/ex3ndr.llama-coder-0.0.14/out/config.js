"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const vscode_1 = __importDefault(require("vscode"));
class Config {
    // Inference
    get inference() {
        let config = this.#config;
        // Load endpoint
        let endpoint = config.get('endpoint').trim();
        if (endpoint.endsWith('/')) {
            endpoint = endpoint.slice(0, endpoint.length - 1).trim();
        }
        if (endpoint === '') {
            endpoint = 'http://127.0.0.1:11434';
        }
        let bearerToken = config.get('bearerToken');
        // Load general paremeters
        let maxLines = config.get('maxLines');
        let maxTokens = config.get('maxTokens');
        let temperature = config.get('temperature');
        // Load model
        let modelName = config.get('model');
        let modelFormat = 'codellama';
        if (modelName === 'custom') {
            modelName = config.get('custom.model');
            modelFormat = config.get('cutom.format');
        }
        else {
            if (modelName.startsWith('deepseek-coder')) {
                modelFormat = 'deepseek';
            }
            else if (modelName.startsWith('stable-code')) {
                modelFormat = 'stable-code';
            }
        }
        let delay = config.get('delay');
        return {
            endpoint,
            bearerToken,
            maxLines,
            maxTokens,
            temperature,
            modelName,
            modelFormat,
            delay
        };
    }
    // Notebook
    get notebook() {
        let config = vscode_1.default.workspace.getConfiguration('notebook');
        let includeMarkup = config.get('includeMarkup');
        let includeCellOutputs = config.get('includeCellOutputs');
        let cellOutputLimit = config.get('cellOutputLimit');
        return {
            includeMarkup,
            includeCellOutputs,
            cellOutputLimit,
        };
    }
    get #config() {
        return vscode_1.default.workspace.getConfiguration('inference');
    }
    ;
}
exports.config = new Config();
//# sourceMappingURL=config.js.map