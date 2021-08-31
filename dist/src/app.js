"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const Context_1 = require("./Context");
const lexer_1 = require("./Base/lexer");
const Interpreter_1 = require("./Interpreter");
const values_1 = require("./Interpreter/values");
const Parser_1 = require("./Parser");
const symbolTable_1 = require("./Context/symbolTable");
const globalSymbolTable = new symbolTable_1.SymbolTable();
globalSymbolTable.set('null', new values_1.NumberClass(0));
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
    let context = new Context_1.Context('<program>');
    context.symbolTable = globalSymbolTable;
    let interpreterResult = interpreter.visit(astResult.node, context);
    return { result: interpreterResult.value, error: interpreterResult.error };
};
exports.run = run;
//# sourceMappingURL=app.js.map