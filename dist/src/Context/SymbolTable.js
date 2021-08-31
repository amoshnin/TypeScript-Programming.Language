"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTable = void 0;
class SymbolTable {
    constructor() {
        this.symbols = {};
        this.parent = null;
    }
    get(name) {
        let value = this.symbols[name];
        if (!value && this.parent) {
            return this.parent.get(name);
        }
        return value;
    }
    set(name, value) {
        this.symbols[name] = value;
    }
    remove(name) {
        delete this.symbols[name];
    }
}
exports.SymbolTable = SymbolTable;
//# sourceMappingURL=symbolTable.js.map