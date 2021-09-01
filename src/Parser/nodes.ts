import { SomeNodeType } from '.'
import { Position } from '../Base/position'
import { Token } from '../base/tokens'
import { Display } from '../Types'

export interface NodeType {}
class NumberNode implements Display, NodeType {
  token: Token
  positionStart: Position
  positionEnd: Position

  constructor(token: Token) {
    this.token = token

    this.positionStart = this.token.positionStart
    this.positionEnd = this.token.positionEnd
  }

  descr(): string {
    return this.token.descr()
  }
}

class BinaryOperationNode implements Display, NodeType {
  leftNode
  operationToken: Token
  rightNode

  positionStart: Position
  positionEnd: Position

  constructor(
    leftNode: SomeNodeType,
    operationToken: Token | undefined,
    rightNode: SomeNodeType,
  ) {
    this.leftNode = leftNode
    this.operationToken = operationToken
    this.rightNode = rightNode

    this.positionStart = this.leftNode.positionStart
    this.positionEnd = this.rightNode.positionEnd
  }

  descr(): string {
    return `(${this.leftNode.descr()}, ${this.operationToken.descr()}, ${this.rightNode.descr()})`
  }
}

class UnaryOperationNode implements Display, NodeType {
  operation_token: Token
  node

  positionStart: Position
  positionEnd: Position

  constructor(operation_token, node) {
    this.operation_token = operation_token
    this.node = node

    this.positionStart = this.operation_token.positionStart
    this.positionEnd = this.node.positionEnd
  }

  descr(): string {
    return `(${this.operation_token}, ${this.node})`
  }
}

class VarAccessNode implements NodeType {
  varNameToken: Token

  positionStart: Position
  positionEnd: Position

  constructor(varNameToken: Token) {
    this.varNameToken = varNameToken
    this.positionStart = this.varNameToken.positionStart
    this.positionEnd = this.varNameToken.positionEnd
  }
}

class VarAssignNode implements NodeType {
  varNameToken: Token
  valueNode

  positionStart: Position
  positionEnd: Position
  constructor(varNameToken: Token, valueNode) {
    this.varNameToken = varNameToken
    this.valueNode = valueNode

    this.positionStart = this.varNameToken.positionStart
    this.positionEnd = this.valueNode.positionEnd
  }
}

export {
  NumberNode,
  BinaryOperationNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
}
