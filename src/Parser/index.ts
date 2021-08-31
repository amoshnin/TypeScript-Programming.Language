import { Token, Tokens, TokenType } from '../base/tokens'
import {
  BinaryOperationNode,
  NumberNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
} from './nodes'
import { InvalidSyntaxError } from '../Shared/errors'
import { ParseResult } from './ParseResult'

export type SomeNodeType =
  | NumberNode
  | BinaryOperationNode
  | Token
  | ParseResult

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
    leftFn: 'FACTOR' | 'TERM' | 'ATOM',
    operations: Array<TokenType>,
    rightFn?: 'FACTOR' | 'TERM' | 'ATOM',
  ): ParseResult {
    const s = (x: 'FACTOR' | 'TERM' | 'ATOM') => {
      return x === 'FACTOR'
        ? this.factor()
        : x === 'ATOM'
        ? this.atom()
        : this.term()
    }

    if (!rightFn) {
      rightFn = leftFn
    }

    let result = new ParseResult()
    var left = result.register(s(leftFn))
    if (result.error) return result
    while (operations.includes(this.currentToken.type)) {
      let operation_token = this.currentToken
      result.registerAdvancement()
      this.advance()
      let right = result.register(s(rightFn))
      if (result.error) return result
      left = new BinaryOperationNode(left, operation_token, right)
    }
    return result.success(left)
  }

  atom() {
    let result = new ParseResult()
    let token = this.currentToken

    if ([Tokens.INT, Tokens.FLOAT].includes(token.type)) {
      result.registerAdvancement()
      this.advance()
      return result.success(new NumberNode(token))
    } else if (token.type === 'IDENTIFIER') {
      result.registerAdvancement()
      this.advance()
      return result.success(new VarAccessNode(token))
    } else if (token.type === 'LPAREN') {
      result.registerAdvancement()
      this.advance()
      let expr = result.register(this.expr())
      if (result.error) return result
      if (this.currentToken.type === Tokens.RPAREN) {
        result.registerAdvancement()
        this.advance()
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
        this.currentToken.positionStart,
        this.currentToken.positionEnd,
        "Expected int, float, identifier, '+', '-' or '('",
      ),
    )
  }

  power() {
    return this.binaryOperation('ATOM', ['POW'], 'FACTOR')
  }

  factor() {
    let result = new ParseResult()
    let token = this.currentToken
    if ([Tokens.PLUS, Tokens.MINUS].includes(token.type)) {
      result.registerAdvancement()
      this.advance()
      let factor = result.register(this.factor())
      if (result.error) return result
      return result.success(new UnaryOperationNode(token, factor))
    }
    return this.power()
  }

  term(): ParseResult {
    return this.binaryOperation('FACTOR', ['MUL', 'DIV'])
  }

  expr(): ParseResult {
    let result = new ParseResult()
    if (this.currentToken.matches('KEYWORD', 'VAR')) {
      result.registerAdvancement()
      this.advance()

      if (this.currentToken.type !== 'IDENTIFIER') {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            'Expected identifier',
          ),
        )
      }

      let varName = this.currentToken
      result.registerAdvancement()
      this.advance()

      //@ts-ignore
      if (this.currentToken.type !== 'EQ') {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected '='",
          ),
        )
      }

      result.registerAdvancement()
      this.advance()
      let expr = result.register(this.expr())
      if (result.error) return result
      return result.success(new VarAssignNode(varName, expr))
    }

    let node = result.register(this.binaryOperation('TERM', ['PLUS', 'MINUS']))
    if (result.error) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'VAR', int, float, identifier, '+', '-' or '('",
        ),
      )
    }
    return result.success(node)
  }
}

export { Parser }
