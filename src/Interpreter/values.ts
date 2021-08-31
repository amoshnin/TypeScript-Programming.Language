import { Position } from '../Base/position'

class NumberClass {
  value: number
  positionStart: Position
  positionEnd: Position

  constructor(value: number) {
    this.value = value
    this.setPosition()
  }

  setPosition(positionStart = undefined, positionEnd = undefined) {
    this.positionStart = positionStart
    this.positionEnd = positionEnd
    return this
  }
}

export { NumberClass }
