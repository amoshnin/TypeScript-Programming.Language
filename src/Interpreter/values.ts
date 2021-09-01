import { Context } from '../Context'
import { Position } from '../Base/position'
import { RuntimeError } from '../shared/errors'
import { Display } from '../Types'
import { NodeType } from '../Parser/nodes'
import { RuntimeResult } from './RuntimeResult'
import { Interpreter } from '.'
import { SymbolTable } from '../Context/symbolTable'
import { range } from '../shared/Functions'

class ValueClass implements Display {
  context: Context
  positionStart: Position
  positionEnd: Position

  constructor() {
    this.setContext()
    this.setPosition()
  }

  descr(): string {
    return 'ValueClass descr'
  }

  setContext(context: Context = null) {
    this.context = context
    return this
  }

  setPosition(positionStart = undefined, positionEnd = undefined) {
    this.positionStart = positionStart
    this.positionEnd = positionEnd
    return this
  }

  copy(): ValueClass {
    throw new Error('No copy method defined')
  }

  addedTo(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  subtractedBy(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  multipliedBy(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  dividedBy(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  poweredBy(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  getComparisonEq(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  getComparisonNe(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  getComparisonLt(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }
  getComparisonGt(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }
  getComparisonLte(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  getComparisonGte(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }

  andedBy(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }
  oredBy(other: ValueClass): ReturnType {
    return { error: this.illegalOperation(other) }
  }
  notted(): ReturnType {
    return { error: this.illegalOperation() }
  }

  isTrue(): boolean {
    return false
  }

  execute(args: Array<ValueClass>): RuntimeResult {
    return new RuntimeResult().failure(this.illegalOperation())
  }

  illegalOperation(other?: ValueClass): RuntimeError {
    if (!other) {
      other = this
    }
    return new RuntimeError(
      this.positionStart,
      this.positionEnd,
      'Illegal operation',
      this.context,
    )
  }
}

type ReturnType = { result?: ValueClass; error?: RuntimeError }
class NumberClass extends ValueClass implements Display {
  value: number

  constructor(value: number) {
    super()
    this.value = value
  }

  descr(): string {
    return String(this.value)
  }

  copy() {
    let copy = new NumberClass(this.value)
    copy.setPosition(this.positionStart, this.positionEnd)
    copy.setContext(this.context)
    return copy
  }

  addedTo(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value + other.value).setContext(
          this.context,
        ),
      }
    }
  }

  subtractedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value - other.value).setContext(
          this.context,
        ),
      }
    }
  }

  multipliedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value * other.value).setContext(
          this.context,
        ),
      }
    }
  }

  dividedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      if (other.value === 0) {
        return {
          error: new RuntimeError(
            other.positionStart,
            other.positionEnd,
            'Division by zero',
            this.context,
          ),
        }
      } else {
        return {
          result: new NumberClass(this.value / other.value).setContext(
            this.context,
          ),
        }
      }
    }
  }

  poweredBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value ** other.value).setContext(
          this.context,
        ),
      }
    }
  }

  getComparisonEq(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value === other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  getComparisonNe(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value !== other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  getComparisonLt(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value < other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  getComparisonGt(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value > other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  getComparisonLte(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value <= other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  getComparisonGte(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value >= other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  andedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value && other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  oredBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value || other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  notted(): ReturnType {
    return {
      result: new NumberClass(this.value === 0 ? 1 : 0).setContext(
        this.context,
      ),
    }
  }

  isTrue(): boolean {
    return this.value !== 0
  }
}

class FunctionClass extends ValueClass implements Display {
  name: string = '<anonymous>'
  bodyNode: NodeType
  argNames: Array<string>

  constructor(name: string, bodyNode: NodeType, argNames: Array<string>) {
    super()
    if (name) this.name = name
    this.bodyNode = bodyNode
    this.argNames = argNames
  }

  execute(args: Array<ValueClass>): RuntimeResult {
    let result = new RuntimeResult()
    let interpreter = new Interpreter()
    let newContext = new Context(this.name, this.context, this.positionStart)
    newContext.symbolTable = new SymbolTable(newContext.parent.symbolTable)

    if (args.length > this.argNames.length) {
      return result.failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `${this.argNames.length - args.length} too many args passed into ${
            this.name
          }`,
          this.context,
        ),
      )
    }

    if (args.length < this.argNames.length) {
      return result.failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `${this.argNames.length - args.length} too few args passed into ${
            this.name
          }`,
          this.context,
        ),
      )
    }

    for (let i in range(args.length)) {
      let argName = this.argNames[i]
      let argValue = args[i]
      argValue.setContext(newContext)
      newContext.symbolTable.set(argName, argValue)
    }

    let value = result.register(interpreter.visit(this.bodyNode, newContext))
    if (result.error) return result
    return result.success(value)
  }

  copy() {
    let copy = new FunctionClass(this.name, this.bodyNode, this.argNames)
    copy.setContext(this.context)
    copy.setPosition(this.positionStart, this.positionEnd)
    return copy
  }

  descr(): string {
    return `function ${this.name}`
  }
}

export { ValueClass, NumberClass, FunctionClass }
