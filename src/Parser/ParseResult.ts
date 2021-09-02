import { ErrorBase } from '../shared/errors'
import { NodeType } from './nodes'

class ParseResult {
  error: ErrorBase = null
  node: NodeType = null

  lastRegisteredAdvanceCount = 0
  advanceCount = 0
  toReverseCount = 0

  registerAdvancement() {
    this.lastRegisteredAdvanceCount = 1
    this.advanceCount += 1
  }

  register(result: ParseResult): NodeType {
    this.lastRegisteredAdvanceCount = result.advanceCount
    this.advanceCount += result.advanceCount
    if (result.error) this.error = result.error
    return result.node
  }

  try_register(result: ParseResult): NodeType | null {
    if (result.error) {
      this.toReverseCount = result.advanceCount
      return null
    }
    return this.register(result)
  }

  success(node: NodeType): ParseResult {
    this.node = node
    return this
  }

  failure(error?: ErrorBase): ParseResult {
    if (!this.error || this.lastRegisteredAdvanceCount === 0) {
      this.error = error
    }
    return this
  }
}

export { ParseResult }
