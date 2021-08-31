"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseResult = void 0;
class ParseResult {
    constructor() {
        this.error = null;
        this.node = null;
        this.advanceCount = 0;
    }
    registerAdvancement() {
        this.advanceCount += 1;
    }
    register(result) {
        this.advanceCount += result.advanceCount;
        if (result.error) {
            this.error = result.error;
        }
        return result.node;
    }
    success(node) {
        this.node = node;
        return this;
    }
    failure(error) {
        if (!this.error || this.advanceCount === 0) {
            this.error = error;
        }
        return this;
    }
}
exports.ParseResult = ParseResult;
//# sourceMappingURL=ParseResult.js.map