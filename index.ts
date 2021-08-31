import { run } from './src/app'

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('basic > ', (text: string) => {
  let { result, error } = run('<stdin>', text)

  if (error) {
    console.log('Error: ' + error.descr())
  } else {
    console.log(result.descr())
  }
  rl.question('basic > ', (text: string) => {
    let { result, error } = run('<stdin>', text)

    if (error) {
      console.log('Error: ' + error.descr())
    } else {
      console.log(result.descr())
    }
    rl.close()
  })
})
