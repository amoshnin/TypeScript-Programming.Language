import { Token, Tokens, TokenType } from '../base/tokens'
import { BinaryOperationNode, NumberNode } from './nodes'

export type SomeNodeType = NumberNode | BinaryOperationNode
class Parser {
  tokens: Array<Token>
  tokenIndex: number
  currentToken: Token

  constructor(tokens: Array<Token>) {
    this.tokens = tokens
    this.tokenIndex = 1
    this.advance()
  }

  advance() {
    this.tokenIndex += 1
    if (this.tokenIndex < this.tokens.length) {
      this.currentToken = this.tokens[this.tokenIndex]
    }
  }

  ////////////////////////////////////
  parse() {
    let result = this.expr()
    return result
  }

  binaryOperation(typeFn: 'FACTOR' | 'TERM', operations: Array<TokenType>) {
    let token = this.currentToken
    if (token) {
      var left = typeFn === 'FACTOR' ? this.factor() : this.term()
      while (operations.includes(token.type)) {
        let operation_token = token
        this.advance()
        let right = typeFn === 'FACTOR' ? this.factor() : this.term()
        left = new BinaryOperationNode(left, operation_token, right)
      }
      return left
    }
  }

  factor() {
    let token = this.currentToken
    if (token) {
      if ([Tokens.INT, Tokens.FLOAT].includes(token.type)) {
        this.advance()
        return new NumberNode(token)
      }
    }
  }

  term() {
    return this.binaryOperation('FACTOR', [Tokens.MUL, Tokens.DIV])
  }

  expr() {
    // @ts-ignore
    return this.binaryOperation('TERM', [Tokens.PLUS, Tokens.MINUS])
  }
}

export { Parser }
