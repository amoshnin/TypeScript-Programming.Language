"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    constructor(displayName, parent = null, parentEntryPosition = null) {
        this.symbolTable = null;
        this.displayName = displayName;
        this.parent = parent;
        this.parentEntryPosition = parentEntryPosition;
    }
}
exports.Context = Context;
//# sourceMappingURL=index.js.map