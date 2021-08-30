"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryOperationNode = exports.NumberNode = void 0;
class NumberNode {
    constructor(token) {
        this.token = token;
    }
    descr() {
        return this.token.descr();
    }
}
exports.NumberNode = NumberNode;
class BinaryOperationNode {
    constructor(leftNode, operationToken, rightNode) {
        this.leftNode = leftNode;
        this.operationToken = operationToken;
        this.rightNode = rightNode;
    }
    descr() {
        return `(${this.leftNode}, ${this.operationToken}, ${this.rightNode})`;
    }
}
exports.BinaryOperationNode = BinaryOperationNode;
//# sourceMappingURL=nodes.js.map