export class Position {
  index: number
  line: number
  column: number
  fileName: string
  fileText: string

  constructor(
    index: number,
    line: number,
    column: number,
    fileName: string,
    fileText: string,
  ) {
    this.index = index
    this.line = line
    this.column = column
    this.fileName = fileName
    this.fileText = fileText
  }

  advance(currentChar?: string) {
    this.index += 1
    this.column += 1

    if (currentChar === '\n') {
      this.line += 1
      this.column = 0
    }
  }

  copy() {
    return new Position(
      this.index,
      this.line,
      this.column,
      this.fileName,
      this.fileText,
    )
  }
}
