import { Position } from './position'
import { Token } from './tokens'

import { DIGITS } from '../shared/constants'
import { ErrorBase, IllegalCharError } from '../shared/errors'

export class Lexer {
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
        tokens.push(new Token('PLUS', undefined, this.position))
        this.advance()
      } else if (this.currentChar === '-') {
        tokens.push(new Token('MINUS', undefined, this.position))
        this.advance()
      } else if (this.currentChar === '*') {
        tokens.push(new Token('MUL', undefined, this.position))
        this.advance()
      } else if (this.currentChar === '/') {
        tokens.push(new Token('DIV', undefined, this.position))
        this.advance()
      } else if (this.currentChar === '^') {
        tokens.push(new Token('POW', undefined, this.position))
        this.advance()
      } else if (this.currentChar === '(') {
        tokens.push(new Token('LPAREN', undefined, this.position))
        this.advance()
      } else if (this.currentChar === ')') {
        tokens.push(new Token('RPAREN', undefined, this.position))
        this.advance()
      } else {
        let positionStart = this.position.copy()
        let char = this.currentChar
        this.advance()
        return {
          tokens: [],
          error: new IllegalCharError(
            positionStart,
            this.position,
            `'${char}'`,
          ),
        }
      }
    }
    tokens.push(new Token('EOF', undefined, this.position))
    return { tokens, error: null }
  }

  makeNumber(): Token {
    var numberStr = ''
    var dotCount = 0
    let positionStart = this.position.copy()

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
      return new Token('INT', Number(numberStr), positionStart, this.position)
    } else {
      return new Token('FLOAT', Number(numberStr), positionStart, this.position)
    }
  }
}
