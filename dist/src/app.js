"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const lexer_1 = require("./components/lexer");
const run = (fileName, text) => {
    const lexer = new lexer_1.Lexer(fileName, text);
    const { tokens, error } = lexer.makeTokens();
    return { tokens, error };
};
exports.run = run;
//# sourceMappingURL=app.js.map