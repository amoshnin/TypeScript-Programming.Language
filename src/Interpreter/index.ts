import {
  BinaryOperationNode,
  NodeType,
  NumberNode,
  UnaryOperationNode,
} from '../Parser/nodes'
import { NumberClass } from './values'

class Interpreter {
  visit(node: NodeType) {
    // Visit_BinaryOperationNode
    if (node instanceof BinaryOperationNode) this.visitBinaryOperationNode(node)
    // Visit_UnaryOperationNode
    if (node instanceof UnaryOperationNode) this.visitUnaryOperationNode(node)
    // Visit_NumberNode
    if (node instanceof NumberNode) this.visitNumberNode(node)
  }

  visitBinaryOperationNode(node: BinaryOperationNode) {
    console.log('Found visitBinaryOperationNode')
    this.visit(node.leftNode)
    this.visit(node.rightNode)
  }

  visitUnaryOperationNode(node: UnaryOperationNode) {
    console.log('Found visitUnaryOperationNode')
    this.visit(node.node)
  }

  visitNumberNode(node: NumberNode) {
    console.log('Found visitNumberNode')
    return new NumberClass(Number(node.token.value)).setPosition(
      node.positionStart,
      node.positionEnd,
    )
  }
}

export { Interpreter }
