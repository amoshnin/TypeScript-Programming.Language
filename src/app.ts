import { Lexer } from './Base/lexer'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'

export const run = (fileName: string, text: string) => {
  // Generate tokens
  const lexer = new Lexer(fileName, text)
  const { tokens, error } = lexer.makeTokens()
  if (error) return { tokens: null, error }

  // Generate AST (Abstract Syntax Tree)
  let parser = new Parser(tokens)
  let ast = parser.parse()
  if (ast.error) return { tokens: null, error }

  // Run progtram
  let interpreter = new Interpreter()
  interpreter.visit(ast.node)

  // return { tokens: ast.node.descr(), error: ast.error }
  return { tokens: null, error: null }
}
