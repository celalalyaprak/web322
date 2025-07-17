const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

rl.question('First Name: ', function (fName) {
  rl.question('Last Name: ', function (lName) {
    console.log('Hello: ' + fName + ' ' + lName);
    rl.close();
  });
});