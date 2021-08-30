"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalCharError = exports.ErrorBase = void 0;
class ErrorBase {
    constructor(position_start, position_end, error_name, details) {
        this.position_start = position_start;
        this.position_end = position_end;
        this.error_name = error_name;
        this.details = details;
    }
    descr() {
        var result = `${this.error_name}: ${this.details}\n`;
        result += `File: ${this.position_start.fileName}, `;
        result += `line: ${this.position_start.line + 1}, `;
        result += `column: ${this.position_start.column + 1}`;
        return result;
    }
}
exports.ErrorBase = ErrorBase;
class IllegalCharError extends ErrorBase {
    constructor(position_start, position_end, details) {
        super(position_start, position_end, 'Illegal Character', details);
    }
}
exports.IllegalCharError = IllegalCharError;
//# sourceMappingURL=errors.js.map