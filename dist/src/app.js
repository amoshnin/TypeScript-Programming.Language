"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const lexer_1 = require("./Base/lexer");
const Interpreter_1 = require("./Interpreter");
const Parser_1 = require("./Parser");
const run = (fileName, text) => {
    // Generate tokens
    const lexer = new lexer_1.Lexer(fileName, text);
    const lexerResult = lexer.makeTokens();
    if (lexerResult.error)
        return { result: null, error: lexerResult.error };
    // Generate AST (Abstract Syntax Tree)
    let parser = new Parser_1.Parser(lexerResult.tokens);
    let astResult = parser.parse();
    if (astResult.error)
        return { result: null, error: astResult.error };
    // Run progtram
    let interpreter = new Interpreter_1.Interpreter();
    let interpreterResult = interpreter.visit(astResult.node);
    return { result: interpreterResult.value, error: interpreterResult.error };
};
exports.run = run;
//# sourceMappingURL=app.js.map