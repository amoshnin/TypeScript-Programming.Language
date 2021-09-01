import { Position } from './position'
import { Token, TokenType } from './tokens'

import {
  DIGITS,
  LETTERS,
  LETTERS_DIGITS,
  KEYWORDS,
  KeywordType,
} from '../shared/constants'
import {
  ErrorBase,
  ExpectedCharError,
  IllegalCharError,
} from '../shared/errors'

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
      } else if (LETTERS.includes(this.currentChar)) {
        tokens.push(this.makeIdentifier())
      } else if (this.currentChar === '+') {
        tokens.push(new Token('PLUS', undefined, this.position))
        this.advance()
      } else if (this.currentChar === '-') {
        tokens.push(this.makeMinusOrArrow())
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
      } else if (this.currentChar === '!') {
        const { token, error } = this.makeNotEquals()
        if (error) return { tokens: [], error }
        tokens.push(token)
      } else if (this.currentChar === '=') {
        tokens.push(this.makeEquals())
      } else if (this.currentChar === '<') {
        tokens.push(this.makeLessThan())
      } else if (this.currentChar === '>') {
        tokens.push(this.makeGreaterThan())
      } else if (this.currentChar === ',') {
        tokens.push(new Token('COMMA', undefined, this.position))
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

  makeMinusOrArrow(): Token {
    var tokenType: TokenType = 'MINUS'
    let positionStart = this.position.copy()
    this.advance()

    if (this.currentChar === '>') {
      this.advance()
      tokenType = 'ARROW'
    }

    return new Token(tokenType, undefined, positionStart, this.position)
  }

  makeNotEquals(): { token?: Token; error?: ExpectedCharError } {
    let positionStart = this.position.copy()
    this.advance()
    if (this.currentChar === '=') {
      this.advance()
      return { token: new Token('NE', undefined, positionStart, this.position) }
    }
    this.advance()
    return {
      error: new ExpectedCharError(
        positionStart,
        this.position,
        "'=' (after '!')",
      ),
    }
  }

  makeEquals(): Token {
    var tokenType: TokenType = 'EQ'
    let positionStart = this.position.copy()
    this.advance()

    // Checking if it is double equals
    if (this.currentChar === '=') {
      this.advance()
      tokenType = 'EE'
    }

    return new Token(tokenType, undefined, positionStart, this.position)
  }

  makeLessThan(): Token {
    var tokenType: TokenType = 'LT'
    let positionStart = this.position.copy()
    this.advance()

    if (this.currentChar === '=') {
      this.advance()
      tokenType = 'LTE'
    }

    return new Token(tokenType, undefined, positionStart, this.position)
  }

  makeGreaterThan(): Token {
    var tokenType: TokenType = 'GT'
    let positionStart = this.position.copy()
    this.advance()

    if (this.currentChar === '=') {
      this.advance()
      tokenType = 'GTE'
    }

    return new Token(tokenType, undefined, positionStart, this.position)
  }

  makeIdentifier(): Token {
    var idString = ''
    let positionStart = this.position.copy()

    while (
      this.currentChar &&
      `${LETTERS_DIGITS}_`.includes(this.currentChar)
    ) {
      idString += this.currentChar
      this.advance()
    }

    let tokenType: TokenType = KEYWORDS.includes(idString as KeywordType)
      ? 'KEYWORD'
      : 'IDENTIFIER'

    return new Token(tokenType, idString, positionStart, this.position)
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
