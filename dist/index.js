"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question('basic > ', (text) => {
    fn(text);
    rl.question('basic > ', (text) => {
        fn(text);
        rl.close();
    });
});
const fn = (text) => {
    let { result, error } = (0, app_1.run)('<stdin>', text);
    if (error) {
        console.log('Error: ' + error.descr());
    }
    else if (result) {
        console.log(result.descr());
    }
};
//# sourceMappingURL=index.js.map