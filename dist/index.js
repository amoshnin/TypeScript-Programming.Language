"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question('basic > ', (text) => {
    let { tokens, error } = (0, app_1.run)('<stdin>', text);
    if (error) {
        console.log('Error: ' + error.descr());
    }
    else {
        console.log(tokens);
    }
    rl.close();
});
//# sourceMappingURL=index.js.map