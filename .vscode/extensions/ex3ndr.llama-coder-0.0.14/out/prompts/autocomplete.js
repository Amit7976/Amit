"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocomplete = void 0;
const ollamaTokenGenerator_1 = require("../modules/ollamaTokenGenerator");
const text_1 = require("../modules/text");
const log_1 = require("../modules/log");
const models_1 = require("./processors/models");
async function autocomplete(args) {
    let prompt = (0, models_1.adaptPrompt)({ prefix: args.prefix, suffix: args.suffix, format: args.format });
    // Calculate arguments
    let data = {
        model: args.model,
        prompt: prompt.prompt,
        raw: true,
        options: {
            stop: prompt.stop,
            num_predict: args.maxTokens,
            temperature: args.temperature
        }
    };
    // Receiving tokens
    let res = '';
    let totalLines = 1;
    let blockStack = [];
    outer: for await (let tokens of (0, ollamaTokenGenerator_1.ollamaTokenGenerator)(args.endpoint + '/api/generate', data, args.bearerToken)) {
        if (args.canceled && args.canceled()) {
            break;
        }
        // Block stack
        for (let c of tokens.response) {
            // Open block
            if (c === '[') {
                blockStack.push('[');
            }
            else if (c === '(') {
                blockStack.push('(');
            }
            if (c === '{') {
                blockStack.push('{');
            }
            // Close block
            if (c === ']') {
                if (blockStack.length > 0 && blockStack[blockStack.length - 1] === '[') {
                    blockStack.pop();
                }
                else {
                    (0, log_1.info)('Block stack error, breaking.');
                    break outer;
                }
            }
            if (c === ')') {
                if (blockStack.length > 0 && blockStack[blockStack.length - 1] === '(') {
                    blockStack.pop();
                }
                else {
                    (0, log_1.info)('Block stack error, breaking.');
                    break outer;
                }
            }
            if (c === '}') {
                if (blockStack.length > 0 && blockStack[blockStack.length - 1] === '{') {
                    blockStack.pop();
                }
                else {
                    (0, log_1.info)('Block stack error, breaking.');
                    break outer;
                }
            }
            // Append charater
            res += c;
        }
        // Update total lines
        totalLines += (0, text_1.countSymbol)(tokens.response, '\n');
        // Break if too many lines and on top level
        if (totalLines > args.maxLines && blockStack.length === 0) {
            (0, log_1.info)('Too many lines, breaking.');
            break;
        }
    }
    // Remove <EOT>
    if (res.endsWith('<EOT>')) {
        res = res.slice(0, res.length - 5);
    }
    // Trim ends of all lines since sometimes the AI completion will add extra spaces
    res = res.split('\n').map((v) => v.trimEnd()).join('\n');
    return res;
}
exports.autocomplete = autocomplete;
//# sourceMappingURL=autocomplete.js.map