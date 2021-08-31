"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = exports.InvalidSyntaxError = exports.IllegalCharError = exports.ErrorBase = void 0;
class ErrorBase {
    constructor(positionStart, positionEnd, error_name, details) {
        this.positionStart = positionStart;
        this.positionEnd = positionEnd;
        this.error_name = error_name;
        this.details = details;
    }
    descr() {
        var result = `${this.error_name}: ${this.details}\n`;
        result += `File: ${this.positionStart.fileName}, `;
        result += `line: ${this.positionStart.line + 1}, `;
        result += `column: ${this.positionStart.column + 1}`;
        // result += `\n\n${stringWithArrows(
        //   this.positionStart.fileText,
        //   this.positionStart,
        //   this.positionEnd,
        // )}`
        return result;
    }
}
exports.ErrorBase = ErrorBase;
class IllegalCharError extends ErrorBase {
    constructor(positionStart, positionEnd, details) {
        super(positionStart, positionEnd, 'Illegal Character', details);
    }
}
exports.IllegalCharError = IllegalCharError;
class InvalidSyntaxError extends ErrorBase {
    constructor(positionStart, positionEnd, details) {
        super(positionStart, positionEnd, 'Invalid Syntax', details);
    }
}
exports.InvalidSyntaxError = InvalidSyntaxError;
class RuntimeError extends ErrorBase {
    constructor(positionStart, positionEnd, details, context) {
        super(positionStart, positionEnd, 'Runtime Error', details);
        this.context = context;
    }
    generateTraceback() {
        var result = '';
        let position = this.positionStart;
        let ctx = this.context;
        while (ctx) {
            result = `  File: ${position.fileName}, line: ${String(position.line + 1)}, column: ${String(position.column + 1)}, in ${ctx.displayName}\n`;
            position = ctx.parentEntryPosition;
            ctx = ctx.parent;
        }
        return `Traceback (most recent call last):\n${result}`;
    }
    descr() {
        var result = this.generateTraceback();
        result += `${this.error_name}: ${this.details}\n`;
        // result += `\n\n${stringWithArrows(
        //   this.positionStart.fileText,
        //   this.positionStart,
        //   this.positionEnd,
        // )}`
        return result;
    }
}
exports.RuntimeError = RuntimeError;
//# sourceMappingURL=errors.js.map