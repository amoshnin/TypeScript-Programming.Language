'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Lexer = void 0
const position_1 = require('./position')
const tokens_1 = require('./tokens')
const constants_1 = require('../shared/constants')
const errors_1 = require('../shared/errors')
class Lexer {
  constructor(fileName, text) {
    this.currentChar = null
    this.fileName = fileName
    this.text = text
    this.position = new position_1.Position(-1, 0, -1, fileName, text)
    this.advance()
  }
  advance() {
    this.position.advance(this.currentChar)
    if (this.position.index < this.text.length) {
      this.currentChar = this.text[this.position.index]
    } else {
      this.currentChar = null
    }
  }
  makeTokens() {
    var tokens = []
    while (this.currentChar !== null) {
      if (' \t'.includes(this.currentChar)) {
        this.advance()
      } else if (constants_1.DIGITS.includes(this.currentChar)) {
        tokens.push(this.makeNumber())
      } else if (this.currentChar === '+') {
        tokens.push(new tokens_1.Token('PLUS'))
        this.advance()
      } else if (this.currentChar === '-') {
        tokens.push(new tokens_1.Token('MINUS'))
        this.advance()
      } else if (this.currentChar === '*') {
        tokens.push(new tokens_1.Token('MUL'))
        this.advance()
      } else if (this.currentChar === '/') {
        tokens.push(new tokens_1.Token('DIV'))
        this.advance()
      } else if (this.currentChar === '(') {
        tokens.push(new tokens_1.Token('LPAREN'))
        this.advance()
      } else if (this.currentChar === ')') {
        tokens.push(new tokens_1.Token('RPAREN'))
        this.advance()
      } else {
        let positionStart = this.position.copy()
        let char = this.currentChar
        this.advance()
        return {
          tokens: [],
          error: new errors_1.IllegalCharError(
            positionStart,
            this.position,
            `'${char}'`,
          ),
        }
      }
    }
    tokens.push(new tokens_1.Token('EOF', undefined, this.position))
    return { tokens, error: null }
  }
  makeNumber() {
    var numberStr = ''
    var dotCount = 0
    while (
      this.currentChar !== null &&
      `${constants_1.DIGITS}.`.includes(this.currentChar)
    ) {
      if (this.currentChar === '.') {
        if (dotCount === 1) break
        dotCount += 1
        numberStr += '.'
      } else {
        numberStr += this.currentChar
      }
      this.advance()
    }
    if (dotCount === 0) {
      return new tokens_1.Token('INT', Number(numberStr))
    } else {
      return new tokens_1.Token('FLOAT', Number(numberStr))
    }
  }
}
exports.Lexer = Lexer
//# sourceMappingURL=lexer.js.map
