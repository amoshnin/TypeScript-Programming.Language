import { StringOrNumberType, Token, TokenType } from '../base/tokens'
import {
  BinaryOperationNode,
  NumberNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
  IfNode,
  NodeType,
  IfExpressionCase,
} from './nodes'
import { InvalidSyntaxError } from '../Shared/errors'
import { ParseResult } from './ParseResult'

type BinaryFnType =
  | 'FACTOR'
  | 'TERM'
  | 'ATOM'
  | 'COMPARISON_EXPRESSION'
  | 'ARITHMETIC_EXPRESSION'

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
    if (!result.error && this.currentToken.type !== 'EOF') {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '+', '-', '*', '/', '^', '==', '!=', '<', '>', <=', '>=', 'AND' or 'OR'",
        ),
      )
    }
    return result
  }

  binaryOperation(
    leftFn: BinaryFnType,
    operations: Array<{ type: TokenType; value?: StringOrNumberType }>,
    rightFn?: BinaryFnType,
  ): ParseResult {
    let q = operations.map((item) => JSON.stringify(item))

    const s = (x: BinaryFnType) => {
      return x === 'FACTOR'
        ? this.factor()
        : x === 'ATOM'
        ? this.atom()
        : x === 'COMPARISON_EXPRESSION'
        ? this.comparisonExpression()
        : x === 'ARITHMETIC_EXPRESSION'
        ? this.arithmeticExpression()
        : this.term()
    }

    if (!rightFn) {
      rightFn = leftFn
    }

    let result = new ParseResult()
    var left = result.register(s(leftFn))
    if (result.error) return result
    while (
      q.includes(JSON.stringify({ type: this.currentToken.type })) ||
      q.includes(
        JSON.stringify({
          type: this.currentToken.type,
          value: this.currentToken.value,
        }),
      )
    ) {
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

    if (['INT', 'FLOAT'].includes(token.type)) {
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
      if (this.currentToken.type === 'RPAREN') {
        result.registerAdvancement()
        this.advance()
        return result.success(expr)
      }
    } else if (token.matches('KEYWORD', 'IF')) {
      let ifExpression = result.register(this.ifExpression())
      if (result.error) return result
      return result.success(ifExpression)
    }

    return result.failure(
      new InvalidSyntaxError(
        this.currentToken.positionStart,
        this.currentToken.positionEnd,
        "Expected ')'",
      ),
    )

    return result.failure(
      new InvalidSyntaxError(
        this.currentToken.positionStart,
        this.currentToken.positionEnd,
        "Expected int, float, identifier, '+', '-' or '('",
      ),
    )
  }

  power() {
    return this.binaryOperation('ATOM', [{ type: 'POW' }], 'FACTOR')
  }

  factor() {
    let result = new ParseResult()
    let token = this.currentToken
    if (['PLUS', 'MINUS'].includes(token.type)) {
      result.registerAdvancement()
      this.advance()
      let factor = result.register(this.factor())
      if (result.error) return result
      return result.success(new UnaryOperationNode(token, factor))
    }
    return this.power()
  }

  term(): ParseResult {
    return this.binaryOperation('FACTOR', [{ type: 'MUL' }, { type: 'DIV' }])
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

    let node = result.register(
      this.binaryOperation('COMPARISON_EXPRESSION', [
        { type: 'KEYWORD', value: 'AND' },
        { type: 'KEYWORD', value: 'OR' },
      ]),
    )

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

  comparisonExpression(): ParseResult {
    let result = new ParseResult()
    if (this.currentToken.matches('KEYWORD', 'NOT')) {
      let operationToken = this.currentToken
      result.registerAdvancement()
      this.advance()

      let node = result.register(this.comparisonExpression())
      if (result.error) return result
      return result.success(new UnaryOperationNode(operationToken, node))
    }

    let node = result.register(
      this.binaryOperation('ARITHMETIC_EXPRESSION', [
        { type: 'EE' },
        { type: 'NE' },
        { type: 'LT' },
        { type: 'GT' },
        { type: 'LTE' },
        { type: 'GTE' },
      ]),
    )

    if (result.error) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected int, float, identifier, '+', '-' or '(', 'NOT'",
        ),
      )
    }

    return result.success(node)
  }

  arithmeticExpression(): ParseResult {
    return this.binaryOperation('TERM', [{ type: 'PLUS' }, { type: 'MINUS' }])
  }

  ifExpression(): ParseResult {
    let result = new ParseResult()
    var cases: Array<IfExpressionCase> = []
    var elseCase: NodeType

    if (!this.currentToken.matches('KEYWORD', 'IF')) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'IF'",
        ),
      )
    }

    result.registerAdvancement()
    this.advance()

    let condition = result.register(this.expr()) // Taking the condition to be compared
    if (result.error) return result

    if (!this.currentToken.matches('KEYWORD', 'THEN')) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'THEN'",
        ),
      )
    }

    result.registerAdvancement()
    this.advance()

    let expr = result.register(this.expr()) // Taking the expression to be executed if condition succeeds
    if (result.error) return result
    cases.push({ condition, expr })

    while (this.currentToken.matches('KEYWORD', 'ELIF')) {
      result.registerAdvancement()
      this.advance()

      let condition = result.register(this.expr())
      if (result.error) return result

      if (!this.currentToken.matches('KEYWORD', 'THEN')) {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected 'THEN'",
          ),
        )
      }

      result.registerAdvancement()
      this.advance()

      let expr = result.register(this.expr())
      if (result.error) return result
      cases.push({ condition, expr })
    }

    if (this.currentToken.matches('KEYWORD', 'ELSE')) {
      result.registerAdvancement()
      this.advance()

      elseCase = result.register(this.expr())
      if (result.error) return result
    }

    return result.success(new IfNode(cases, elseCase))
  }
}

export { Parser }
