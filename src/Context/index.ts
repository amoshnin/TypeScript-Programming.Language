import { SymbolTable } from './symbolTable'

class Context {
  displayName: string
  parent
  parentEntryPosition
  symbolTable: SymbolTable = null

  constructor(displayName: string, parent = null, parentEntryPosition = null) {
    this.displayName = displayName
    this.parent = parent
    this.parentEntryPosition = parentEntryPosition
  }
}

export { Context }
