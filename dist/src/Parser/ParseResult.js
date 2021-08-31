"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseResult = void 0;
class ParseResult {
    constructor() {
        this.error = null;
        this.node = null;
    }
    register(result) {
        if (result instanceof ParseResult) {
            if (result.error) {
                this.error = result.error;
            }
            return result.node;
        }
        return result;
    }
    success(node) {
        this.node = node;
        return this;
    }
    failure(error) {
        this.error;
        return this;
    }
}
exports.ParseResult = ParseResult;
//# sourceMappingURL=ParseResult.js.map