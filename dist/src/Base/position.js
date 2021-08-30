"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
class Position {
    constructor(index, line, column, fileName, fileText) {
        this.index = index;
        this.line = line;
        this.column = column;
        this.fileName = fileName;
        this.fileText = fileText;
    }
    advance(currentChar) {
        this.index += 1;
        this.column += 1;
        if (currentChar === '\n') {
            this.line += 1;
            this.column = 0;
        }
    }
    copy() {
        return new Position(this.index, this.line, this.column, this.fileName, this.fileText);
    }
}
exports.Position = Position;
//# sourceMappingURL=position.js.map