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

class ForNode implements NodeType {
  varNameToken: Token
  startValueNode: NodeType
  endValueNode: NodeType
  bodyNode: NodeType
  stepValueNode?: NodeType

  positionStart: Position
  positionEnd: Position

  constructor(
    varNameToken: Token,
    startValueNode: NodeType,
    endValueNode: NodeType,
    bodyNode: NodeType,
    stepValueNode?: NodeType,
  ) {
    this.varNameToken = varNameToken
    this.startValueNode = startValueNode
    this.endValueNode = endValueNode
    this.bodyNode = bodyNode
    this.stepValueNode = stepValueNode

    this.positionStart = this.varNameToken.positionStart
    this.positionEnd = this.bodyNode.positionEnd
  }

  descr(): string {
    return 'ForNode default descr'
  }
}

class WhileNode implements NodeType {
  conditionNode: NodeType
  bodyNode: NodeType

  positionStart: Position
  positionEnd: Position

  constructor(conditionNode: NodeType, bodyNode: NodeType) {
    this.conditionNode = conditionNode
    this.bodyNode = bodyNode

    this.positionStart = this.conditionNode.positionStart
    this.positionEnd = this.bodyNode.positionEnd
  }

  descr(): string {
    return 'WhileNode default descr'
  }
}

class FunctionDefinitionNode implements NodeType {
  varNameToken?: Token
  argNameTokens: Array<Token>
  bodyNode: NodeType

  positionStart: Position
  positionEnd: Position

  // varNameToken = name of the function
  constructor(
    bodyNode: NodeType,
    argNameTokens: Array<Token> = [],
    varNameToken?: Token,
  ) {
    this.varNameToken = varNameToken
    this.argNameTokens = argNameTokens
    this.bodyNode = bodyNode

    if (this.varNameToken) {
      this.positionStart = this.varNameToken.positionStart
    } else if (this.argNameTokens.length > 0) {
      this.positionStart = this.argNameTokens[0].positionStart
    } else {
      this.positionStart = this.bodyNode.positionStart
    }

    this.positionEnd = this.bodyNode.positionEnd
  }

  descr(): string {
    return 'FunctionDefinitionNode default descr'
  }
}

class CalNode implements NodeType {
  nodeToCall: NodeType
  argNodes: Array<NodeType>

  positionStart: Position
  positionEnd: Position

  constructor(nodeToCall: NodeType, argNodes: Array<NodeType>) {
    this.nodeToCall = nodeToCall
    this.argNodes = argNodes

    this.positionStart = this.nodeToCall.positionStart
    if (this.argNodes.length > 0) {
      this.positionEnd = this.argNodes[this.argNodes.length - 1].positionEnd
    } else {
      this.positionEnd = this.nodeToCall.positionEnd
    }
  }

  descr(): string {
    return 'CalNode default descr'
  }
}

export {
  NumberNode,
  BinaryOperationNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
  IfNode,
  ForNode,
  WhileNode,
  FunctionDefinitionNode,
  CalNode,
}
