import { Position } from './position'

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

  makeTokens() {
    var tokens = []
    while (this.currentChar != null) {}
  }
}
