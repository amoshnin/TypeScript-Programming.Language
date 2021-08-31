import { KeywordType } from '../shared/constants'
import { Display } from '../Types'
import { Position } from './position'

type TokenType =
  | 'INT'
  | 'FLOAT'
  | 'IDENTIFIER'
  | 'KEYWORD'
  | 'PLUS'
  | 'MINUS'
  | 'MUL'
  | 'DIV'
  | 'POW'
  | 'EQ'
  | 'LPAREN'
  | 'RPAREN'
  | 'EOF'

const Tokens: { [s: string]: TokenType } = {
  INT: 'INT',
  FLOAT: 'FLOAT',
  PLUS: 'PLUS',
  IDENTIFIER: 'IDENTIFIER',
  KEYWORD: 'KEYWORD',
  MINUS: 'MINUS',
  MUL: 'MUL',
  DIV: 'DIV',
  POW: 'POW',
  EQ: 'EQ',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  EOF: 'EOF',
}

type ValueType = string | number | undefined
class Token implements Display {
  type: TokenType
  value: ValueType

  positionStart: Position
  positionEnd: Position

  constructor(
    type: TokenType,
    value?: ValueType,
    positionStart?: Position,
    positionEnd?: Position,
  ) {
    this.type = type
    this.value = value

    if (positionStart) {
      this.positionStart = positionStart.copy()
      this.positionEnd = positionStart.copy()
      this.positionEnd.advance()
    }

    if (positionEnd) {
      this.positionEnd = positionEnd
    }
  }

  matches(type: TokenType, value: KeywordType) {
    return this.type === type && this.value === value
  }

  descr(): string {
    if (this.value) {
      return `${this.type}:${this.value}`
    } else {
      return `${this.type}`
    }
  }
}

export { Token, TokenType, Tokens }
