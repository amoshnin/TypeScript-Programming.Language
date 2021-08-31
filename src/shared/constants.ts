import { TokenType } from '../Base/tokens'

const DIGITS = '0123456789'
const LETTERS = ascii_letters()
const LETTERS_DIGITS = LETTERS + DIGITS

type KeywordType = 'VAR'
const KEYWORDS: Array<KeywordType> = ['VAR']

function ascii_letters() {
  const length = 26
  let i = 65
  return [...Array(length + 6 + length)]
    .reduce(function (accumulator) {
      return accumulator + String.fromCharCode(i++)
    }, '')
    .match(/[a-zA-Z]+/g)
    .reverse()
    .join('')
}

export { DIGITS, LETTERS, LETTERS_DIGITS, KEYWORDS, KeywordType }
