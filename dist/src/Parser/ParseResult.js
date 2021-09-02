"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseResult = void 0;
class ParseResult {
    constructor() {
        this.error = null;
        this.node = null;
        this.lastRegisteredAdvanceCount = 0;
        this.advanceCount = 0;
        this.toReverseCount = 0;
    }
    registerAdvancement() {
        this.lastRegisteredAdvanceCount = 1;
        this.advanceCount += 1;
    }
    register(result) {
        this.lastRegisteredAdvanceCount = result.advanceCount;
        this.advanceCount += result.advanceCount;
        if (result.error)
            this.error = result.error;
        return result.node;
    }
    try_register(result) {
        if (result.error) {
            this.toReverseCount = result.advanceCount;
            return null;
        }
        return this.register(result);
    }
    success(node) {
        this.node = node;
        return this;
    }
    failure(error) {
        if (!this.error || this.lastRegisteredAdvanceCount === 0) {
            this.error = error;
        }
        return this;
    }
}
exports.ParseResult = ParseResult;
//# sourceMappingURL=ParseResult.js.map