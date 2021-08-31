"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = exports.Token = void 0;
const Tokens = {
    INT: 'INT',
    FLOAT: 'FLOAT',
    PLUS: 'PLUS',
    IDENTIFIER: 'IDENTIFIER',
    KEYWORD: 'KEYWORD',
    MINUS: 'MINUS',
    MUL: 'MUL',
    DIV: 'DIV',
    POW: 'POW',
    EQ: 'EQ',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    EOF: 'EOF',
};
exports.Tokens = Tokens;
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