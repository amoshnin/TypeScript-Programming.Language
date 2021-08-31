import { Token, Tokens, TokenType } from '../base/tokens'
import { BinaryOperationNode, NumberNode, UnaryOperationNode } from './nodes'
import { InvalidSyntaxError } from '../Shared/errors'

export type SomeNodeType =
  | NumberNode
  | BinaryOperationNode
  | Token
  | ParseResult

class ParseResult {
  error = null
  node = null

  register(result: SomeNodeType): SomeNodeType {
    if (result instanceof ParseResult) {
      if (result.error) {
        this.error = result.error
      }
      return result.node
    }
    return result
  }

  success(node): ParseResult {
    this.node = node
    return this
  }

  failure(error): ParseResult {
    this.error
    return this
  }
}
class Parser {
  tokens: Array<Token>
  tokenIndex: number = -1
  currentToken: Token

  constructor(tokens: Array<Token>) {
    this.tokens = tokens
    this.advance()
  }

  advance(): Token {
    this.tokenIndex += 1
    if (this.tokenIndex < this.tokens.length) {
      this.currentToken = this.tokens[this.tokenIndex]
    }
    return this.currentToken
  }

  ////////////////////////////////////
  parse(): ParseResult {
    let result = this.expr()
    if (!result.error && this.currentToken.type !== Tokens.EOF) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '+', '-', '*' or '/'",
        ),
      )
    }
    return result
  }

  binaryOperation(
    typeFn: 'FACTOR' | 'TERM',
    operations: Array<TokenType>,
  ): ParseResult {
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
      left = new BinaryOperationNode(left, operation_token, right)
    }
    return result.success(left)
  }

  factor() {
    let result = new ParseResult()

    let token = this.currentToken
    if (token) {
      if ([Tokens.PLUS, Tokens.MINUS].includes(token.type)) {
        result.register(this.advance())
        let factor = result.register(this.factor())
        if (result.error) {
          return result
        }
        return result.success(new UnaryOperationNode(token, factor))
      } else if ([Tokens.INT, Tokens.FLOAT].includes(token.type)) {
        result.register(this.advance())
        return result.success(new NumberNode(token))
      } else if (token.type === Tokens.LPAREN) {
        result.register(this.advance())
        let expr = result.register(this.expr())
        if (result.error) {
          return result
        }
        if (this.currentToken.type === Tokens.RPAREN) {
          result.register(this.advance())
          return result.success(expr)
        } else {
          return result.failure(
            new InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              "Expected ')'",
            ),
          )
        }
      }

      return result.failure(
        new InvalidSyntaxError(
          token.positionStart,
          token.positionEnd,
          'Expected int or float',
        ),
      )
    }
  }

  term(): ParseResult {
    return this.binaryOperation('FACTOR', ['MUL', 'DIV'])
  }

  expr(): ParseResult {
    return this.binaryOperation('TERM', ['PLUS', 'MINUS'])
  }
}

export { Parser }
