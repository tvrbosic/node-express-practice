const fs = require('fs');

// Blocking, synchronous file reading and writing
const textIn = fs.readFileSync('./assets/txt/input.txt', 'utf-8');
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on: ${Date.now()}`;
fs.writeFileSync('./assets/txt/output.txt', textOut);
console.log('File has been written!');

// Non-blocking, asynchronous file reading and writing
fs.readFile('./assets/txt/start.txt', 'utf-8', (err, data1) => {
  if (err) {
    return console.log('Error has occured!');
  }
  fs.readFile(`./assets/txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile(`./assets/txt/append.txt`, 'utf-8', (err, data3) => {
      console.log(data3);
      fs.writeFile('./assets/txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
        console.log('File has been written!')
      });
    });
  });
});
console.log('Reading file ...');
