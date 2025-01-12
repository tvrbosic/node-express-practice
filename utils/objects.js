const filterObject = (inputObject, ...allowedFileds) => {
  const filteredObject = {};
  Object.keys(inputObject).forEach((key) => {
    if (allowedFileds.includes(key)) {
      filteredObject[key] = inputObject[key];
    }
  });
  return filteredObject;
};

module.exports = {
  filterObject,
};
