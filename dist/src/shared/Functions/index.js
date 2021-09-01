"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = exports.stringWithArrows = void 0;
const stringWithArrows = (text, positionStart, positionEnd) => {
    return 'x';
    // Python code
    //   result = ''
    // # Calculate indices
    // idx_start = max(text.rfind('\n', 0, pos_start.idx), 0)
    // idx_end = text.find('\n', idx_start + 1)
    // if idx_end < 0: idx_end = len(text)
    // # Generate each line
    // line_count = pos_end.ln - pos_start.ln + 1
    // for i in range(line_count):
    //     # Calculate line columns
    //     line = text[idx_start:idx_end]
    //     col_start = pos_start.col if i == 0 else 0
    //     col_end = pos_end.col if i == line_count - 1 else len(line) - 1
    //     # Append to result
    //     result += line + '\n'
    //     result += ' ' * col_start + '^' * (col_end - col_start)
    //     # Re-calculate indices
    //     idx_start = idx_end
    //     idx_end = text.find('\n', idx_start + 1)
    //     if idx_end < 0: idx_end = len(text)
    // return result.replace('\t', '')
};
exports.stringWithArrows = stringWithArrows;
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }
    if (typeof step == 'undefined') {
        step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }
    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
}
exports.range = range;
//# sourceMappingURL=index.js.map