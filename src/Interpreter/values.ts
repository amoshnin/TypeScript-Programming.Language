import { Context } from '../Context'
import { Position } from '../Base/position'
import { RuntimeError } from '../shared/errors'
import { Display } from '../Types'
import { NodeType } from '../Parser/nodes'
import { RuntimeResult } from './RuntimeResult'
import { Interpreter } from '.'
import { SymbolTable } from '../Context/symbolTable'
import { capitalizeFirstLetter, range } from '../shared/Functions'

type ReturnType = { result?: ValueClass; error?: RuntimeError }

// Value Clasess: //
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

class NumberClass extends ValueClass {
  static null = new NumberClass(0)
  static false = new NumberClass(0)
  static true = new NumberClass(1)
  static MathPI = new NumberClass(Math.PI)

  value: number

  constructor(value: number) {
    super()
    this.value = value
  }

  override descr(): string {
    return String(this.value)
  }

  override copy() {
    let copy = new NumberClass(this.value)
    copy.setPosition(this.positionStart, this.positionEnd)
    copy.setContext(this.context)
    return copy
  }

  override addedTo(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value + other.value).setContext(
          this.context,
        ),
      }
    }
  }

  override subtractedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value - other.value).setContext(
          this.context,
        ),
      }
    }
  }

  override multipliedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value * other.value).setContext(
          this.context,
        ),
      }
    }
  }

  override dividedBy(other: NumberClass): ReturnType {
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

  override poweredBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(this.value ** other.value).setContext(
          this.context,
        ),
      }
    }
  }

  override getComparisonEq(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value === other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override getComparisonNe(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value !== other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override getComparisonLt(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value < other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override getComparisonGt(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value > other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override getComparisonLte(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value <= other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override getComparisonGte(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value >= other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override andedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value && other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override oredBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new NumberClass(Number(this.value || other.value)).setContext(
          this.context,
        ),
      }
    }
  }
  override notted(): ReturnType {
    return {
      result: new NumberClass(this.value === 0 ? 1 : 0).setContext(
        this.context,
      ),
    }
  }

  override isTrue(): boolean {
    return this.value !== 0
  }
}

class BaseFunctionClass extends ValueClass {
  name: string = '<anonymous>'

  constructor(name?: string) {
    super()
    if (name) this.name = name
  }

  generateNewContext(): Context {
    let newContext = new Context(this.name, this.context, this.positionStart)
    newContext.symbolTable = new SymbolTable(newContext.parent.symbolTable)
    return newContext
  }

  checkArgs(argNames: Array<string>, args: Array<ValueClass>): RuntimeResult {
    let result = new RuntimeResult()

    if (args.length > argNames.length) {
      return result.failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `${argNames.length - args.length} too many args passed into ${
            this.name
          }`,
          this.context,
        ),
      )
    }

    if (args.length < argNames.length) {
      return result.failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          `${argNames.length - args.length} too few args passed into ${
            this.name
          }`,
          this.context,
        ),
      )
    }

    return result.success(null)
  }

  populateArgs(
    argNames: Array<string>,
    args: Array<ValueClass>,
    executionContext: Context,
  ) {
    for (let i in range(args.length)) {
      let argName = argNames[i]
      let argValue = args[i]
      argValue.setContext(executionContext)
      executionContext.symbolTable.set(argName, argValue)
    }
  }

  checkAndPopulateArgs(
    argNames: Array<string>,
    args: Array<ValueClass>,
    executionContext: Context,
  ) {
    let result = new RuntimeResult()
    result.register(this.checkArgs(argNames, args))
    if (result.error) return result
    this.populateArgs(argNames, args, executionContext)
    return result.success(null)
  }
}

class FunctionClass extends BaseFunctionClass {
  bodyNode: NodeType
  argNames: Array<string>

  constructor(name: string, bodyNode: NodeType, argNames: Array<string>) {
    super(name)
    this.bodyNode = bodyNode
    this.argNames = argNames
  }

  override execute(args: Array<ValueClass>): RuntimeResult {
    let result = new RuntimeResult()
    let interpreter = new Interpreter()
    let executionContext = this.generateNewContext()

    result.register(
      this.checkAndPopulateArgs(this.argNames, args, executionContext),
    )
    if (result.error) return result

    let value = result.register(
      interpreter.visit(this.bodyNode, executionContext),
    )
    if (result.error) return result
    return result.success(value)
  }

  override copy(): FunctionClass {
    let copy = new FunctionClass(this.name, this.bodyNode, this.argNames)
    copy.setContext(this.context)
    copy.setPosition(this.positionStart, this.positionEnd)
    return copy
  }

  override descr(): string {
    return `<function ${this.name}>`
  }
}

type BuilInFunctionType =
  // General functions
  | 'print' // will print out the value
  // Functions for checking types of variables
  | 'isNumber'
  | 'isString'
  | 'isList'
  | 'isFunction'
  // Mutable functions for lists
  | 'append' // add element to the list
  | 'pop' // remove element from the list
  // Immutable functions for lists
  | 'extend' // concatenate two lists together
class BuiltInFunctionClass extends BaseFunctionClass {
  constructor(name: BuilInFunctionType) {
    super(name)
  }

  override copy(): BuiltInFunctionClass {
    let copy = new BuiltInFunctionClass(this.name as BuilInFunctionType)
    copy.setContext(this.context)
    copy.setPosition(this.positionStart, this.positionEnd)
    return copy
  }

  override descr(): string {
    return `<built-in function ${this.name}>`
  }

  override execute(args: Array<ValueClass>): RuntimeResult {
    let result = new RuntimeResult()
    let executionContext = this.generateNewContext()

    let methodName = `execute${capitalizeFirstLetter(this.name)}`
    let method = this[methodName] || this['noVisitMethod']

    result.register(
      this.checkAndPopulateArgs(
        this[`${methodName}ArgNames`],
        args,
        executionContext,
      ),
    )
    if (result.error) return result

    let returnValue = result.register(method(executionContext))
    if (result.error) return result
    return result.success(returnValue)
  }

  noVisitMethod() {
    throw Error(`No execute${capitalizeFirstLetter(this.name)} method defined`)
  }

  // Built-in Functions implementation
  static executePrint = new BuiltInFunctionClass('print')
  executePrintArgNames = ['value']
  executePrint(executionContext: Context) {
    console.log(String(executionContext.symbolTable.get('value').descr()))
    return new RuntimeResult().success(NumberClass.null)
  }

  executeIsNumberArgNames = ['value']
  executeIsNumber(executionContext: Context) {
    let isNumber =
      executionContext.symbolTable.get('value') instanceof NumberClass
    return new RuntimeResult().success(
      isNumber ? NumberClass.true : NumberClass.false,
    )
  }

  executeIsStringArgNames = ['value']
  executeIsString(executionContext: Context) {
    let isString =
      executionContext.symbolTable.get('value') instanceof StringClass
    return new RuntimeResult().success(
      isString ? NumberClass.true : NumberClass.false,
    )
  }

  executeIsListArgNames = ['value']
  executeIsList(executionContext: Context) {
    let isList = executionContext.symbolTable.get('value') instanceof ListClass
    return new RuntimeResult().success(
      isList ? NumberClass.true : NumberClass.false,
    )
  }

  executeIsFunctionArgNames = ['value']
  executeIsFunction(executionContext: Context) {
    let isFunction =
      executionContext.symbolTable.get('value') instanceof BaseFunctionClass
    return new RuntimeResult().success(
      isFunction ? NumberClass.true : NumberClass.false,
    )
  }

  executeAppendArgNames = ['list', 'value']
  executeAppend(executionContext: Context) {
    let list = executionContext.symbolTable.get('list')
    let value = executionContext.symbolTable.get('value')

    if (!(list instanceof ListClass)) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          'First argument must be list',
          executionContext,
        ),
      )
    }

    list.elements.push(value)
    return new RuntimeResult().success(NumberClass.null)
  }

  executePopArgNames = ['list', 'index']
  executePop(executionContext: Context) {
    let list = executionContext.symbolTable.get('list')
    let index = executionContext.symbolTable.get('index')

    if (!(list instanceof ListClass)) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          'First argument must be list',
          executionContext,
        ),
      )
    }

    if (!(index instanceof NumberClass)) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          'Second argument must be number',
          executionContext,
        ),
      )
    }

    var element
    try {
      element = list.elements.splice(index.value, 1)[0]
    } catch {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          'Second argument must be number',
          executionContext,
        ),
      )
    }

    return new RuntimeResult().success(element)
  }

  executeExtendArgNames = ['listA', 'listB']
  executeExtend(executionContext: Context) {
    var listA = executionContext.symbolTable.get('listA')
    let listB = executionContext.symbolTable.get('listB')

    if (!(listA instanceof ListClass)) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          'First argument must be list',
          executionContext,
        ),
      )
    }

    if (!(listB instanceof ListClass)) {
      return new RuntimeResult().failure(
        new RuntimeError(
          this.positionStart,
          this.positionEnd,
          'Second argument must be list',
          executionContext,
        ),
      )
    }

    return new RuntimeResult().success(
      new ListClass(listA.elements.concat(listB.elements)),
    )
  }
}

class StringClass extends ValueClass {
  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  override descr(): string {
    return `"${this.value}"`
  }

  // FUNC: CONCATENATE TWO STRING TOGETHER
  override addedTo(other: ValueClass): ReturnType {
    if (other instanceof StringClass) {
      return {
        result: new StringClass(this.value + other.value).setContext(
          this.context,
        ),
      }
    } else {
      return { error: this.illegalOperation(other) }
    }
  }

  // FUNC: IF MULTIPLY A STRING BY A NUMBER, IT WILL RETURN THAT STRING THAT NUMBER OF TIMES
  override multipliedBy(other: ValueClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        result: new StringClass(this.value.repeat(other.value)).setContext(
          this.context,
        ),
      }
    } else {
      return { error: this.illegalOperation(other) }
    }
  }

  isTrue(): boolean {
    return this.value.length > 0
  }

  override copy(): StringClass {
    let copy = new StringClass(this.value)
    copy.setPosition(this.positionStart, this.positionEnd)
    copy.setContext(this.context)
    return copy
  }
}

class ListClass extends ValueClass {
  elements: Array<NodeType>

  constructor(elements: Array<NodeType>) {
    super()
    this.elements = elements
  }

  override descr(): string {
    return `[${this.elements.map((item) => item.descr()).join(', ')}]`
  }

  override copy(): ListClass {
    let copy = new ListClass(this.elements)
    copy.setPosition(this.positionStart, this.positionEnd)
    copy.setContext(this.context)
    return copy
  }

  override addedTo(other: ValueClass): ReturnType {
    var newList = this.copy()
    newList.elements.push(other)
    return { result: newList }
  }

  override subtractedBy(other: ValueClass): ReturnType {
    if (other instanceof NumberClass) {
      var newList = this.copy()
      if (other.value < newList.elements.length && other.value > 0) {
        delete newList[other.value]
        return { result: newList }
      } else {
        return {
          error: new RuntimeError(
            other.positionStart,
            other.positionEnd,
            'Element at this index could not be removed from list because index is out of bounds',
            this.context,
          ),
        }
      }
    } else {
      return { error: this.illegalOperation(other) }
    }
  }

  override dividedBy(other: ValueClass): ReturnType {
    if (other instanceof NumberClass) {
      if (other.value < this.elements.length && other.value > 0) {
        return { result: this.elements[other.value] as ValueClass } // ERRONEOUS
      } else {
        return {
          error: new RuntimeError(
            other.positionStart,
            other.positionEnd,
            'Element at this index could not be retrieved from list because index is out of bounds',
            this.context,
          ),
        }
      }
    } else {
      return { error: this.illegalOperation(other) }
    }
  }

  override multipliedBy(other: ValueClass): ReturnType {
    if (other instanceof ListClass) {
      var newList = this.copy()
      newList.elements = newList.elements.concat(other.elements)
      return { result: newList }
    } else {
      return { error: this.illegalOperation(other) }
    }
  }
}

export {
  ValueClass,
  StringClass,
  ListClass,
  NumberClass,
  FunctionClass,
  BuiltInFunctionClass,
}
