type TokenType =
  | 'INT'
  | 'FLOAT'
  | 'PLUS'
  | 'MINUS'
  | 'MUL'
  | 'DIV'
  | 'LPAREN'
  | 'RPAREN'

class Token {
  type: TokenType
  value: string | null

  constructor(type: TokenType, value = null) {
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

export { Token, TokenType }
