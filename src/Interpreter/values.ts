import { Position } from '../Base/position'
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

  addedTo(other: NumberClass): NumberClass {
    if (other instanceof NumberClass) {
      return new NumberClass(this.value + other.value)
    }
  }

  subtractedBy(other: NumberClass): NumberClass {
    if (other instanceof NumberClass) {
      return new NumberClass(this.value - other.value)
    }
  }

  multipliedBy(other: NumberClass): NumberClass {
    if (other instanceof NumberClass) {
      return new NumberClass(this.value * other.value)
    }
  }

  dividedBy(other: NumberClass): NumberClass {
    if (other instanceof NumberClass) {
      return new NumberClass(this.value / other.value)
    }
  }
}

export { NumberClass }
