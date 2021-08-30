import { Lexer } from './Base/lexer'
import { Parser } from './Parser'

export const run = (fileName: string, text: string) => {
  // Generate tokens
  const lexer = new Lexer(fileName, text)
  const { tokens, error } = lexer.makeTokens()
  if (error) return { tokens: [], error }

  // Generate AST (Abstract Syntax Tree)
  let parser = new Parser(tokens)
  let ast = parser.parse()
  return { tokens: ast, error: null }
}
