"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltInFunctionClass = exports.FunctionClass = exports.NumberClass = exports.ListClass = exports.StringClass = exports.ValueClass = void 0;
const Context_1 = require("../Context");
const errors_1 = require("../shared/errors");
const RuntimeResult_1 = require("./RuntimeResult");
const _1 = require(".");
const symbolTable_1 = require("../Context/symbolTable");
const Functions_1 = require("../shared/Functions");
// Value Clasess: //
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
NumberClass.null = new NumberClass(0);
NumberClass.false = new NumberClass(0);
NumberClass.true = new NumberClass(1);
NumberClass.MathPI = new NumberClass(Math.PI);
class BaseFunctionClass extends ValueClass {
    constructor(name) {
        super();
        this.name = '<anonymous>';
        if (name)
            this.name = name;
    }
    generateNewContext() {
        let newContext = new Context_1.Context(this.name, this.context, this.positionStart);
        newContext.symbolTable = new symbolTable_1.SymbolTable(newContext.parent.symbolTable);
        return newContext;
    }
    checkArgs(argNames, args) {
        let result = new RuntimeResult_1.RuntimeResult();
        if (args.length > argNames.length) {
            return result.failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, `${argNames.length - args.length} too many args passed into ${this.name}`, this.context));
        }
        if (args.length < argNames.length) {
            return result.failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, `${argNames.length - args.length} too few args passed into ${this.name}`, this.context));
        }
        return result.success(null);
    }
    populateArgs(argNames, args, executionContext) {
        for (let i in (0, Functions_1.range)(args.length)) {
            let argName = argNames[i];
            let argValue = args[i];
            argValue.setContext(executionContext);
            executionContext.symbolTable.set(argName, argValue);
        }
    }
    checkAndPopulateArgs(argNames, args, executionContext) {
        let result = new RuntimeResult_1.RuntimeResult();
        result.register(this.checkArgs(argNames, args));
        if (result.error)
            return result;
        this.populateArgs(argNames, args, executionContext);
        return result.success(null);
    }
}
class FunctionClass extends BaseFunctionClass {
    constructor(name, bodyNode, argNames) {
        super(name);
        this.bodyNode = bodyNode;
        this.argNames = argNames;
    }
    execute(args) {
        let result = new RuntimeResult_1.RuntimeResult();
        let interpreter = new _1.Interpreter();
        let executionContext = this.generateNewContext();
        result.register(this.checkAndPopulateArgs(this.argNames, args, executionContext));
        if (result.error)
            return result;
        let value = result.register(interpreter.visit(this.bodyNode, executionContext));
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
        return `<function ${this.name}>`;
    }
}
exports.FunctionClass = FunctionClass;
class BuiltInFunctionClass extends BaseFunctionClass {
    constructor(name) {
        super(name);
        this.executePrintArgNames = ['value'];
        this.executeIsNumberArgNames = ['value'];
        this.executeIsStringArgNames = ['value'];
        this.executeIsListArgNames = ['value'];
        this.executeIsFunctionArgNames = ['value'];
        this.executeAppendArgNames = ['list', 'value'];
        this.executePopArgNames = ['list', 'index'];
        this.executeExtendArgNames = ['listA', 'listB'];
    }
    copy() {
        let copy = new BuiltInFunctionClass(this.name);
        copy.setContext(this.context);
        copy.setPosition(this.positionStart, this.positionEnd);
        return copy;
    }
    descr() {
        return `<built-in function ${this.name}>`;
    }
    execute(args) {
        let result = new RuntimeResult_1.RuntimeResult();
        let executionContext = this.generateNewContext();
        let methodName = `execute${(0, Functions_1.capitalizeFirstLetter)(this.name)}`;
        let method = this[methodName] || this['noVisitMethod'];
        result.register(this.checkAndPopulateArgs(this[`${methodName}ArgNames`], args, executionContext));
        if (result.error)
            return result;
        let returnValue = result.register(method(executionContext));
        if (result.error)
            return result;
        return result.success(returnValue);
    }
    noVisitMethod() {
        throw Error(`No execute${(0, Functions_1.capitalizeFirstLetter)(this.name)} method defined`);
    }
    executePrint(executionContext) {
        console.log(String(executionContext.symbolTable.get('value').descr()));
        return new RuntimeResult_1.RuntimeResult().success(NumberClass.null);
    }
    executeIsNumber(executionContext) {
        let isNumber = executionContext.symbolTable.get('value') instanceof NumberClass;
        return new RuntimeResult_1.RuntimeResult().success(isNumber ? NumberClass.true : NumberClass.false);
    }
    executeIsString(executionContext) {
        let isString = executionContext.symbolTable.get('value') instanceof StringClass;
        return new RuntimeResult_1.RuntimeResult().success(isString ? NumberClass.true : NumberClass.false);
    }
    executeIsList(executionContext) {
        let isList = executionContext.symbolTable.get('value') instanceof ListClass;
        return new RuntimeResult_1.RuntimeResult().success(isList ? NumberClass.true : NumberClass.false);
    }
    executeIsFunction(executionContext) {
        let isFunction = executionContext.symbolTable.get('value') instanceof BaseFunctionClass;
        return new RuntimeResult_1.RuntimeResult().success(isFunction ? NumberClass.true : NumberClass.false);
    }
    executeAppend(executionContext) {
        let list = executionContext.symbolTable.get('list');
        let value = executionContext.symbolTable.get('value');
        if (!(list instanceof ListClass)) {
            return new RuntimeResult_1.RuntimeResult().failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, 'First argument must be list', executionContext));
        }
        list.elements.push(value);
        return new RuntimeResult_1.RuntimeResult().success(NumberClass.null);
    }
    executePop(executionContext) {
        let list = executionContext.symbolTable.get('list');
        let index = executionContext.symbolTable.get('index');
        if (!(list instanceof ListClass)) {
            return new RuntimeResult_1.RuntimeResult().failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, 'First argument must be list', executionContext));
        }
        if (!(index instanceof NumberClass)) {
            return new RuntimeResult_1.RuntimeResult().failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, 'Second argument must be number', executionContext));
        }
        var element;
        try {
            element = list.elements.splice(index.value, 1)[0];
        }
        catch (_a) {
            return new RuntimeResult_1.RuntimeResult().failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, 'Second argument must be number', executionContext));
        }
        return new RuntimeResult_1.RuntimeResult().success(element);
    }
    executeExtend(executionContext) {
        var listA = executionContext.symbolTable.get('listA');
        let listB = executionContext.symbolTable.get('listB');
        if (!(listA instanceof ListClass)) {
            return new RuntimeResult_1.RuntimeResult().failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, 'First argument must be list', executionContext));
        }
        if (!(listB instanceof ListClass)) {
            return new RuntimeResult_1.RuntimeResult().failure(new errors_1.RuntimeError(this.positionStart, this.positionEnd, 'Second argument must be list', executionContext));
        }
        return new RuntimeResult_1.RuntimeResult().success(new ListClass(listA.elements.concat(listB.elements)));
    }
}
exports.BuiltInFunctionClass = BuiltInFunctionClass;
// Built-in Functions implementation
BuiltInFunctionClass.executePrint = new BuiltInFunctionClass('print');
class StringClass extends ValueClass {
    constructor(value) {
        super();
        this.value = value;
    }
    descr() {
        return `"${this.value}"`;
    }
    // FUNC: CONCATENATE TWO STRING TOGETHER
    addedTo(other) {
        if (other instanceof StringClass) {
            return {
                result: new StringClass(this.value + other.value).setContext(this.context),
            };
        }
        else {
            return { error: this.illegalOperation(other) };
        }
    }
    // FUNC: IF MULTIPLY A STRING BY A NUMBER, IT WILL RETURN THAT STRING THAT NUMBER OF TIMES
    multipliedBy(other) {
        if (other instanceof NumberClass) {
            return {
                result: new StringClass(this.value.repeat(other.value)).setContext(this.context),
            };
        }
        else {
            return { error: this.illegalOperation(other) };
        }
    }
    isTrue() {
        return this.value.length > 0;
    }
    copy() {
        let copy = new StringClass(this.value);
        copy.setPosition(this.positionStart, this.positionEnd);
        copy.setContext(this.context);
        return copy;
    }
}
exports.StringClass = StringClass;
class ListClass extends ValueClass {
    constructor(elements) {
        super();
        this.elements = elements;
    }
    descr() {
        return `[${this.elements.map((item) => item.descr()).join(', ')}]`;
    }
    copy() {
        let copy = new ListClass(this.elements);
        copy.setPosition(this.positionStart, this.positionEnd);
        copy.setContext(this.context);
        return copy;
    }
    addedTo(other) {
        var newList = this.copy();
        newList.elements.push(other);
        return { result: newList };
    }
    subtractedBy(other) {
        if (other instanceof NumberClass) {
            var newList = this.copy();
            if (other.value < newList.elements.length && other.value > 0) {
                delete newList[other.value];
                return { result: newList };
            }
            else {
                return {
                    error: new errors_1.RuntimeError(other.positionStart, other.positionEnd, 'Element at this index could not be removed from list because index is out of bounds', this.context),
                };
            }
        }
        else {
            return { error: this.illegalOperation(other) };
        }
    }
    dividedBy(other) {
        if (other instanceof NumberClass) {
            if (other.value < this.elements.length && other.value > 0) {
                return { result: this.elements[other.value] }; // ERRONEOUS
            }
            else {
                return {
                    error: new errors_1.RuntimeError(other.positionStart, other.positionEnd, 'Element at this index could not be retrieved from list because index is out of bounds', this.context),
                };
            }
        }
        else {
            return { error: this.illegalOperation(other) };
        }
    }
    multipliedBy(other) {
        if (other instanceof ListClass) {
            var newList = this.copy();
            newList.elements = newList.elements.concat(other.elements);
            return { result: newList };
        }
        else {
            return { error: this.illegalOperation(other) };
        }
    }
}
exports.ListClass = ListClass;
//# sourceMappingURL=values.js.map