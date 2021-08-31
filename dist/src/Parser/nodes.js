"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryOperationNode = exports.BinaryOperationNode = exports.NumberNode = void 0;
class NumberNode {
    constructor(token) {
        this.token = token;
        this.positionStart = this.token.positionStart;
        this.positionEnd = this.token.positionEnd;
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
        this.positionStart = this.leftNode.positionStart;
        this.positionEnd = this.rightNode.positionEnd;
    }
    descr() {
        return `(${this.leftNode.descr()}, ${this.operationToken.descr()}, ${this.rightNode.descr()})`;
    }
}
exports.BinaryOperationNode = BinaryOperationNode;
class UnaryOperationNode {
    constructor(operation_token, node) {
        this.operation_token = operation_token;
        this.node = node;
        this.positionStart = this.operation_token.positionStart;
        this.positionEnd = this.node.positionEnd;
    }
    descr() {
        return `(${this.operation_token}, ${this.node})`;
    }
}
exports.UnaryOperationNode = UnaryOperationNode;
//# sourceMappingURL=nodes.js.map