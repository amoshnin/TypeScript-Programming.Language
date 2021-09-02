import { Context } from './Context'
import { Lexer } from './Base/lexer'
import { Interpreter } from './Interpreter'
import {
  BuiltInFunctionClass,
  NumberClass,
  ValueClass,
} from './Interpreter/values'
import { Parser } from './Parser'
import { ErrorBase } from './shared/errors'
import { SymbolTable } from './Context/symbolTable'

const globalSymbolTable = new SymbolTable()
globalSymbolTable.set('NULL', NumberClass.null)
globalSymbolTable.set('FALSE', NumberClass.false)
globalSymbolTable.set('TRUE', NumberClass.true)
globalSymbolTable.set('MATH_PI', NumberClass.MathPI)

// Built-in functions
globalSymbolTable.set('PRINT', new BuiltInFunctionClass('print'))
globalSymbolTable.set('IS_NUMBER', new BuiltInFunctionClass('isNumber'))
globalSymbolTable.set('IS_STRING', new BuiltInFunctionClass('isString'))
globalSymbolTable.set('IS_LIST', new BuiltInFunctionClass('isList'))
globalSymbolTable.set('IS_FUNCTION', new BuiltInFunctionClass('isFunction'))
globalSymbolTable.set('APPEND', new BuiltInFunctionClass('append'))
globalSymbolTable.set('POP', new BuiltInFunctionClass('pop'))
globalSymbolTable.set('EXTEND', new BuiltInFunctionClass('extend'))

export const run = (
  fileName: string,
  text: string,
): { result: ValueClass | null; error: ErrorBase | null } => {
  // Generate tokens
  const lexer = new Lexer(fileName, text)
  const lexerResult = lexer.makeTokens()
  if (lexerResult.error) return { result: null, error: lexerResult.error }

  // Generate AST (Abstract Syntax Tree)
  let parser = new Parser(lexerResult.tokens)
  let astResult = parser.parse()
  if (astResult.error) return { result: null, error: astResult.error }

  // Run progtram
  let interpreter = new Interpreter()
  let context = new Context('<program>')
  context.symbolTable = globalSymbolTable
  let interpreterResult = interpreter.visit(astResult.node, context)

  return { result: interpreterResult.value, error: interpreterResult.error }
}
