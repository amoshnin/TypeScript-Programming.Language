import { SomeNodeType } from '.'
import { Token } from '../base/tokens'
import { Display } from '../Types'

class NumberNode implements Display {
  token: Token

  constructor(token: Token) {
    this.token = token
  }

  descr(): string {
    return this.token.descr()
  }
}

class BinaryOperationNode implements Display {
  leftNode
  operationToken
  rightNode

  constructor(
    leftNode: SomeNodeType,
    operationToken: Token | undefined,
    rightNode: SomeNodeType,
  ) {
    this.leftNode = leftNode
    this.operationToken = operationToken
    this.rightNode = rightNode
  }

  descr(): string {
    return `(${this.leftNode.descr()}, ${this.operationToken.descr()}, ${this.rightNode.descr()})`
  }
}

class UnaryOperationNode implements Display {
  operation_token
  node

  constructor(operation_token, node) {
    this.operation_token = operation_token
    this.node = node
  }

  descr(): string {
    return `(${this.operation_token}, ${this.node})`
  }
}

export { NumberNode, BinaryOperationNode, UnaryOperationNode }
