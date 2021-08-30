import { run } from './src/app'

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('basic > ', (text) => {
  let { tokens, error } = run('<stdin>', text)

  if (error) {
    console.log('Error: ' + error.descr())
  } else {
    console.log(tokens)
  }
  rl.close()
})
