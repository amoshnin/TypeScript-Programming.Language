import { Position } from '../Base/position'
import { RuntimeError } from '../shared/errors'
import { Display } from '../Types'

type ReturnType = { number: NumberClass | null; error: RuntimeError | null }
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

  addedTo(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return { number: new NumberClass(this.value + other.value), error: null }
    }
  }

  subtractedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return { number: new NumberClass(this.value - other.value), error: null }
    }
  }

  multipliedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return { number: new NumberClass(this.value * other.value), error: null }
    }
  }

  dividedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      if (other.value === 0) {
        return {
          number: null,
          error: new RuntimeError(
            other.positionStart,
            other.positionEnd,
            'Division by zero',
          ),
        }
      } else {
        return {
          number: new NumberClass(this.value / other.value),
          error: null,
        }
      }
    }
  }
}

export { NumberClass }
