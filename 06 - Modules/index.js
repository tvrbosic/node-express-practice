// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports
const Calculator = require('./06 - Modules/modules/test-module-1');
const calc1 = new Calculator();
console.log(calc1.add(2, 5));

// export
// const calc2 = require('./modules/test-module-2');
const { add, multiply, divide } = require('./06 - Modules/modules/test-module-2');
//console.log(calc2.multiply(2, 5));
console.log(multiply(2, 5));

// Caching
require('./06 - Modules/modules/test-module-3')();
require('./06 - Modules/modules/test-module-3')();
require('./06 - Modules/modules/test-module-3')();
