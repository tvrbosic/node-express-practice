const fs = require('fs');
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  // Soultion 1
  // BAD: content is too big to be stored in single variable and send all at once. App stops working due to lack of memory resouces to handle it.
  // --------------------------------------------------------------------------------------------------------------------------------------------
  // fs.readFile('./assets/test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Solution 2
  // BAD: File is being read faster than responses are being sent over the network which will overwhelm response stream (term called BACKPRESSURE)
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  //const readStream = fs.createReadStream('./assets/test-file.txt');
  //readStream.on('data', (dataChunk) => {
  //  res.write(dataChunk);
  //});
  //readStream.on('error', (err) => {
  //  console.log(err);
  //  res.statusCode = 500;
  //  res.end('File not found!');
  //});
  //readStream.on('end', () => {
  //  res.end();
  //});

  // Solution 3
  // Pipe output of file reading stream directly to input of response stream
  const readStream = fs.createReadStream('./assets/test-file.txt');
  // readableSource.pipe(writableDestination)
  readStream.pipe(res);
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
