"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberClass = void 0;
class NumberClass {
    constructor(value) {
        this.value = value;
        this.setPosition();
    }
    descr() {
        return String(this.value);
    }
    setPosition(positionStart = undefined, positionEnd = undefined) {
        this.positionStart = positionStart;
        this.positionEnd = positionEnd;
        return this;
    }
    addedTo(other) {
        if (other instanceof NumberClass) {
            return new NumberClass(this.value + other.value);
        }
    }
    subtractedBy(other) {
        if (other instanceof NumberClass) {
            return new NumberClass(this.value - other.value);
        }
    }
    multipliedBy(other) {
        if (other instanceof NumberClass) {
            return new NumberClass(this.value * other.value);
        }
    }
    dividedBy(other) {
        if (other instanceof NumberClass) {
            return new NumberClass(this.value / other.value);
        }
    }
}
exports.NumberClass = NumberClass;
//# sourceMappingURL=values.js.map