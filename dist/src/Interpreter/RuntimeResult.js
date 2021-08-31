"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeResult = void 0;
class RuntimeResult {
    constructor() {
        this.value = undefined;
        this.error = undefined;
    }
    register(result) {
        if (result.error) {
            this.error = result.error;
        }
        return result.value;
    }
    success(value) {
        this.value = value;
        return this;
    }
    failure(error) {
        this.error = error;
        return this;
    }
}
exports.RuntimeResult = RuntimeResult;
//# sourceMappingURL=RuntimeResult.js.map