import { Context } from '../Context'
import {
  BinaryOperationNode,
  CallNode,
  ForNode,
  FunctionDefinitionNode,
  IfNode,
  ListNode,
  NodeType,
  NumberNode,
  StringNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
  WhileNode,
} from '../Parser/nodes'
import { RuntimeError } from '../shared/errors'
import { RuntimeResult } from './RuntimeResult'
import {
  FunctionClass,
  ListClass,
  NumberClass,
  StringClass,
  ValueClass,
} from './values'

class Interpreter {
  visit(node: NodeType, context: Context): RuntimeResult {
    // Visit_BinaryOperationNode
    if (node instanceof BinaryOperationNode) {
      return this.visitBinaryOperationNode(node, context) // => RuntimeResult(NumberClass)
    }
    // Visit_UnaryOperationNode
    if (node instanceof UnaryOperationNode) {
      return this.visitUnaryOperationNode(node, context) // => RuntimeResult(NumberClass)
    }
    // Visit_NumberNode
    if (node instanceof NumberNode) {
      return this.visitNumberNode(node, context) // => RuntimeResult(NumberClass)
    }
    // Visit_VarAccessNode
    if (node instanceof VarAccessNode) {
      return this.visitVarAccessNode(node, context) // => RuntimeResult()
    }
    // Visit_VarAssignNode
    if (node instanceof VarAssignNode) {
      return this.visitVarAssignNode(node, context) // => RuntimeResult()
    }
    // Visit_IfNode
    if (node instanceof IfNode) {
      return this.visitIfNode(node, context) // => RuntimeResult()
    }
    // Visit_ForNode
    if (node instanceof ForNode) {
      return this.visitForNode(node, context) // => RuntimeResult()
    }
    // Visit_WhileNode
    if (node instanceof WhileNode) {
      return this.visitWhileNode(node, context) // => RuntimeResult()
    }
    // Visit_FunctionDefinitionNode
    if (node instanceof FunctionDefinitionNode) {
      return this.visitFunctionDefinitionNode(node, context) // => RuntimeResult()
    }
    // Visit_CallNode
    if (node instanceof CallNode) {
      return this.visitCallNode(node, context) // => RuntimeResult()
    }
    // Visit_String
    if (node instanceof StringNode) {
      return this.visitStringNode(node, context) // => RuntimeResult()
    }
    // Visit_String
    if (node instanceof ListNode) {
      return this.visitListNode(node, context) // => RuntimeResult()
    }
  }

  visitVarAccessNode(node: VarAccessNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    let varName = node.varNameToken.value
    var value = context.symbolTable.get(varName as string) as NumberClass

    if (!value) {
      return result.failure(
        new RuntimeError(
          node.positionStart,
          node.positionEnd,
          `'${varName}' is not defined`,
          context,
        ),
      )
    }
    value = value
      .copy()
      .setPosition(node.positionStart, node.positionEnd)
      .setContext(context)
    return result.success(value as NumberClass)
  }

  visitVarAssignNode(node: VarAssignNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    let varName = node.varNameToken.value
    let value = result.register(this.visit(node.valueNode, context))
    if (result.error) return result

    context.symbolTable.set(varName as string, value)
    return result.success(value)
  }

  visitBinaryOperationNode(
    node: BinaryOperationNode,
    context: Context,
  ): RuntimeResult {
    let runtimeResult = new RuntimeResult()
    let left = runtimeResult.register(this.visit(node.leftNode, context))
    if (runtimeResult.error) return runtimeResult
    let right = runtimeResult.register(this.visit(node.rightNode, context))
    if (runtimeResult.error) return runtimeResult

    var finalResult: ValueClass = null
    var resultError: RuntimeError = null
    if (node.operationToken.type === 'PLUS') {
      const { result, error } = left.addedTo(right)
      finalResult = result as NumberClass
      resultError = error
    } else if (node.operationToken.type === 'MINUS') {
      const { result, error } = left.subtractedBy(right)
      finalResult = result as NumberClass
      resultError = error
    } else if (node.operationToken.type === 'MUL') {
      const { result, error } = left.multipliedBy(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'DIV') {
      const { result, error } = left.dividedBy(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'POW') {
      const { result, error } = left.poweredBy(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'EE') {
      const { result, error } = left.getComparisonEq(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'NE') {
      const { result, error } = left.getComparisonNe(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'LT') {
      const { result, error } = left.getComparisonLt(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'GT') {
      const { result, error } = left.getComparisonGt(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'LTE') {
      const { result, error } = left.getComparisonLte(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.type === 'GTE') {
      const { result, error } = left.getComparisonGte(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.matches('KEYWORD', 'AND')) {
      const { result, error } = left.andedBy(right)
      finalResult = result
      resultError = error
    } else if (node.operationToken.matches('KEYWORD', 'OR')) {
      const { result, error } = left.oredBy(right)
      finalResult = result
      resultError = error
    }

    if (resultError) {
      return runtimeResult.failure(resultError)
    } else {
      return runtimeResult.success(
        finalResult.setPosition(node.positionStart, node.positionEnd),
      )
    }
  }

  visitUnaryOperationNode(
    node: UnaryOperationNode,
    context: Context,
  ): RuntimeResult {
    let runtimeResult = new RuntimeResult()
    var toChangeNumber = runtimeResult.register(this.visit(node.node, context))
    if (runtimeResult.error) return runtimeResult

    var resultError: RuntimeError = null
    if (node.operation_token.type === 'MINUS') {
      const { result, error } = toChangeNumber.multipliedBy(new NumberClass(-1))
      toChangeNumber = result
      resultError = error
    } else if (node.operation_token.matches('KEYWORD', 'NOT')) {
      const { result, error } = toChangeNumber.notted()
      toChangeNumber = result
      resultError = error
    }

    if (resultError) {
      return runtimeResult.failure(resultError)
    } else {
      return runtimeResult.success(
        toChangeNumber.setPosition(node.positionStart, node.positionEnd),
      )
    }
  }

  visitNumberNode(node: NumberNode, context: Context): RuntimeResult {
    return new RuntimeResult().success(
      new NumberClass(Number(node.token.value))
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd),
    )
  }

  visitIfNode(node: IfNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    for (let { condition, expr } of node.cases) {
      let conditionValue = result.register(this.visit(condition, context))
      if (result.error) return result

      if (conditionValue.isTrue()) {
        let expressionValue = result.register(this.visit(expr, context))
        if (result.error) return result
        return result.success(expressionValue)
      }
    }

    if (node.elseCase) {
      let elseValue = result.register(this.visit(node.elseCase, context))
      if (result.error) return result
      return result.success(elseValue)
    }

    return result.success(null)
  }

  visitForNode(node: ForNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    var elements: Array<ValueClass> = []

    let startValue = result.register(
      this.visit(node.startValueNode, context),
    ) as NumberClass
    if (result.error) return result

    let endValue = result.register(
      this.visit(node.endValueNode, context),
    ) as NumberClass
    if (result.error) return result

    var stepValue: NumberClass
    if (node.stepValueNode) {
      stepValue = result.register(
        this.visit(node.stepValueNode, context),
      ) as NumberClass
      if (result.error) return result
    } else {
      stepValue = new NumberClass(1)
    }

    let i = startValue.value
    var condition: () => boolean
    if (stepValue.value >= 0) {
      condition = () => i < endValue.value
    } else {
      condition = () => i > endValue.value
    }

    while (condition()) {
      context.symbolTable.set(
        String(node.varNameToken.value),
        new NumberClass(i),
      )
      i += stepValue.value

      elements.push(result.register(this.visit(node.bodyNode, context)))
      if (result.error) return result
    }

    return result.success(
      new ListClass(elements)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd),
    )
  }

  visitWhileNode(node: WhileNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    var elements: Array<ValueClass> = []

    while (true) {
      let condition = result.register(this.visit(node.conditionNode, context))
      if (result.error) return result

      if (!condition.isTrue()) {
        break
      }

      elements.push(result.register(this.visit(node.bodyNode, context)))
      if (result.error) return result
    }

    return result.success(
      new ListClass(elements)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd),
    )
  }

  visitFunctionDefinitionNode(
    node: FunctionDefinitionNode,
    context: Context,
  ): RuntimeResult {
    let result = new RuntimeResult()

    let funcName = node.varNameToken
      ? (node.varNameToken.value as string)
      : null
    let bodyNode: NodeType = node.bodyNode
    let argNames = node.argNameTokens.map((item) => item.value as string)

    let funcValue = new FunctionClass(funcName, bodyNode, argNames)
      .setContext(context)
      .setPosition(node.positionStart, node.positionEnd)

    if (node.varNameToken) {
      context.symbolTable.set(funcName, funcValue)
    }

    return result.success(funcValue)
  }

  visitCallNode(node: CallNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    var args = []
    let valueToCall = result.register(this.visit(node.nodeToCall, context))
    if (result.error) return result
    valueToCall = valueToCall
      .copy()
      .setPosition(node.positionStart, node.positionEnd)

    node.argNodes.forEach((argNode) => {
      args.push(result.register(this.visit(argNode, context)))
      if (result.error) return result
    })

    var returnValue = result.register(valueToCall.execute(args))
    if (result.error) return result

    returnValue = returnValue
      .copy()
      .setPosition(node.positionStart, node.positionEnd)
      .setContext(context)
    return result.success(returnValue)
  }

  visitStringNode(node: StringNode, context: Context): RuntimeResult {
    return new RuntimeResult().success(
      new StringClass(node.token.value as string)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd),
    )
  }

  visitListNode(node: ListNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    var elements: Array<ValueClass> = []

    node.elementNodes.forEach((elementNode) => {
      elements.push(result.register(this.visit(elementNode, context)))
      if (result.error) return result
    })

    return result.success(
      new ListClass(elements)
        .setContext(context)
        .setPosition(node.positionStart, node.positionEnd),
    )
  }
}

export { Interpreter }
