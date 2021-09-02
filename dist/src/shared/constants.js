"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = exports.LETTERS_DIGITS = exports.LETTERS = exports.DIGITS = void 0;
const DIGITS = '0123456789';
exports.DIGITS = DIGITS;
const LETTERS = ascii_letters();
exports.LETTERS = LETTERS;
const LETTERS_DIGITS = LETTERS + DIGITS;
exports.LETTERS_DIGITS = LETTERS_DIGITS;
const KEYWORDS = [
    'VAR',
    'AND',
    'OR',
    'NOT',
    'IF',
    'THEN',
    'ELIF',
    'ELSE',
    'FOR',
    'TO',
    'STEP',
    'WHILE',
    'FUN',
    'END',
];
exports.KEYWORDS = KEYWORDS;
function ascii_letters() {
    const length = 26;
    let i = 65;
    return [...Array(length + 6 + length)]
        .reduce(function (accumulator) {
        return accumulator + String.fromCharCode(i++);
    }, '')
        .match(/[a-zA-Z]+/g)
        .reverse()
        .join('');
}
//# sourceMappingURL=constants.js.map