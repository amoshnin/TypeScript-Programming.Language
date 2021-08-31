import { Position } from '../Base/position'
import { Display } from '../Types'

class ErrorBase implements Display {
  positionStart: Position
  positionEnd: Position
  error_name: string
  details: string

  constructor(
    positionStart: Position,
    positionEnd: Position,
    error_name: string,
    details: string,
  ) {
    this.positionStart = positionStart
    this.positionEnd = positionEnd
    this.error_name = error_name
    this.details = details
  }

  descr(): string {
    var result = `${this.error_name}: ${this.details}\n`
    result += `File: ${this.positionStart.fileName}, `
    result += `line: ${this.positionStart.line + 1}, `
    result += `column: ${this.positionStart.column + 1}`
    return result
  }
}

class IllegalCharError extends ErrorBase {
  constructor(positionStart: Position, positionEnd: Position, details: string) {
    super(positionStart, positionEnd, 'Illegal Character', details)
  }
}

class InvalidSyntaxError extends ErrorBase {
  constructor(positionStart: Position, positionEnd: Position, details: string) {
    super(positionStart, positionEnd, 'Invalid Syntax', details)
  }
}

export { ErrorBase, IllegalCharError, InvalidSyntaxError }
