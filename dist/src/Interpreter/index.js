"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const nodes_1 = require("../Parser/nodes");
const errors_1 = require("../shared/errors");
const RuntimeResult_1 = require("./RuntimeResult");
const values_1 = require("./values");
class Interpreter {
    visit(node, context) {
        // Visit_BinaryOperationNode
        if (node instanceof nodes_1.BinaryOperationNode) {
            return this.visitBinaryOperationNode(node, context); // => RuntimeResult(NumberClass)
        }
        // Visit_UnaryOperationNode
        if (node instanceof nodes_1.UnaryOperationNode) {
            return this.visitUnaryOperationNode(node, context); // => RuntimeResult(NumberClass)
        }
        // Visit_NumberNode
        if (node instanceof nodes_1.NumberNode) {
            return this.visitNumberNode(node, context); // => RuntimeResult(NumberClass)
        }
        // Visit_VarAccessNode
        if (node instanceof nodes_1.VarAccessNode) {
            return this.visitVarAccessNode(node, context); // => RuntimeResult()
        }
        // Visit_VarAssignNode
        if (node instanceof nodes_1.VarAssignNode) {
            return this.visitVarAssignNode(node, context); // => RuntimeResult()
        }
    }
    visitVarAccessNode(node, context) {
        let result = new RuntimeResult_1.RuntimeResult();
        let varName = node.varNameToken.value;
        var value = context.symbolTable.get(varName);
        if (!value) {
            return result.failure(new errors_1.RuntimeError(node.positionStart, node.positionEnd, `'${varName}' is not defined`, context));
        }
        value = value.copy().setPosition(node.positionStart, node.positionEnd);
        return result.success(value);
    }
    visitVarAssignNode(node, context) {
        let result = new RuntimeResult_1.RuntimeResult();
        let varName = node.varNameToken.value;
        let value = result.register(this.visit(node.valueNode, context));
        if (result.error)
            return result;
        context.symbolTable.set(varName, value);
        return result.success(value);
    }
    visitBinaryOperationNode(node, context) {
        let runtimeResult = new RuntimeResult_1.RuntimeResult();
        let left = runtimeResult.register(this.visit(node.leftNode, context));
        if (runtimeResult.error)
            return runtimeResult;
        let right = runtimeResult.register(this.visit(node.rightNode, context));
        if (runtimeResult.error)
            return runtimeResult;
        var result = null;
        var resultError = null;
        if (node.operationToken.type === 'PLUS') {
            const { number, error } = left.addedTo(right);
            result = number;
            resultError = error;
        }
        else if (node.operationToken.type === 'MINUS') {
            const { number, error } = left.subtractedBy(right);
            result = number;
            resultError = error;
        }
        else if (node.operationToken.type === 'MUL') {
            const { number, error } = left.multipliedBy(right);
            result = number;
            resultError = error;
        }
        else if (node.operationToken.type === 'DIV') {
            const { number, error } = left.dividedBy(right);
            result = number;
            resultError = error;
        }
        else if (node.operationToken.type === 'POW') {
            const { number, error } = left.poweredBy(right);
            result = number;
            resultError = error;
        }
        if (resultError) {
            return runtimeResult.failure(resultError);
        }
        else {
            return runtimeResult.success(result.setPosition(node.positionStart, node.positionEnd));
        }
    }
    visitUnaryOperationNode(node, context) {
        let runtimeResult = new RuntimeResult_1.RuntimeResult();
        var toChangeNumber = runtimeResult.register(this.visit(node.node, context));
        if (runtimeResult.error)
            return runtimeResult;
        var resultError = null;
        if (node.operation_token.type === 'MINUS') {
            const { number, error } = toChangeNumber.multipliedBy(new values_1.NumberClass(-1));
            toChangeNumber = number;
            resultError = error;
        }
        if (resultError) {
            return runtimeResult.failure(resultError);
        }
        else {
            return runtimeResult.success(toChangeNumber.setPosition(node.positionStart, node.positionEnd));
        }
    }
    visitNumberNode(node, context) {
        return new RuntimeResult_1.RuntimeResult().success(new values_1.NumberClass(Number(node.token.value))
            .setContext(context)
            .setPosition(node.positionStart, node.positionEnd));
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=index.js.map