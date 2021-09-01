"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallNode = exports.FunctionDefinitionNode = exports.WhileNode = exports.ForNode = exports.IfNode = exports.VarAssignNode = exports.VarAccessNode = exports.UnaryOperationNode = exports.BinaryOperationNode = exports.NumberNode = void 0;
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
class ForNode {
    constructor(varNameToken, startValueNode, endValueNode, bodyNode, stepValueNode) {
        this.varNameToken = varNameToken;
        this.startValueNode = startValueNode;
        this.endValueNode = endValueNode;
        this.bodyNode = bodyNode;
        this.stepValueNode = stepValueNode;
        this.positionStart = this.varNameToken.positionStart;
        this.positionEnd = this.bodyNode.positionEnd;
    }
    descr() {
        return 'ForNode default descr';
    }
}
exports.ForNode = ForNode;
class WhileNode {
    constructor(conditionNode, bodyNode) {
        this.conditionNode = conditionNode;
        this.bodyNode = bodyNode;
        this.positionStart = this.conditionNode.positionStart;
        this.positionEnd = this.bodyNode.positionEnd;
    }
    descr() {
        return 'WhileNode default descr';
    }
}
exports.WhileNode = WhileNode;
class FunctionDefinitionNode {
    // varNameToken = name of the function
    constructor(bodyNode, argNameTokens = [], varNameToken) {
        this.varNameToken = varNameToken;
        this.argNameTokens = argNameTokens;
        this.bodyNode = bodyNode;
        if (this.varNameToken) {
            this.positionStart = this.varNameToken.positionStart;
        }
        else if (this.argNameTokens.length > 0) {
            this.positionStart = this.argNameTokens[0].positionStart;
        }
        else {
            this.positionStart = this.bodyNode.positionStart;
        }
        this.positionEnd = this.bodyNode.positionEnd;
    }
    descr() {
        return 'FunctionDefinitionNode default descr';
    }
}
exports.FunctionDefinitionNode = FunctionDefinitionNode;
class CallNode {
    constructor(nodeToCall, argNodes) {
        this.nodeToCall = nodeToCall;
        this.argNodes = argNodes;
        this.positionStart = this.nodeToCall.positionStart;
        if (this.argNodes.length > 0) {
            this.positionEnd = this.argNodes[this.argNodes.length - 1].positionEnd;
        }
        else {
            this.positionEnd = this.nodeToCall.positionEnd;
        }
    }
    descr() {
        return 'CallNode default descr';
    }
}
exports.CallNode = CallNode;
//# sourceMappingURL=nodes.js.map