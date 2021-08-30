import { Lexer } from './components/lexer'

export const run = (fileName: string, text: string) => {
  const lexer = new Lexer(fileName, text)
  const { tokens, error } = lexer.makeTokens()
  return { tokens, error }
}
