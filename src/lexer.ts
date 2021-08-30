import { Position } from './position'
import { Token } from './tokens'

import { DIGITS } from './shared/constants'
import { ErrorBase, IllegalCharError } from './shared/errors'

class Lexer {
  fileName: string
  text: string
  currentChar: string | null = null
  position: Position

  constructor(fileName: string, text: string) {
    this.fileName = fileName
    this.text = text
    this.position = new Position(-1, 0, -1, fileName, text)
    this.advance()
  }

  advance() {
    this.position.advance(this.currentChar)
    if (this.position.index < this.text.length) {
      this.currentChar = this.text[this.position.index]
    } else {
      this.currentChar = null
    }
  }

  makeTokens(): { tokens: Array<Token>; error: ErrorBase | null } {
    var tokens: Array<Token> = []
    while (this.currentChar !== null) {
      if (' \t'.includes(this.currentChar)) {
        this.advance()
      } else if (DIGITS.includes(this.currentChar)) {
        tokens.push(this.makeNumber())
      } else if (this.currentChar === '+') {
        tokens.push(new Token('PLUS'))
        this.advance()
      } else if (this.currentChar === '-') {
        tokens.push(new Token('MINUS'))
        this.advance()
      } else if (this.currentChar === '*') {
        tokens.push(new Token('MUL'))
        this.advance()
      } else if (this.currentChar === '/') {
        tokens.push(new Token('DIV'))
        this.advance()
      } else if (this.currentChar === '(') {
        tokens.push(new Token('LPAREN'))
        this.advance()
      } else if (this.currentChar === ')') {
        tokens.push(new Token('RPAREN'))
        this.advance()
      } else {
        let position_start = this.position.copy()
        let char = this.currentChar
        this.advance()
        return {
          tokens: [],
          error: new IllegalCharError(
            position_start,
            this.position,
            `'${char}'`,
          ),
        }
      }
    }
    return { tokens, error: null }
  }

  makeNumber(): Token {
    var numberStr = ''
    var dotCount = 0

    while (
      this.currentChar !== null &&
      `${DIGITS}.`.includes(this.currentChar)
    ) {
      if (this.currentChar === '.') {
        if (dotCount === 1) break
        dotCount += 1
        numberStr += '.'
      } else {
        numberStr += this.currentChar
      }
      this.advance()
    }

    if (dotCount === 0) {
      return new Token('INT', Number(numberStr))
    } else {
      return new Token('FLOAT', Number(numberStr))
    }
  }
}
