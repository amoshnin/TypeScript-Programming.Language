import { Position } from '../Base/position'
import { isNumber } from '../Shared/Functions'
import { Display } from '../Types'

class NumberClass implements Display {
  value: number
  positionStart: Position
  positionEnd: Position

  constructor(value: number) {
    this.value = value
    this.setPosition()
  }

  descr(): string {
    return String(this.value)
  }

  setPosition(positionStart = undefined, positionEnd = undefined) {
    this.positionStart = positionStart
    this.positionEnd = positionEnd
    return this
  }

  addedTo(other: number): number {
    if (isNumber(other)) {
      return Number(this.value + other)
    }
  }

  subtractedBy(other: number): number {
    if (isNumber(other)) {
      return Number(this.value - other)
    }
  }

  multipliedBy(other: number): number {
    if (isNumber(other)) {
      return Number(this.value * other)
    }
  }

  dividedBy(other: number): number {
    if (isNumber(other)) {
      return Number(this.value / other)
    }
  }
}

export { NumberClass }
