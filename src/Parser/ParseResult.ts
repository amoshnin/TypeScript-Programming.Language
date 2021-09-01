import { ErrorBase } from '../shared/errors'
import { NodeType } from './nodes'

class ParseResult {
  error: ErrorBase = null
  node: NodeType = null
  advanceCount = 0

  registerAdvancement() {
    this.advanceCount += 1
  }

  register(result: ParseResult): NodeType {
    this.advanceCount += result.advanceCount
    if (result.error) {
      this.error = result.error
    }
    return result.node
  }

  success(node: NodeType): ParseResult {
    this.node = node
    return this
  }

  failure(error?: ErrorBase): ParseResult {
    if (!this.error || this.advanceCount === 0) {
      this.error = error
    }
    return this
  }
}

export { ParseResult }
