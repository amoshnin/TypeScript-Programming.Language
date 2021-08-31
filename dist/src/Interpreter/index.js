"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const tokens_1 = require("../Base/tokens");
const nodes_1 = require("../Parser/nodes");
const values_1 = require("./values");
class Interpreter {
    visit(node) {
        // Visit_BinaryOperationNode
        if (node instanceof nodes_1.BinaryOperationNode) {
            return this.visitBinaryOperationNode(node); // => NumberClass
        }
        // Visit_UnaryOperationNode
        if (node instanceof nodes_1.UnaryOperationNode) {
            return this.visitUnaryOperationNode(node); // => NumberClass
        }
        // Visit_NumberNode
        if (node instanceof nodes_1.NumberNode) {
            return this.visitNumberNode(node); // => NumberClass
        }
    }
    visitBinaryOperationNode(node) {
        console.log('Found visitBinaryOperationNode');
        let left = this.visit(node.leftNode);
        let right = this.visit(node.rightNode);
        var result;
        if (node.operationToken.type === tokens_1.Tokens.PLUS) {
            result = left.addedTo(right);
        }
        else if (node.operationToken.type === tokens_1.Tokens.MINUS) {
            result = left.subtractedBy(right);
        }
        else if (node.operationToken.type === tokens_1.Tokens.MUL) {
            result = left.multipliedBy(right);
        }
        else if (node.operationToken.type === tokens_1.Tokens.DIV) {
            result = left.dividedBy(right);
        }
        return result.setPosition(node.positionStart, node.positionEnd);
    }
    visitUnaryOperationNode(node) {
        console.log('Found visitUnaryOperationNode');
        var number = this.visit(node.node);
        if (node.operation_token === tokens_1.Tokens.MINUS) {
            number = number.multipliedBy(new values_1.NumberClass(-1));
        }
        return number.setPosition(node.positionStart, node.positionEnd);
    }
    visitNumberNode(node) {
        console.log('Found visitNumberNode');
        return new values_1.NumberClass(Number(node.token.value)).setPosition(node.positionStart, node.positionEnd);
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=index.js.map