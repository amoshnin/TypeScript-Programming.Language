"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    constructor(type, value, positionStart, positionEnd) {
        this.type = type;
        this.value = value;
        if (positionStart) {
            this.positionStart = positionStart.copy();
            this.positionEnd = positionStart.copy();
            this.positionEnd.advance();
        }
        if (positionEnd) {
            this.positionEnd = positionEnd;
        }
    }
    matches(type, value) {
        return this.type === type && this.value === value;
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