import { RuntimeError } from '../shared/errors'
import { NumberClass } from './values'

class RuntimeResult {
  value: NumberClass = undefined
  error: RuntimeError = undefined

  register(result): NumberClass {
    if (result.error) {
      this.error = result.error
    }
    return result.value
  }

  success(value: NumberClass): RuntimeResult {
    this.value = value
    return this
  }

  failure(error: RuntimeError): RuntimeResult {
    this.error = error
    return this
  }
}

export { RuntimeResult }
