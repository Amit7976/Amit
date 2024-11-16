"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncLock = void 0;
class AsyncLock {
    permits = 1;
    promiseResolverQueue = [];
    async inLock(func) {
        try {
            await this.lock();
            return await func();
        }
        finally {
            this.unlock();
        }
    }
    async lock() {
        if (this.permits > 0) {
            this.permits = this.permits - 1;
            return;
        }
        await new Promise(resolve => this.promiseResolverQueue.push(resolve));
    }
    unlock() {
        this.permits += 1;
        if (this.permits > 1 && this.promiseResolverQueue.length > 0) {
            throw new Error('this.permits should never be > 0 when there is someone waiting.');
        }
        else if (this.permits === 1 && this.promiseResolverQueue.length > 0) {
            // If there is someone else waiting, immediately consume the permit that was released
            // at the beginning of this function and let the waiting function resume.
            this.permits -= 1;
            const nextResolver = this.promiseResolverQueue.shift();
            // Resolve on the next tick
            if (nextResolver) {
                setTimeout(() => {
                    nextResolver(true);
                }, 0);
            }
        }
    }
}
exports.AsyncLock = AsyncLock;
//# sourceMappingURL=lock.js.map