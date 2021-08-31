"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = exports.Token = void 0;
const Tokens = {
    INT: 'INT',
    FLOAT: 'FLOAT',
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    MUL: 'MUL',
    DIV: 'DIV',
    POW: 'POW',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    EOF: 'EOF',
};
exports.Tokens = Tokens;
class Token {
    constructor(type, value = undefined, positionStart = undefined, positionEnd = undefined) {
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