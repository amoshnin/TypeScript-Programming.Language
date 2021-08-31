import { Tokens } from '../Base/tokens'
import {
  BinaryOperationNode,
  NodeType,
  NumberNode,
  UnaryOperationNode,
} from '../Parser/nodes'
import { RuntimeError } from '../shared/errors'
import { RuntimeResult } from './RuntimeResult'
import { NumberClass } from './values'

class Interpreter {
  visit(node: NodeType): RuntimeResult {
    // Visit_BinaryOperationNode
    if (node instanceof BinaryOperationNode) {
      return this.visitBinaryOperationNode(node) // => RuntimeResult(NumberClass)
    }
    // Visit_UnaryOperationNode
    if (node instanceof UnaryOperationNode) {
      return this.visitUnaryOperationNode(node) // => RuntimeResult(NumberClass)
    }
    // Visit_NumberNode
    if (node instanceof NumberNode) {
      return this.visitNumberNode(node) // => RuntimeResult(NumberClass)
    }
  }

  visitBinaryOperationNode(node: BinaryOperationNode): RuntimeResult {
    let runtimeResult = new RuntimeResult()
    let left = runtimeResult.register(this.visit(node.leftNode))
    if (runtimeResult.error) return runtimeResult
    let right = runtimeResult.register(this.visit(node.rightNode))
    if (runtimeResult.error) return runtimeResult

    var result: NumberClass = null
    var resultError: RuntimeError = null
    if (node.operationToken.type === Tokens.PLUS) {
      const { number, error } = left.addedTo(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === Tokens.MINUS) {
      const { number, error } = left.subtractedBy(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === Tokens.MUL) {
      const { number, error } = left.multipliedBy(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === Tokens.DIV) {
      const { number, error } = left.dividedBy(right)
      result = number
      resultError = error
    }

    if (resultError) {
      return runtimeResult.failure(resultError)
    } else {
      return runtimeResult.success(
        result.setPosition(node.positionStart, node.positionEnd),
      )
    }
  }

  visitUnaryOperationNode(node: UnaryOperationNode): RuntimeResult {
    let runtimeResult = new RuntimeResult()
    var toChangeNumber = runtimeResult.register(this.visit(node.node))
    if (runtimeResult.error) return runtimeResult

    var resultError: RuntimeError = null
    if (node.operation_token.type === Tokens.MINUS) {
      const { number, error } = toChangeNumber.multipliedBy(new NumberClass(-1))
      toChangeNumber = number
      resultError = error
    }
    if (resultError) {
      return runtimeResult.failure(resultError)
    } else {
      return runtimeResult.success(
        toChangeNumber.setPosition(node.positionStart, node.positionEnd),
      )
    }
  }

  visitNumberNode(node: NumberNode): RuntimeResult {
    return new RuntimeResult().success(
      new NumberClass(Number(node.token.value)).setPosition(
        node.positionStart,
        node.positionEnd,
      ),
    )
  }
}

export { Interpreter }
