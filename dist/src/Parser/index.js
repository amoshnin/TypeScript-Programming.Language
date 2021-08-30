"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const tokens_1 = require("../base/tokens");
const nodes_1 = require("./nodes");
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.tokenIndex = 1;
        this.advance();
    }
    advance() {
        this.tokenIndex += 1;
        if (this.tokenIndex < this.tokens.length) {
            this.currentToken = this.tokens[this.tokenIndex];
        }
    }
    ////////////////////////////////////
    parse() {
        let result = this.expr();
        return result;
    }
    binaryOperation(typeFn, operations) {
        let token = this.currentToken;
        if (token) {
            var left = typeFn === 'FACTOR' ? this.factor() : this.term();
            while (operations.includes(token.type)) {
                let operation_token = token;
                this.advance();
                let right = typeFn === 'FACTOR' ? this.factor() : this.term();
                left = new nodes_1.BinaryOperationNode(left, operation_token, right);
            }
            return left;
        }
    }
    factor() {
        let token = this.currentToken;
        if (token) {
            if ([tokens_1.Tokens.INT, tokens_1.Tokens.FLOAT].includes(token.type)) {
                this.advance();
                return new nodes_1.NumberNode(token);
            }
        }
    }
    term() {
        return this.binaryOperation('FACTOR', [tokens_1.Tokens.MUL, tokens_1.Tokens.DIV]);
    }
    expr() {
        // @ts-ignore
        return this.binaryOperation('TERM', [tokens_1.Tokens.PLUS, tokens_1.Tokens.MINUS]);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=index.js.map