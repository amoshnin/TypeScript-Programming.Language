"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const lexer_1 = require("./Base/lexer");
const Interpreter_1 = require("./Interpreter");
const Parser_1 = require("./Parser");
const run = (fileName, text) => {
    // Generate tokens
    const lexer = new lexer_1.Lexer(fileName, text);
    const { tokens, error } = lexer.makeTokens();
    if (error)
        return { tokens: null, error };
    // Generate AST (Abstract Syntax Tree)
    let parser = new Parser_1.Parser(tokens);
    let ast = parser.parse();
    if (ast.error)
        return { tokens: null, error };
    // Run progtram
    let interpreter = new Interpreter_1.Interpreter();
    interpreter.visit(ast.node);
    // return { tokens: ast.node.descr(), error: ast.error }
    return { tokens: null, error: null };
};
exports.run = run;
//# sourceMappingURL=app.js.map