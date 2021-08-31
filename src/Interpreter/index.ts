import { Tokens } from '../Base/tokens'
import {
  BinaryOperationNode,
  NodeType,
  NumberNode,
  UnaryOperationNode,
} from '../Parser/nodes'
import { NumberClass } from './values'

class Interpreter {
  visit(node: NodeType): NumberClass {
    // Visit_BinaryOperationNode
    if (node instanceof BinaryOperationNode) {
      return this.visitBinaryOperationNode(node) // => NumberClass
    }
    // Visit_UnaryOperationNode
    if (node instanceof UnaryOperationNode) {
      return this.visitUnaryOperationNode(node) // => NumberClass
    }
    // Visit_NumberNode
    if (node instanceof NumberNode) {
      return this.visitNumberNode(node) // => NumberClass
    }
  }

  visitBinaryOperationNode(node: BinaryOperationNode): NumberClass {
    let left = this.visit(node.leftNode) as NumberClass
    let right = this.visit(node.rightNode) as NumberClass

    var result: NumberClass
    if (node.operationToken.type === Tokens.PLUS) {
      result = left.addedTo(right)
    } else if (node.operationToken.type === Tokens.MINUS) {
      result = left.subtractedBy(right)
    } else if (node.operationToken.type === Tokens.MUL) {
      result = left.multipliedBy(right)
    } else if (node.operationToken.type === Tokens.DIV) {
      result = left.dividedBy(right)
    }

    return result.setPosition(node.positionStart, node.positionEnd)
  }

  visitUnaryOperationNode(node: UnaryOperationNode): NumberClass {
    var number = this.visit(node.node) as NumberClass
    if (node.operation_token === Tokens.MINUS) {
      number = number.multipliedBy(new NumberClass(-1))
    }
    return number.setPosition(node.positionStart, node.positionEnd)
  }

  visitNumberNode(node: NumberNode): NumberClass {
    return new NumberClass(Number(node.token.value)).setPosition(
      node.positionStart,
      node.positionEnd,
    )
  }
}

export { Interpreter }
