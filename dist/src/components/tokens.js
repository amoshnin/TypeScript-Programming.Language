"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    constructor(type, value = null) {
        this.type = type;
        this.value = value;
    }
    descr() {
        if (this.value) {
            return `${this.type}:${this.value}`;
        }
        else {
            return `${this.type}`;
        }
    }
}
exports.Token = Token;
//# sourceMappingURL=tokens.js.map