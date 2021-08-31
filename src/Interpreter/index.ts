import { Tokens } from '../Base/tokens'
import {
  BinaryOperationNode,
  NodeType,
  NumberNode,
  UnaryOperationNode,
} from '../Parser/nodes'
import { NumberClass } from './values'

class Interpreter {
  visit(node: NodeType): NumberClass | void {
    // Visit_BinaryOperationNode
    if (node instanceof BinaryOperationNode) {
      return this.visitBinaryOperationNode(node) // =>
    }
    // Visit_UnaryOperationNode
    if (node instanceof UnaryOperationNode) {
      return this.visitUnaryOperationNode(node) // =>
    }
    // Visit_NumberNode
    if (node instanceof NumberNode) {
      return this.visitNumberNode(node) // => NumberClass
    }
  }

  visitBinaryOperationNode(node: BinaryOperationNode) {
    console.log('Found visitBinaryOperationNode')
    let left = this.visit(node.leftNode) as NumberClass
    let right = this.visit(node.rightNode) as NumberClass

    var result
    if (node.operationToken.type === Tokens.PLUS) {
      result = left.addedTo(right)
    } else if (node.operationToken.type === Tokens.MINUS) {
      result = left.subtractedBy(right)
    } else if (node.operationToken.type === Tokens.MUL) {
      result = left.multipliedBy(right)
    } else if (node.operationToken.type === Tokens.DIV) {
      result = left.dividedBy(right)
    }

    return result
  }

  visitUnaryOperationNode(node: UnaryOperationNode) {
    console.log('Found visitUnaryOperationNode')
    this.visit(node.node)
  }

  visitNumberNode(node: NumberNode): NumberClass {
    console.log('Found visitNumberNode')
    return new NumberClass(Number(node.token.value)).setPosition(
      node.positionStart,
      node.positionEnd,
    )
  }
}

export { Interpreter }
