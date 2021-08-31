import { Lexer } from './Base/lexer'
import { Interpreter } from './Interpreter'
import { NumberClass } from './Interpreter/values'
import { Parser } from './Parser'
import { ErrorBase } from './shared/errors'

export const run = (
  fileName: string,
  text: string,
): { result: NumberClass | null; error: ErrorBase | null } => {
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
  let interpreterResult = interpreter.visit(astResult.node)

  return { result: interpreterResult.value, error: interpreterResult.error }
}
