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
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    EOF: 'EOF',
};
exports.Tokens = Tokens;
class Token {
    constructor(type, value = undefined, position_start = undefined, position_end = undefined) {
        this.type = type;
        this.value = value;
        if (position_start) {
            this.position_start = position_start.copy();
            this.position_end = position_start.copy();
            this.position_end.advance();
        }
        if (position_end) {
            this.position_end = position_end;
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