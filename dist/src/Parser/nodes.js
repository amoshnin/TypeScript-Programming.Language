"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfNode = exports.VarAssignNode = exports.VarAccessNode = exports.UnaryOperationNode = exports.BinaryOperationNode = exports.NumberNode = void 0;
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
class VarAccessNode {
    constructor(varNameToken) {
        this.varNameToken = varNameToken;
        this.positionStart = this.varNameToken.positionStart;
        this.positionEnd = this.varNameToken.positionEnd;
    }
    descr() {
        return 'VarAccessNode default descr';
    }
}
exports.VarAccessNode = VarAccessNode;
class VarAssignNode {
    constructor(varNameToken, valueNode) {
        this.varNameToken = varNameToken;
        this.valueNode = valueNode;
        this.positionStart = this.varNameToken.positionStart;
        this.positionEnd = this.valueNode.positionEnd;
    }
    descr() {
        return 'VarAssignNode default descr';
    }
}
exports.VarAssignNode = VarAssignNode;
class IfNode {
    constructor(cases, elseCase) {
        this.cases = cases;
        this.elseCase = elseCase;
        this.positionStart = this.cases[0].expr.positionStart;
        this.positionEnd = this.elseCase
            ? this.elseCase.positionEnd
            : this.cases[this.cases.length - 1].expr.positionEnd;
    }
    descr() {
        return 'IfExpressionCase default descr';
    }
}
exports.IfNode = IfNode;
//# sourceMappingURL=nodes.js.map