"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const values_1 = require("./src/Interpreter/values");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question('basic > ', (text) => {
    fn(text);
    rl.question('basic > ', (text) => {
        fn(text);
        rl.question('basic > ', (text) => {
            fn(text);
            rl.question('basic > ', (text) => {
                fn(text);
                rl.question('basic > ', (text) => {
                    fn(text);
                    rl.close();
                });
            });
        });
    });
});
const fn = (text) => {
    if (text.trim() !== '') {
        let { result, error } = (0, app_1.run)('<stdin>', text);
        if (error) {
            console.log('Error: ' + error.descr());
        }
        else if (result) {
            if (result instanceof values_1.ListClass) {
                if (result.elements.length === 1) {
                    console.log(result.elements[0].descr());
                }
                else
                    mainPrint();
            }
            else
                mainPrint();
        }
        function mainPrint() {
            console.log(result.descr());
        }
    }
};
//# sourceMappingURL=index.js.map