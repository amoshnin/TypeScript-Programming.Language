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

  position_start: Position
  position_end: Position

  constructor(
    type: TokenType,
    value: ValueType = undefined,
    position_start: Position = undefined,
    position_end: Position = undefined,
  ) {
    this.type = type
    this.value = value

    if (position_start) {
      this.position_start = position_start.copy()
      this.position_end = position_start.copy()
      this.position_end.advance()
    }

    if (position_end) {
      this.position_end = position_end
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
