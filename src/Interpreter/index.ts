import { Context } from '../Context'
import {
  BinaryOperationNode,
  ForNode,
  IfNode,
  NodeType,
  NumberNode,
  UnaryOperationNode,
  VarAccessNode,
  VarAssignNode,
  WhileNode,
} from '../Parser/nodes'
import { RuntimeError } from '../shared/errors'
import { RuntimeResult } from './RuntimeResult'
import { NumberClass } from './values'

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
  }

  visitVarAccessNode(node: VarAccessNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    let varName = node.varNameToken.value
    var value = context.symbolTable.get(varName as string)

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
    value = value.copy().setPosition(node.positionStart, node.positionEnd)
    return result.success(value)
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

    var result: NumberClass = null
    var resultError: RuntimeError = null
    if (node.operationToken.type === 'PLUS') {
      const { number, error } = left.addedTo(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'MINUS') {
      const { number, error } = left.subtractedBy(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'MUL') {
      const { number, error } = left.multipliedBy(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'DIV') {
      const { number, error } = left.dividedBy(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'POW') {
      const { number, error } = left.poweredBy(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'EE') {
      const { number, error } = left.getComparisonEq(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'NE') {
      const { number, error } = left.getComparisonNe(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'LT') {
      const { number, error } = left.getComparisonLt(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'GT') {
      const { number, error } = left.getComparisonGt(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'LTE') {
      const { number, error } = left.getComparisonLte(right)
      result = number
      resultError = error
    } else if (node.operationToken.type === 'GTE') {
      const { number, error } = left.getComparisonGte(right)
      result = number
      resultError = error
    } else if (node.operationToken.matches('KEYWORD', 'AND')) {
      const { number, error } = left.andedBy(right)
      result = number
      resultError = error
    } else if (node.operationToken.matches('KEYWORD', 'OR')) {
      const { number, error } = left.oredBy(right)
      result = number
      resultError = error
    }

    if (resultError) {
      return runtimeResult.failure(resultError)
    } else {
      return runtimeResult.success(
        result.setPosition(node.positionStart, node.positionEnd),
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
      const { number, error } = toChangeNumber.multipliedBy(new NumberClass(-1))
      toChangeNumber = number
      resultError = error
    } else if (node.operation_token.matches('KEYWORD', 'NOT')) {
      const { number, error } = toChangeNumber.notted()
      toChangeNumber = number
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
    let startValue = result.register(this.visit(node.startValueNode, context))
    if (result.error) return result

    let endValue = result.register(this.visit(node.endValueNode, context))
    if (result.error) return result

    var stepValue: NumberClass
    if (node.stepValueNode) {
      stepValue = result.register(this.visit(node.stepValueNode, context))
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

      result.register(this.visit(node.bodyNode, context))
      if (result.error) return result
    }

    return result.success(null)
  }

  visitWhileNode(node: WhileNode, context: Context): RuntimeResult {
    let result = new RuntimeResult()
    while (true) {
      let condition = result.register(this.visit(node.conditionNode, context))
      if (result.error) return result

      if (!condition.isTrue()) {
        break
      }

      result.register(this.visit(node.bodyNode, context))
      if (result.error) return result
    }

    return result.success(null)
  }
}

export { Interpreter }
