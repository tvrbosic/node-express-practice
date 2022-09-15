const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('File was not found!'); // Argument passed to reject function will be available in .catch function
      resolve(data); // Argument passed to resolve function will be available in .then function
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject('Could not write file!');
      resolve('Success');
    });
  });
};

readFilePromise(`${__dirname}/assets/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    // Chain promises
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePromise('./assets/dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file!');
  })
  .catch((err) => {
    console.log(err.message);
  });
