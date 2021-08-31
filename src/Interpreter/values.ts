import { Context } from '../Context'
import { Position } from '../Base/position'
import { RuntimeError } from '../shared/errors'
import { Display } from '../Types'

type ReturnType = { number: NumberClass | null; error: RuntimeError | null }
class NumberClass implements Display {
  value: number
  context: Context
  positionStart: Position
  positionEnd: Position

  constructor(value: number) {
    this.value = value
    this.setContext()
    this.setPosition()
  }

  descr(): string {
    return String(this.value)
  }

  copy() {
    let copy = new NumberClass(this.value)
    copy.setPosition(this.positionStart, this.positionEnd)
    copy.setContext(this.context)
    return copy
  }

  setContext(context: Context = null): NumberClass {
    this.context = context
    return this
  }

  setPosition(positionStart = undefined, positionEnd = undefined) {
    this.positionStart = positionStart
    this.positionEnd = positionEnd
    return this
  }

  addedTo(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        number: new NumberClass(this.value + other.value).setContext(
          this.context,
        ),
        error: null,
      }
    }
  }

  subtractedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        number: new NumberClass(this.value - other.value).setContext(
          this.context,
        ),
        error: null,
      }
    }
  }

  multipliedBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        number: new NumberClass(this.value * other.value).setContext(
          this.context,
        ),
        error: null,
      }
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
            this.context,
          ),
        }
      } else {
        return {
          number: new NumberClass(this.value / other.value).setContext(
            this.context,
          ),
          error: null,
        }
      }
    }
  }

  poweredBy(other: NumberClass): ReturnType {
    if (other instanceof NumberClass) {
      return {
        number: new NumberClass(this.value ** other.value).setContext(
          this.context,
        ),
        error: null,
      }
    }
  }
}

export { NumberClass }
