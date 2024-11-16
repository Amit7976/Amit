"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaDownloadModel = void 0;
const lineGenerator_1 = require("./lineGenerator");
const log_1 = require("./log");
async function ollamaDownloadModel(endpoint, model, bearerToken) {
    (0, log_1.info)('Downloading model from ollama: ' + model);
    for await (let line of (0, lineGenerator_1.lineGenerator)(endpoint + '/api/pull', { name: model }, bearerToken)) {
        (0, log_1.info)('[DOWNLOAD] ' + line);
    }
}
exports.ollamaDownloadModel = ollamaDownloadModel;
//# sourceMappingURL=ollamaDownloadModel.js.map