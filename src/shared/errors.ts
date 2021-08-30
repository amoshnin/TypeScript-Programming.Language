import { Position } from '../components/position'

class ErrorBase {
  position_start: Position
  position_end: Position
  error_name: string
  details: string

  constructor(position_start, position_end, error_name, details) {
    this.position_start = position_start
    this.position_end = position_end
    this.error_name = error_name
    this.details = details
  }

  descr(): string {
    var result = `${this.error_name}: ${this.details}\n`
    result += `File: ${this.position_start.fileName}, `
    result += `line: ${this.position_start.line + 1}, `
    result += `column: ${this.position_start.column + 1}`
    return result
  }
}

class IllegalCharError extends ErrorBase {
  constructor(position_start, position_end, details) {
    super(position_start, position_end, 'Illegal Character', details)
  }
}

export { ErrorBase, IllegalCharError }
