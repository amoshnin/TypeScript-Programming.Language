import { Display } from '../Types'
import { Position } from './position'

type TokenType =
  | 'INT'
  | 'FLOAT'
  | 'PLUS'
  | 'MINUS'
  | 'MUL'
  | 'DIV'
  | 'LPAREN'
  | 'RPAREN'
  | 'EOF'

const Tokens: { [s: string]: TokenType } = {
  INT: 'INT',
  FLOAT: 'FLOAT',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MUL: 'MUL',
  DIV: 'DIV',
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
    value: ValueType = undefined,
    positionStart: Position = undefined,
    positionEnd: Position = undefined,
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

  descr(): string {
    if (this.value) {
      return `${this.type}:${this.value}`
    } else {
      return `${this.type}`
    }
  }
}

export { Token, TokenType, Tokens }
