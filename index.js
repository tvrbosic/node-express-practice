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

const getApiPicture = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/assets/dog.txt`);
    console.log(`Breed: ${data}`);

    // ############### Handling multiple parallel promises ###############
    const promiseOne = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const promiseTwo = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const promiseThree = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const allResults = await Promise.all([
      promiseOne,
      promiseTwo,
      promiseThree,
    ]);
    const images = allResults.map((element) => element.body.message);

    console.log(images);

    await writeFilePromise('./assets/dog-img.txt', images.join('\n'));
    console.log('Random dog image saved to file');
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(error);
    }
  }
  return '2: Fetching complete!';
};

(async () => {
  try {
    console.log('1: Fetching pictures from API!');
    const result = await getApiPicture();
    console.log(result);
    console.log('3: Process finished!');
  } catch (error) {
    console.log(error);
  }
})();

/*
console.log('1: Fetching pictures from API!');
getApiPicture()
  .then((x) => {
    console.log(x);
    console.log('3: Process complete!');
  })
  .catch((error) => {
    console.log(error);
  });
*/
