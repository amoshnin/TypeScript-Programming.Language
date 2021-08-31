'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.InvalidSyntaxError =
  exports.IllegalCharError =
  exports.ErrorBase =
    void 0
class ErrorBase {
  constructor(positionStart, positionEnd, error_name, details) {
    this.positionStart = positionStart
    this.positionEnd = positionEnd
    this.error_name = error_name
    this.details = details
  }
  descr() {
    var result = `${this.error_name}: ${this.details}\n`
    result += `File: ${this.positionStart.fileName}, `
    result += `line: ${this.positionStart.line + 1}, `
    result += `column: ${this.positionStart.column + 1}`
    return result
  }
}
exports.ErrorBase = ErrorBase
class IllegalCharError extends ErrorBase {
  constructor(positionStart, positionEnd, details) {
    super(positionStart, positionEnd, 'Illegal Character', details)
  }
}
exports.IllegalCharError = IllegalCharError
class InvalidSyntaxError extends ErrorBase {
  constructor(positionStart, positionEnd, details) {
    super(positionStart, positionEnd, 'Invalid Syntax', details)
  }
}
exports.InvalidSyntaxError = InvalidSyntaxError
//# sourceMappingURL=errors.js.map
