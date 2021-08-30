import { Display } from '../Types'

type TokenType =
  | 'INT'
  | 'FLOAT'
  | 'PLUS'
  | 'MINUS'
  | 'MUL'
  | 'DIV'
  | 'LPAREN'
  | 'RPAREN'

const Tokens: { [s: string]: TokenType } = {
  INT: 'INT',
  FLOAT: 'FLOAT',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MUL: 'MUL',
  DIV: 'DIV',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
}

type ValueType = string | number | undefined
class Token implements Display {
  type: TokenType
  value: ValueType

  constructor(type: TokenType, value: ValueType = undefined) {
    this.type = type
    this.value = value
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
