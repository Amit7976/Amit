"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = exports.info = exports.registerLogger = void 0;
let logger = null;
function registerLogger(channel) {
    logger = channel;
}
exports.registerLogger = registerLogger;
function info(message, ...args) {
    if (logger) {
        logger.info(message, ...args);
    }
}
exports.info = info;
function warn(message, ...args) {
    if (logger) {
        logger.warn(message, ...args);
    }
}
exports.warn = warn;
//# sourceMappingURL=log.js.map