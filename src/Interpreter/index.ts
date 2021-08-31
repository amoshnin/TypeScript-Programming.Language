import { Context } from '../Base/context'
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
  visit(node: NodeType, context: Context): RuntimeResult {
    // Visit_BinaryOperationNode
    if (node instanceof BinaryOperationNode) {
      return this.visitBinaryOperationNode(node, context) // => RuntimeResult(NumberClass)
    }
    // Visit_UnaryOperationNode
    if (node instanceof UnaryOperationNode) {
      return this.visitUnaryOperationNode(node, context) // => RuntimeResult(NumberClass)
    }
    // Visit_NumberNode
    if (node instanceof NumberNode) {
      return this.visitNumberNode(node, context) // => RuntimeResult(NumberClass)
    }
  }

  visitBinaryOperationNode(
    node: BinaryOperationNode,
    context: Context,
  ): RuntimeResult {
    let runtimeResult = new RuntimeResult()
    let left = runtimeResult.register(this.visit(node.leftNode, context))
    if (runtimeResult.error) return runtimeResult
    let right = runtimeResult.register(this.visit(node.rightNode, context))
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
    } else if (node.operationToken.type === Tokens.POW) {
      const { number, error } = left.poweredBy(right)
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

  visitUnaryOperationNode(
    node: UnaryOperationNode,
    context: Context,
  ): RuntimeResult {
    let runtimeResult = new RuntimeResult()
    var toChangeNumber = runtimeResult.register(this.visit(node.node, context))
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

  visitNumberNode(node: NumberNode, context: Context): RuntimeResult {
    return new RuntimeResult().success(
      new NumberClass(Number(node.token.value))
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd),
    )
  }
}

export { Interpreter }
