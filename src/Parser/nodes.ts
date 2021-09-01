import { Position } from '../Base/position'
import { Token } from '../base/tokens'
import { Display } from '../Types'

export interface NodeType extends Display {
  positionStart: Position
  positionEnd: Position
}
class NumberNode implements NodeType {
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

class BinaryOperationNode implements NodeType {
  leftNode: NodeType
  operationToken: Token
  rightNode: NodeType

  positionStart: Position
  positionEnd: Position

  constructor(
    leftNode: NodeType,
    operationToken: Token | undefined,
    rightNode: NodeType,
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

class UnaryOperationNode implements NodeType {
  operation_token: Token
  node: NodeType

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

  descr(): string {
    return 'VarAccessNode default descr'
  }
}

class VarAssignNode implements NodeType {
  varNameToken: Token
  valueNode: NodeType

  positionStart: Position
  positionEnd: Position
  constructor(varNameToken: Token, valueNode: NodeType) {
    this.varNameToken = varNameToken
    this.valueNode = valueNode

    this.positionStart = this.varNameToken.positionStart
    this.positionEnd = this.valueNode.positionEnd
  }

  descr(): string {
    return 'VarAssignNode default descr'
  }
}

export type IfExpressionCase = { condition: NodeType; expr: NodeType }
class IfNode implements NodeType {
  cases: Array<IfExpressionCase>
  elseCase: NodeType

  positionStart: Position
  positionEnd: Position

  constructor(cases: Array<IfExpressionCase>, elseCase?: NodeType) {
    this.cases = cases
    this.elseCase = elseCase

    this.positionStart = this.cases[0].expr.positionStart
    this.positionEnd = this.elseCase
      ? this.elseCase.positionEnd
      : this.cases[this.cases.length - 1].expr.positionEnd
  }

  descr(): string {
    return 'IfExpressionCase default descr'
  }
}

export {
  NumberNode,
  BinaryOperationNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
  IfNode,
}
