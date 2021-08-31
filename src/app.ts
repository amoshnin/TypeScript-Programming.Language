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
  const { tokens, error } = lexer.makeTokens()
  if (error) return { result: null, error }

  // Generate AST (Abstract Syntax Tree)
  let parser = new Parser(tokens)
  let ast = parser.parse()
  if (ast.error) return { result: null, error }

  // Run progtram
  let interpreter = new Interpreter()
  let result = interpreter.visit(ast.node)

  return { result: result, error: null }
}
