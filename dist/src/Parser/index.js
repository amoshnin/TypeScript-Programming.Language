"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const nodes_1 = require("./nodes");
const errors_1 = require("../Shared/errors");
const ParseResult_1 = require("./ParseResult");
class Parser {
    constructor(tokens) {
        this.tokenIndex = -1;
        this.tokens = tokens;
        this.advance();
    }
    advance() {
        this.tokenIndex += 1;
        if (this.tokenIndex < this.tokens.length) {
            this.currentToken = this.tokens[this.tokenIndex];
        }
        return this.currentToken;
    }
    ////////////////////////////////////
    parse() {
        let result = this.expr();
        if (!result.error && this.currentToken.type !== 'EOF') {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected '+', '-', '*' or '/'"));
        }
        return result;
    }
    binaryOperation(leftFn, operations, rightFn) {
        const s = (x) => {
            return x === 'FACTOR'
                ? this.factor()
                : x === 'ATOM'
                    ? this.atom()
                    : this.term();
        };
        if (!rightFn) {
            rightFn = leftFn;
        }
        let result = new ParseResult_1.ParseResult();
        var left = result.register(s(leftFn));
        if (result.error)
            return result;
        while (operations.includes(this.currentToken.type)) {
            let operation_token = this.currentToken;
            result.registerAdvancement();
            this.advance();
            let right = result.register(s(rightFn));
            if (result.error)
                return result;
            left = new nodes_1.BinaryOperationNode(left, operation_token, right);
        }
        return result.success(left);
    }
    atom() {
        let result = new ParseResult_1.ParseResult();
        let token = this.currentToken;
        if (['INT', 'FLOAT'].includes(token.type)) {
            result.registerAdvancement();
            this.advance();
            return result.success(new nodes_1.NumberNode(token));
        }
        else if (token.type === 'IDENTIFIER') {
            result.registerAdvancement();
            this.advance();
            return result.success(new nodes_1.VarAccessNode(token));
        }
        else if (token.type === 'LPAREN') {
            result.registerAdvancement();
            this.advance();
            let expr = result.register(this.expr());
            if (result.error)
                return result;
            if (this.currentToken.type === 'RPAREN') {
                result.registerAdvancement();
                this.advance();
                return result.success(expr);
            }
            else {
                return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected ')'"));
            }
        }
        return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected int, float, identifier, '+', '-' or '('"));
    }
    power() {
        return this.binaryOperation('ATOM', ['POW'], 'FACTOR');
    }
    factor() {
        let result = new ParseResult_1.ParseResult();
        let token = this.currentToken;
        if (['PLUS', 'MINUS'].includes(token.type)) {
            result.registerAdvancement();
            this.advance();
            let factor = result.register(this.factor());
            if (result.error)
                return result;
            return result.success(new nodes_1.UnaryOperationNode(token, factor));
        }
        return this.power();
    }
    term() {
        return this.binaryOperation('FACTOR', ['MUL', 'DIV']);
    }
    expr() {
        let result = new ParseResult_1.ParseResult();
        if (this.currentToken.matches('KEYWORD', 'VAR')) {
            result.registerAdvancement();
            this.advance();
            if (this.currentToken.type !== 'IDENTIFIER') {
                return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, 'Expected identifier'));
            }
            let varName = this.currentToken;
            result.registerAdvancement();
            this.advance();
            //@ts-ignore
            if (this.currentToken.type !== 'EQ') {
                return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected '='"));
            }
            result.registerAdvancement();
            this.advance();
            let expr = result.register(this.expr());
            if (result.error)
                return result;
            return result.success(new nodes_1.VarAssignNode(varName, expr));
        }
        let node = result.register(this.binaryOperation('TERM', ['PLUS', 'MINUS']));
        if (result.error) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'VAR', int, float, identifier, '+', '-' or '('"));
        }
        return result.success(node);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=index.js.map