import { NumberClass } from '../Interpreter/values'

class SymbolTable {
  symbols = {}
  parent: SymbolTable = null

  get(name: string): NumberClass {
    let value = this.symbols[name]
    if (!value && this.parent) {
      return this.parent.get(name)
    }
    return value
  }

  set(name: string, value: NumberClass) {
    this.symbols[name] = value
  }
  remove(name: string) {
    delete this.symbols[name]
  }
}

export { SymbolTable }
