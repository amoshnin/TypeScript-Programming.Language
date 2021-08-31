"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberClass = void 0;
const errors_1 = require("../shared/errors");
class NumberClass {
    constructor(value) {
        this.value = value;
        this.setContext();
        this.setPosition();
    }
    descr() {
        return String(this.value);
    }
    setContext(context = null) {
        this.context = context;
        return this;
    }
    setPosition(positionStart = undefined, positionEnd = undefined) {
        this.positionStart = positionStart;
        this.positionEnd = positionEnd;
        return this;
    }
    addedTo(other) {
        if (other instanceof NumberClass) {
            return {
                number: new NumberClass(this.value + other.value).setContext(this.context),
                error: null,
            };
        }
    }
    subtractedBy(other) {
        if (other instanceof NumberClass) {
            return {
                number: new NumberClass(this.value - other.value).setContext(this.context),
                error: null,
            };
        }
    }
    multipliedBy(other) {
        if (other instanceof NumberClass) {
            return {
                number: new NumberClass(this.value * other.value).setContext(this.context),
                error: null,
            };
        }
    }
    dividedBy(other) {
        if (other instanceof NumberClass) {
            if (other.value === 0) {
                return {
                    number: null,
                    error: new errors_1.RuntimeError(other.positionStart, other.positionEnd, 'Division by zero', this.context),
                };
            }
            else {
                return {
                    number: new NumberClass(this.value / other.value).setContext(this.context),
                    error: null,
                };
            }
        }
    }
}
exports.NumberClass = NumberClass;
//# sourceMappingURL=values.js.map