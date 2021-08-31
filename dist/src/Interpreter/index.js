"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const nodes_1 = require("../Parser/nodes");
class Interpreter {
    visit(node) {
        // Visit_BinaryOperationNode
        if (node instanceof nodes_1.BinaryOperationNode)
            this.visitBinaryOperationNode(node);
        // Visit_UnaryOperationNode
        if (node instanceof nodes_1.UnaryOperationNode)
            this.visitUnaryOperationNode(node);
        // Visit_NumberNode
        if (node instanceof nodes_1.NumberNode)
            this.visitNumberNode(node);
    }
    visitBinaryOperationNode(node) {
        console.log('Found visitBinaryOperationNode');
        this.visit(node.leftNode);
        this.visit(node.rightNode);
    }
    visitUnaryOperationNode(node) {
        console.log('Found visitUnaryOperationNode');
        this.visit(node.node);
    }
    visitNumberNode(node) {
        console.log('Found visitNumberNode');
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=index.js.map