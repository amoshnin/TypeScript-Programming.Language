import { run } from './src/app'
import { ListClass, ValueClass } from './src/Interpreter/values'

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('basic > ', (text: string) => {
  fn(text)
  rl.question('basic > ', (text: string) => {
    fn(text)
    rl.question('basic > ', (text: string) => {
      fn(text)
      rl.question('basic > ', (text: string) => {
        fn(text)
        rl.question('basic > ', (text: string) => {
          fn(text)
          rl.close()
        })
      })
    })
  })
})

const fn = (text: string) => {
  if (text.trim() !== '') {
    let { result, error } = run('<stdin>', text)

    if (error) {
      console.log('Error: ' + error.descr())
    } else if (result) {
      if (result instanceof ListClass) {
        if (result.elements.length === 1) {
          console.log(result.elements[0].descr())
        } else mainPrint()
      } else mainPrint()
    }

    function mainPrint() {
      console.log(result.descr())
    }
  }
}
