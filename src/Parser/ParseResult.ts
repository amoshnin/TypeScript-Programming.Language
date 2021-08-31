import { SomeNodeType } from '.'

class ParseResult {
  error = null
  node = null

  register(result: SomeNodeType): SomeNodeType {
    if (result instanceof ParseResult) {
      if (result.error) {
        this.error = result.error
      }
      return result.node
    }
    return result
  }

  success(node): ParseResult {
    this.node = node
    return this
  }

  failure(error): ParseResult {
    this.error
    return this
  }
}

export { ParseResult }
