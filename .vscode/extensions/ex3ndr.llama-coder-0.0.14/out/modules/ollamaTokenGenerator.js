"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaTokenGenerator = void 0;
const lineGenerator_1 = require("./lineGenerator");
const log_1 = require("./log");
async function* ollamaTokenGenerator(url, data, bearerToken) {
    for await (let line of (0, lineGenerator_1.lineGenerator)(url, data, bearerToken)) {
        (0, log_1.info)('Receive line: ' + line);
        let parsed;
        try {
            parsed = JSON.parse(line);
        }
        catch (e) {
            console.warn('Receive wrong line: ' + line);
            continue;
        }
        yield parsed;
    }
}
exports.ollamaTokenGenerator = ollamaTokenGenerator;
//# sourceMappingURL=ollamaTokenGenerator.js.map