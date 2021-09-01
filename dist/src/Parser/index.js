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
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected '+', '-', '*', '/', '^', '==', '!=', '<', '>', <=', '>=', 'AND' or 'OR'"));
        }
        return result;
    }
    binaryOperation(leftFn, operations, rightFn) {
        let q = operations.map((item) => JSON.stringify(item));
        const s = (x) => {
            return x === 'FACTOR'
                ? this.factor()
                : x === 'ATOM'
                    ? this.atom()
                    : x === 'COMPARISON_EXPRESSION'
                        ? this.comparisonExpression()
                        : x === 'ARITHMETIC_EXPRESSION'
                            ? this.arithmeticExpression()
                            : this.term();
        };
        if (!rightFn) {
            rightFn = leftFn;
        }
        let result = new ParseResult_1.ParseResult();
        var left = result.register(s(leftFn));
        if (result.error)
            return result;
        while (q.includes(JSON.stringify({ type: this.currentToken.type })) ||
            q.includes(JSON.stringify({
                type: this.currentToken.type,
                value: this.currentToken.value,
            }))) {
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
        else if (token.matches('KEYWORD', 'IF')) {
            let ifExpression = result.register(this.ifExpression());
            if (result.error)
                return result;
            return result.success(ifExpression);
        }
        else if (token.matches('KEYWORD', 'FOR')) {
            let forExpression = result.register(this.forExpression());
            if (result.error)
                return result;
            return result.success(forExpression);
        }
        else if (token.matches('KEYWORD', 'WHILE')) {
            let whileExpression = result.register(this.whileExpression());
            if (result.error)
                return result;
            return result.success(whileExpression);
        }
        return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected int, float, identifier, '+', '-' or '('"));
    }
    power() {
        return this.binaryOperation('ATOM', [{ type: 'POW' }], 'FACTOR');
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
        return this.binaryOperation('FACTOR', [{ type: 'MUL' }, { type: 'DIV' }]);
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
        let node = result.register(this.binaryOperation('COMPARISON_EXPRESSION', [
            { type: 'KEYWORD', value: 'AND' },
            { type: 'KEYWORD', value: 'OR' },
        ]));
        if (result.error) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'VAR', int, float, identifier, '+', '-' or '('"));
        }
        return result.success(node);
    }
    comparisonExpression() {
        let result = new ParseResult_1.ParseResult();
        if (this.currentToken.matches('KEYWORD', 'NOT')) {
            let operationToken = this.currentToken;
            result.registerAdvancement();
            this.advance();
            let node = result.register(this.comparisonExpression());
            if (result.error)
                return result;
            return result.success(new nodes_1.UnaryOperationNode(operationToken, node));
        }
        let node = result.register(this.binaryOperation('ARITHMETIC_EXPRESSION', [
            { type: 'EE' },
            { type: 'NE' },
            { type: 'LT' },
            { type: 'GT' },
            { type: 'LTE' },
            { type: 'GTE' },
        ]));
        if (result.error) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected int, float, identifier, '+', '-' or '(', 'NOT'"));
        }
        return result.success(node);
    }
    arithmeticExpression() {
        return this.binaryOperation('TERM', [{ type: 'PLUS' }, { type: 'MINUS' }]);
    }
    ifExpression() {
        let result = new ParseResult_1.ParseResult();
        var cases = [];
        var elseCase;
        if (!this.currentToken.matches('KEYWORD', 'IF')) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'IF'"));
        }
        result.registerAdvancement();
        this.advance();
        let condition = result.register(this.expr()); // Taking the condition to be compared
        if (result.error)
            return result;
        if (!this.currentToken.matches('KEYWORD', 'THEN')) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'THEN'"));
        }
        result.registerAdvancement();
        this.advance();
        let expr = result.register(this.expr()); // Taking the expression to be executed if condition succeeds
        if (result.error)
            return result;
        cases.push({ condition, expr });
        while (this.currentToken.matches('KEYWORD', 'ELIF')) {
            result.registerAdvancement();
            this.advance();
            let condition = result.register(this.expr());
            if (result.error)
                return result;
            if (!this.currentToken.matches('KEYWORD', 'THEN')) {
                return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'THEN'"));
            }
            result.registerAdvancement();
            this.advance();
            let expr = result.register(this.expr());
            if (result.error)
                return result;
            cases.push({ condition, expr });
        }
        if (this.currentToken.matches('KEYWORD', 'ELSE')) {
            result.registerAdvancement();
            this.advance();
            elseCase = result.register(this.expr());
            if (result.error)
                return result;
        }
        return result.success(new nodes_1.IfNode(cases, elseCase));
    }
    forExpression() {
        let result = new ParseResult_1.ParseResult();
        if (!this.currentToken.matches('KEYWORD', 'FOR')) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'FOR'"));
        }
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
        let startValue = result.register(this.expr());
        if (result.error)
            return result;
        if (!this.currentToken.matches('KEYWORD', 'TO')) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'TO'"));
        }
        result.registerAdvancement();
        this.advance();
        let endValue = result.register(this.expr());
        if (result.error)
            return result;
        var stepValue = null;
        if (this.currentToken.matches('KEYWORD', 'STEP')) {
            result.registerAdvancement();
            this.advance();
            stepValue = result.register(this.expr());
            if (result.error)
                return result;
        }
        if (!this.currentToken.matches('KEYWORD', 'THEN')) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'THEN'"));
        }
        result.registerAdvancement();
        this.advance();
        let body = result.register(this.expr());
        if (result.error)
            return result;
        return result.success(new nodes_1.ForNode(varName, startValue, endValue, body, stepValue));
    }
    whileExpression() {
        let result = new ParseResult_1.ParseResult();
        if (!this.currentToken.matches('KEYWORD', 'WHILE')) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'WHILE'"));
        }
        result.registerAdvancement();
        this.advance();
        let condition = result.register(this.expr());
        if (result.error)
            return result;
        if (!this.currentToken.matches('KEYWORD', 'THEN')) {
            return result.failure(new errors_1.InvalidSyntaxError(this.currentToken.positionStart, this.currentToken.positionEnd, "Expected 'THEN'"));
        }
        result.registerAdvancement();
        this.advance();
        let body = result.register(this.expr());
        if (result.error)
            return result;
        return result.success(new nodes_1.WhileNode(condition, body));
    }
}
exports.Parser = Parser;
//# sourceMappingURL=index.js.map