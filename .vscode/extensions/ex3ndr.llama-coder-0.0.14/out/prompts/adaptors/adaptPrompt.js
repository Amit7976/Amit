"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptPrompt = void 0;
function adaptPrompt(args) {
    // Common non FIM mode
    if (!args.suffix) {
        return {
            prompt: args.prefix,
            stop: [`<END>`]
        };
    }
    // Starcoder FIM
    if (args.model.startsWith('deepseek-coder')) {
        return {
            prompt: `<｜fim▁begin｜>${args.prefix}<｜fim▁hole｜>${args.suffix}<｜fim▁end｜>`,
            stop: [`<｜fim▁begin｜>`, `<｜fim▁hole｜>`, `<｜fim▁end｜>`, `<END>`]
        };
    }
    // Codellama FIM
    return {
        prompt: `<PRE> ${args.prefix} <SUF>${args.suffix} <MID>`,
        stop: [`<PRE>`, `<SUF>`, `<MID>`, `<END>`]
    };
}
exports.adaptPrompt = adaptPrompt;
//# sourceMappingURL=adaptPrompt.js.map