"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const position_1 = require("./position");
const tokens_1 = require("./tokens");
const constants_1 = require("../shared/constants");
const errors_1 = require("../shared/errors");
class Lexer {
    constructor(fileName, text) {
        this.currentChar = null;
        this.fileName = fileName;
        this.text = text;
        this.position = new position_1.Position(-1, 0, -1, fileName, text);
        this.advance();
    }
    advance() {
        this.position.advance(this.currentChar);
        if (this.position.index < this.text.length) {
            this.currentChar = this.text[this.position.index];
        }
        else {
            this.currentChar = null;
        }
    }
    makeTokens() {
        var tokens = [];
        while (this.currentChar !== null) {
            if (' \t'.includes(this.currentChar)) {
                this.advance();
            }
            else if (constants_1.DIGITS.includes(this.currentChar)) {
                tokens.push(this.makeNumber());
            }
            else if (constants_1.LETTERS.includes(this.currentChar)) {
                tokens.push(this.makeIdentifier());
            }
            else if (this.currentChar === '+') {
                tokens.push(new tokens_1.Token('PLUS', undefined, this.position));
                this.advance();
            }
            else if (this.currentChar === '-') {
                tokens.push(new tokens_1.Token('MINUS', undefined, this.position));
                this.advance();
            }
            else if (this.currentChar === '*') {
                tokens.push(new tokens_1.Token('MUL', undefined, this.position));
                this.advance();
            }
            else if (this.currentChar === '/') {
                tokens.push(new tokens_1.Token('DIV', undefined, this.position));
                this.advance();
            }
            else if (this.currentChar === '^') {
                tokens.push(new tokens_1.Token('POW', undefined, this.position));
                this.advance();
            }
            else if (this.currentChar === '(') {
                tokens.push(new tokens_1.Token('LPAREN', undefined, this.position));
                this.advance();
            }
            else if (this.currentChar === ')') {
                tokens.push(new tokens_1.Token('RPAREN', undefined, this.position));
                this.advance();
            }
            else if (this.currentChar === '!') {
                const { token, error } = this.makeNotEquals();
                if (error)
                    return { tokens: [], error };
                tokens.push(token);
            }
            else if (this.currentChar === '=') {
                tokens.push(this.makeEquals());
            }
            else if (this.currentChar === '<') {
                tokens.push(this.makeLessThan());
            }
            else if (this.currentChar === '>') {
                tokens.push(this.makeGreaterThan());
            }
            else {
                let positionStart = this.position.copy();
                let char = this.currentChar;
                this.advance();
                return {
                    tokens: [],
                    error: new errors_1.IllegalCharError(positionStart, this.position, `'${char}'`),
                };
            }
        }
        tokens.push(new tokens_1.Token('EOF', undefined, this.position));
        return { tokens, error: null };
    }
    makeNotEquals() {
        let positionStart = this.position.copy();
        this.advance();
        if (this.currentChar === '=') {
            this.advance();
            return { token: new tokens_1.Token('NE', undefined, positionStart, this.position) };
        }
        this.advance();
        return {
            error: new errors_1.ExpectedCharError(positionStart, this.position, "'=' (after '!')"),
        };
    }
    makeEquals() {
        var tokenType = 'EQ';
        let positionStart = this.position.copy();
        this.advance();
        // Checking if it is double equals
        if (this.currentChar === '=') {
            this.advance();
            tokenType = 'EE';
        }
        return new tokens_1.Token(tokenType, undefined, positionStart, this.position);
    }
    makeLessThan() {
        var tokenType = 'LT';
        let positionStart = this.position.copy();
        this.advance();
        if (this.currentChar === '=') {
            this.advance();
            tokenType = 'LTE';
        }
        return new tokens_1.Token(tokenType, undefined, positionStart, this.position);
    }
    makeGreaterThan() {
        var tokenType = 'GT';
        let positionStart = this.position.copy();
        this.advance();
        if (this.currentChar === '=') {
            this.advance();
            tokenType = 'GTE';
        }
        return new tokens_1.Token(tokenType, undefined, positionStart, this.position);
    }
    makeIdentifier() {
        var idString = '';
        let positionStart = this.position.copy();
        while (this.currentChar &&
            `${constants_1.LETTERS_DIGITS}_`.includes(this.currentChar)) {
            idString += this.currentChar;
            this.advance();
        }
        let tokenType = constants_1.KEYWORDS.includes(idString)
            ? 'KEYWORD'
            : 'IDENTIFIER';
        return new tokens_1.Token(tokenType, idString, positionStart, this.position);
    }
    makeNumber() {
        var numberStr = '';
        var dotCount = 0;
        let positionStart = this.position.copy();
        while (this.currentChar !== null &&
            `${constants_1.DIGITS}.`.includes(this.currentChar)) {
            if (this.currentChar === '.') {
                if (dotCount === 1)
                    break;
                dotCount += 1;
                numberStr += '.';
            }
            else {
                numberStr += this.currentChar;
            }
            this.advance();
        }
        if (dotCount === 0) {
            return new tokens_1.Token('INT', Number(numberStr), positionStart, this.position);
        }
        else {
            return new tokens_1.Token('FLOAT', Number(numberStr), positionStart, this.position);
        }
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map