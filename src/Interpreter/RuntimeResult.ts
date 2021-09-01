import { RuntimeError } from '../shared/errors'
import { NumberClass, ValueClass } from './values'

class RuntimeResult {
  value: ValueClass = undefined
  error: RuntimeError = undefined

  register(result): ValueClass {
    if (result.error) {
      this.error = result.error
    }
    return result.value
  }

  success(value: ValueClass): RuntimeResult {
    this.value = value
    return this
  }

  failure(error: RuntimeError): RuntimeResult {
    this.error = error
    return this
  }
}

export { RuntimeResult }
