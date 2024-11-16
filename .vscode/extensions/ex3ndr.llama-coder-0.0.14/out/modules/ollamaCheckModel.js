"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaCheckModel = void 0;
const log_1 = require("./log");
async function ollamaCheckModel(endpoint, model, bearerToken) {
    // Check if exists
    let res = await fetch(endpoint + '/api/tags', {
        headers: bearerToken ? {
            Authorization: `Bearer ${bearerToken}`,
        } : {},
    });
    if (!res.ok) {
        (0, log_1.info)(await res.text());
        (0, log_1.info)(endpoint + '/api/tags');
        throw Error('Network response was not ok.');
    }
    let body = await res.json();
    if (body.models.find((v) => v.name === model)) {
        return true;
    }
    else {
        return false;
    }
}
exports.ollamaCheckModel = ollamaCheckModel;
//# sourceMappingURL=ollamaCheckModel.js.map