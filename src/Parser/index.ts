import { StringOrNumberType, Token, TokenType } from '../base/tokens'
import {
  BinaryOperationNode,
  NumberNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
  IfNode,
  NodeType,
  IfExpressionCaseType,
  ForNode,
  WhileNode,
  FunctionDefinitionNode,
  CallNode,
  StringNode,
  ListNode,
} from './nodes'
import { InvalidSyntaxError } from '../Shared/errors'
import { ParseResult } from './ParseResult'

type BinaryFnType =
  | 'FACTOR'
  | 'TERM'
  | 'ATOM'
  | 'CALL'
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
    this.updateCurrentToken()
    return this.currentToken
  }

  reverse(amount: number = 1): Token {
    this.tokenIndex -= amount
    this.updateCurrentToken()
    return this.currentToken
  }

  updateCurrentToken() {
    if (this.tokenIndex >= 0 && this.tokenIndex < this.tokens.length) {
      this.currentToken = this.tokens[this.tokenIndex]
    }
  }

  ////////////////////////////////////
  statements() {
    let result = new ParseResult()
    var statements: Array<NodeType> = []
    let positionStart = this.currentToken.positionStart.copy()

    while (this.currentToken.type === 'NEWLINE') {
      result.registerAdvancement()
      this.advance()
    }

    let statement = result.register(this.expr())
    if (result.error) return result
    statements.push(statement)

    var moreStatements = true
    while (true) {
      var newlineCount = 0
      // @ts-ignore
      while (this.currentToken.type === 'NEWLINE') {
        result.registerAdvancement()
        this.advance()
        newlineCount += 1
      }
      if (newlineCount === 0) moreStatements = false
      if (!moreStatements) break
      statement = result.try_register(this.expr())
      if (!statement) {
        this.reverse(result.toReverseCount)
        moreStatements = false
        continue
      }
      statements.push(statement)
    }

    return result.success(
      new ListNode(
        statements,
        positionStart,
        this.currentToken.positionEnd.copy(),
      ),
    )
  }

  parse(): ParseResult {
    let result = this.statements()
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
        : x === 'CALL'
        ? this.call()
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

  call(): ParseResult {
    let result = new ParseResult()
    let atom = result.register(this.atom())
    if (result.error) return result

    if (this.currentToken.type === 'LPAREN') {
      result.registerAdvancement()
      this.advance()
      var argNodes: Array<NodeType> = []

      // @ts-ignore
      if (this.currentToken.type === 'RPAREN') {
        result.registerAdvancement()
        this.advance()
      } else {
        argNodes.push(result.register(this.expr()))
        if (result.error) {
          return result.failure(
            new InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              "Expected ')', 'VAR', 'IF', 'FOR', 'WHILE', 'FUN', int, float, identifier, '+', '-', '(', '[' or 'NOT'",
            ),
          )
        }

        // @ts-ignore
        while (this.currentToken.type === 'COMMA') {
          result.registerAdvancement()
          this.advance()

          argNodes.push(result.register(this.expr()))
          if (result.error) return result
        }

        // @ts-ignore
        if (this.currentToken.type !== 'RPAREN') {
          return result.failure(
            new InvalidSyntaxError(
              this.currentToken.positionStart,
              this.currentToken.positionEnd,
              "Expected ',' or ')'",
            ),
          )
        }

        result.registerAdvancement()
        this.advance()
      }
      return result.success(new CallNode(atom, argNodes))
    }
    return result.success(atom)
  }

  atom() {
    let result = new ParseResult()
    let token = this.currentToken

    if (['INT', 'FLOAT'].includes(token.type)) {
      result.registerAdvancement()
      this.advance()
      return result.success(new NumberNode(token))
    } else if (token.type === 'STRING') {
      result.registerAdvancement()
      this.advance()
      return result.success(new StringNode(token))
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
      } else {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ')'",
          ),
        )
      }
    } else if (token.type === 'LSQUARE') {
      let listExpression = result.register(this.listExpression())
      if (result.error) return result
      return result.success(listExpression)
    } else if (token.matches('KEYWORD', 'IF')) {
      let ifExpression = result.register(this.ifExpression())
      if (result.error) return result
      return result.success(ifExpression)
    } else if (token.matches('KEYWORD', 'FOR')) {
      let forExpression = result.register(this.forExpression())
      if (result.error) return result
      return result.success(forExpression)
    } else if (token.matches('KEYWORD', 'WHILE')) {
      let whileExpression = result.register(this.whileExpression())
      if (result.error) return result
      return result.success(whileExpression)
    } else if (token.matches('KEYWORD', 'FUN')) {
      let whileExpression = result.register(this.functionDefinition())
      if (result.error) return result
      return result.success(whileExpression)
    }

    return result.failure(
      new InvalidSyntaxError(
        this.currentToken.positionStart,
        this.currentToken.positionEnd,
        "Expected int, float, identifier, '+', '-', '(', '[', 'IF', 'FOR', 'WHILE', 'FUN'",
      ),
    )
  }

  power() {
    return this.binaryOperation('CALL', [{ type: 'POW' }], 'FACTOR')
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

  listExpression(): ParseResult {
    let result = new ParseResult()
    var elementNodes: Array<NodeType> = []
    let positionStart = this.currentToken.positionStart.copy()

    if (this.currentToken.type !== 'LSQUARE') {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '['",
        ),
      )
    }

    result.registerAdvancement()
    this.advance()

    // @ts-ignore
    if (this.currentToken.type === 'RSQUARE') {
      result.registerAdvancement()
      this.advance()
    } else {
      elementNodes.push(result.register(this.expr()))
      if (result.error) {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ']', 'VAR', 'IF', 'FOR', 'WHILE', 'FUN', int, float, identifier, '+', '-', '(', '[' or 'NOT'",
          ),
        )
      }

      // @ts-ignore
      while (this.currentToken.type === 'COMMA') {
        result.registerAdvancement()
        this.advance()

        elementNodes.push(result.register(this.expr()))
        if (result.error) return result
      }

      // @ts-ignore
      if (this.currentToken.type !== 'RSQUARE') {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ',' or ']'",
          ),
        )
      }

      result.registerAdvancement()
      this.advance()
    }

    return result.success(
      new ListNode(
        elementNodes,
        positionStart,
        this.currentToken.positionEnd.copy(),
      ),
    )
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
          "Expected 'VAR', 'IF', 'FOR', 'WHILE', 'FUN', int, float, identifier, '+', '-', '(', '[' or 'NOT'",
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
    var cases: Array<IfExpressionCaseType> = []
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

  forExpression(): ParseResult {
    let result = new ParseResult()

    if (!this.currentToken.matches('KEYWORD', 'FOR')) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'FOR'",
        ),
      )
    }

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

    let startValue = result.register(this.expr())
    if (result.error) return result

    if (!this.currentToken.matches('KEYWORD', 'TO')) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'TO'",
        ),
      )
    }

    result.registerAdvancement()
    this.advance()

    let endValue = result.register(this.expr())
    if (result.error) return result

    var stepValue: NodeType = null
    if (this.currentToken.matches('KEYWORD', 'STEP')) {
      result.registerAdvancement()
      this.advance()

      stepValue = result.register(this.expr())
      if (result.error) return result
    }

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

    let body = result.register(this.expr())
    if (result.error) return result

    return result.success(
      new ForNode(varName, startValue, endValue, body, stepValue),
    )
  }

  whileExpression(): ParseResult {
    let result = new ParseResult()
    if (!this.currentToken.matches('KEYWORD', 'WHILE')) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'WHILE'",
        ),
      )
    }

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

    let body = result.register(this.expr())
    if (result.error) return result

    return result.success(new WhileNode(condition, body))
  }

  functionDefinition(): ParseResult {
    let result = new ParseResult()

    if (!this.currentToken.matches('KEYWORD', 'FUN')) {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected 'FUN'",
        ),
      )
    }

    result.registerAdvancement()
    this.advance()

    var varNameToken: Token
    if (this.currentToken.type === 'IDENTIFIER') {
      varNameToken = this.currentToken
      result.registerAdvancement()
      this.advance()

      // @ts-ignore
      if (this.currentToken.type !== 'LPAREN') {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected '('",
          ),
        )
      }
    } else {
      if (this.currentToken.type !== 'LPAREN') {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected identifier or '('",
          ),
        )
      }
    }

    result.registerAdvancement()
    this.advance()

    var argNameTokens: Array<Token> = []
    // @ts-ignore
    if (this.currentToken.type === 'IDENTIFIER') {
      argNameTokens.push(this.currentToken)
      result.registerAdvancement()
      this.advance()

      while (this.currentToken.type === 'COMMA') {
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

        argNameTokens.push(this.currentToken)
        result.registerAdvancement()
        this.advance()
      }

      if (this.currentToken.type !== 'RPAREN') {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected ',' or ')'",
          ),
        )
      }
    } else {
      // @ts-ignore
      if (this.currentToken.type !== 'RPAREN') {
        return result.failure(
          new InvalidSyntaxError(
            this.currentToken.positionStart,
            this.currentToken.positionEnd,
            "Expected identifier or ')'",
          ),
        )
      }
    }

    result.registerAdvancement()
    this.advance()

    if (this.currentToken.type !== 'ARROW') {
      return result.failure(
        new InvalidSyntaxError(
          this.currentToken.positionStart,
          this.currentToken.positionEnd,
          "Expected '->'",
        ),
      )
    }

    result.registerAdvancement()
    this.advance()

    let nodeToReturn = result.register(this.expr())
    if (result.error) return result

    return result.success(
      new FunctionDefinitionNode(nodeToReturn, argNameTokens, varNameToken),
    )
  }
}

export { Parser }
