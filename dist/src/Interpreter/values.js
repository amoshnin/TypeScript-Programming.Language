"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionClass = exports.NumberClass = exports.ValueClass = void 0;
const Context_1 = require("../Context");
const errors_1 = require("../shared/errors");
const RuntimeResult_1 = require("./RuntimeResult");
const _1 = require(".");
const symbolTable_1 = require("../Context/symbolTable");
const Functions_1 = require("../shared/Functions");
class ValueClass {
    constructor() {
        this.setContext();
        this.setPosition();
    }
    descr() {
        return 'ValueClass descr';
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
    copy() {
        throw new Error('No copy method defined');
    }
    addedTo(other) {
        return { error: this.illegalOperation(other) };
    }
    subtractedBy(other) {
        return { error: this.illegalOperation(other) };
    }
    multipliedBy(other) {
        return { error: this.illegalOperation(other) };
    }
    dividedBy(other) {
        return { error: this.illegalOperation(other) };
    }
    poweredBy(other) {
        return { error: this.illegalOperation(other) };
    }
    getComparisonEq(other) {
        return { error: this.illegalOperation(other) };
    }
    getComparisonNe(other) {
        return { error: this.illegalOperation(other) };
    }
    getComparisonLt(other) {
        return { error: this.illegalOperation(other) };
    }
    getComparisonGt(other) {
        return { error: this.illegalOperation(other) };
    }
    getComparisonLte(other) {
        return { error: this.illegalOperation(other) };
    }
    getComparisonGte(other) {
        return { error: this.illegalOperation(other) };
    }
    andedBy(other) {
        return { error: this.illegalOperation(other) };
    }
    oredBy(other) {
        return { error: this.illegalOperation(other) };
    }
    notted() {
        return { error: this.illegalOperation() };
    }
    isTrue() {
        return false;
    }
    execute(args) {
        return new RuntimeResult_1.RuntimeResult().failure(this.illegalOperation());
    }
    illegalOperation(other) {
        if (!other) {
            other = this;
        }
        return new errors_1.RuntimeError(this.positionStart, this.positionEnd, 'Illegal operation', this.context);
    }
}
exports.ValueClass = ValueClass;
class NumberClass extends ValueClass {
    constructor(value) {
        super();
        this.value = value;
    }
    descr() {
        return String(this.value);
    }
    copy() {
        let copy = new NumberClass(this.value);
        copy.setPosition(this.positionStart, this.positionEnd);
        copy.setContext(this.context);
        return copy;
    }
    addedTo(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(this.value + other.value).setContext(this.context),
            };
        }
    }
    subtractedBy(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(this.value - other.value).setContext(this.context),
            };
        }
    }
    multipliedBy(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(this.value * other.value).setContext(this.context),
            };
        }
    }
    dividedBy(other) {
        if (other instanceof NumberClass) {
            if (other.value === 0) {
                return {
                    error: new errors_1.RuntimeError(other.positionStart, other.positionEnd, 'Division by zero', this.context),
                };
            }
            else {
                return {
                    result: new NumberClass(this.value / other.value).setContext(this.context),
                };
            }
        }
    }
    poweredBy(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Math.pow(this.value, other.value)).setContext(this.context),
            };
        }
    }
    getComparisonEq(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value === other.value)).setContext(this.context),
            };
        }
    }
    getComparisonNe(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value !== other.value)).setContext(this.context),
            };
        }
    }
    getComparisonLt(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value < other.value)).setContext(this.context),
            };
        }
    }
    getComparisonGt(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value > other.value)).setContext(this.context),
            };
        }
    }
    getComparisonLte(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value <= other.value)).setContext(this.context),
            };
        }
    }
    getComparisonGte(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value >= other.value)).setContext(this.context),
            };
        }
    }
    andedBy(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value && other.value)).setContext(this.context),
            };
        }
    }
    oredBy(other) {
        if (other instanceof NumberClass) {
            return {
                result: new NumberClass(Number(this.value || other.value)).setContext(this.context),
            };
        }
    }
    notted() {
        return {
            result: new NumberClass(this.value === 0 ? 1 : 0).setContext(this.context),
        };
    }
    isTrue() {
        return this.value !== 0;
    }
}
exports.NumberClass = NumberClass;
class FunctionClass extends ValueClass {
    constructor(name, bodyNode, argNames) {
        super();
        this.name = '<anonymous>';
        if (name)
            this.name = name;
        this.bodyNode = bodyNode;
        this.argNames = argNames;
    }
    execute(args) {
        let result = new RuntimeResult_1.RuntimeResult();
        let interpreter = new _1.Interpreter();
        let newContext = new Context_1.Context(this.name, this.context, this.positionStart);
        newContext.symbolTable = new symbolTable_1.SymbolTable(newContext.parent.symbolTable);
        if (args.length > this.argNames.length) {
            return result.failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, `${this.argNames.length - args.length} too many args passed into ${this.name}`, this.context));
        }
        if (args.length < this.argNames.length) {
            return result.failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, `${this.argNames.length - args.length} too few args passed into ${this.name}`, this.context));
        }
        for (let i in (0, Functions_1.range)(args.length)) {
            let argName = this.argNames[i];
            let argValue = args[i];
            argValue.setContext(newContext);
            newContext.symbolTable.set(argName, argValue);
        }
        let value = result.register(interpreter.visit(this.bodyNode, newContext));
        if (result.error)
            return result;
        return result.success(value);
    }
    copy() {
        let copy = new FunctionClass(this.name, this.bodyNode, this.argNames);
        copy.setContext(this.context);
        copy.setPosition(this.positionStart, this.positionEnd);
        return copy;
    }
    descr() {
        return `function ${this.name}`;
    }
}
exports.FunctionClass = FunctionClass;
//# sourceMappingURL=values.js.map