import { NodeType } from './nodes'

class ParseResult {
  error = null
  node = null
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

  success(node): ParseResult {
    this.node = node
    return this
  }

  failure(error?): ParseResult {
    if (!this.error || this.advanceCount === 0) {
      this.error = error
    }
    return this
  }
}

export { ParseResult }
