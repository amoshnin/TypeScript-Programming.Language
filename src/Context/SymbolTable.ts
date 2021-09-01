import { ValueClass } from '../Interpreter/values'

class SymbolTable {
  symbols = {}
  parent: SymbolTable

  constructor(parent: SymbolTable = null) {
    this.parent = parent
  }

  get(name: string): ValueClass {
    let value = this.symbols[name]
    if (!value && this.parent) {
      return this.parent.get(name)
    }
    return value
  }

  set(name: string, value: ValueClass) {
    this.symbols[name] = value
  }
  remove(name: string) {
    delete this.symbols[name]
  }
}

export { SymbolTable }
