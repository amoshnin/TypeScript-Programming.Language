import { Context } from '../Context'
import { Position } from '../Base/position'
import { Display } from '../Types'
import { stringWithArrows } from './Functions'

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
    // result += `\n\n${stringWithArrows(
    //   this.positionStart.fileText,
    //   this.positionStart,
    //   this.positionEnd,
    // )}`
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

class RuntimeError extends ErrorBase implements Display {
  context: Context

  constructor(
    positionStart: Position,
    positionEnd: Position,
    details: string,
    context: Context,
  ) {
    super(positionStart, positionEnd, 'Runtime Error', details)
    this.context = context
  }

  generateTraceback(): string {
    var result = ''
    let position = this.positionStart
    let ctx = this.context

    while (ctx) {
      result = `  File: ${position.fileName}, line: ${String(
        position.line + 1,
      )}, column: ${String(position.column + 1)}, in ${ctx.displayName}\n`
      position = ctx.parentEntryPosition
      ctx = ctx.parent
    }
    return `Traceback (most recent call last):\n${result}`
  }

  override descr(): string {
    var result = this.generateTraceback()
    result += `${this.error_name}: ${this.details}\n`
    // result += `\n\n${stringWithArrows(
    //   this.positionStart.fileText,
    //   this.positionStart,
    //   this.positionEnd,
    // )}`
    return result
  }
}

export { ErrorBase, IllegalCharError, InvalidSyntaxError, RuntimeError }
