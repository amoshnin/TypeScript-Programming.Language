'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Parser = void 0
const tokens_1 = require('../base/tokens')
const nodes_1 = require('./nodes')
const errors_1 = require('../Shared/errors')
class ParseResult {
  constructor() {
    this.error = null
    this.node = null
  }
  register(result) {
    if (result instanceof ParseResult) {
      if (result.error) {
        this.error = result.error
      }
      return result.node
    }
    return result
  }
  success(node) {
    this.node = node
    return this
  }
  failure(error) {
    this.error
    return this
  }
}
class Parser {
  constructor(tokens) {
    this.tokenIndex = -1
    this.tokens = tokens
    this.advance()
  }
  advance() {
    this.tokenIndex += 1
    if (this.tokenIndex < this.tokens.length) {
      this.currentToken = this.tokens[this.tokenIndex]
    }
    return this.currentToken
  }
  ////////////////////////////////////
  parse() {
    let result = this.expr()
    if (!result.error && this.currentToken.type !== tokens_1.Tokens.EOF) {
      return result.failure(
        new errors_1.InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '+', '-', '*' or '/'",
        ),
      )
    }
    return result
  }
  binaryOperation(typeFn, operations) {
    let result = new ParseResult()
    var left = result.register(
      typeFn === 'FACTOR' ? this.factor() : this.term(),
    )
    if (result.error) return result
    while (operations.includes(this.currentToken.type)) {
      let operation_token = this.currentToken
      result.register(this.advance())
      let right = result.register(
        typeFn === 'FACTOR' ? this.factor() : this.term(),
      )
      if (result.error) {
        return result
      }
      left = new nodes_1.BinaryOperationNode(left, operation_token, right)
    }
    return result.success(left)
  }
  factor() {
    let result = new ParseResult()
    let token = this.currentToken
    if (token) {
      if ([tokens_1.Tokens.PLUS, tokens_1.Tokens.MINUS].includes(token.type)) {
        result.register(this.advance())
        let factor = result.register(this.factor())
        if (result.error) {
          return result
        }
        return result.success(new nodes_1.UnaryOperationNode(token, factor))
      } else if (
        [tokens_1.Tokens.INT, tokens_1.Tokens.FLOAT].includes(token.type)
      ) {
        result.register(this.advance())
        return result.success(new nodes_1.NumberNode(token))
      } else if (token.type === tokens_1.Tokens.LPAREN) {
        result.register(this.advance())
        let expr = result.register(this.expr())
        if (result.error) {
          return result
        }
        if (this.currentToken.type === tokens_1.Tokens.RPAREN) {
          result.register(this.advance())
          return result.success(expr)
        } else {
          return result.failure(
            new errors_1.InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              "Expected ')'",
            ),
          )
        }
      }
      return result.failure(
        new errors_1.InvalidSyntaxError(
          token.positionStart,
          token.positionEnd,
          'Expected int or float',
        ),
      )
    }
  }
  term() {
    return this.binaryOperation('FACTOR', ['MUL', 'DIV'])
  }
  expr() {
    return this.binaryOperation('TERM', ['PLUS', 'MINUS'])
  }
}
exports.Parser = Parser
//# sourceMappingURL=index.js.map
