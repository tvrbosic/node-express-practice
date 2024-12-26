class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryParams = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((element) => {
      delete queryParams[element];
    });

    // 2) Advanced filtering
    let queryParamsString = JSON.stringify(queryParams);

    queryParamsString = queryParamsString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryParamsString));

    return this; // Allows us to chain functions defined inside this class
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default: descending sort by createdAt
      this.query = this.query.sort('-_id');
    }

    return this; // Allows us to chain functions defined inside this class
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Default: exclude field __v
      this.query = this.query.select('-__v');
    }

    return this; // Allows us to chain functions defined inside this class
  }

  paginate() {
    const pageParam = this.queryString.page * 1 || 1; // Multiply by one to convert string to number. Set 1 as default if none specified.
    const limitParam = this.queryString.limit * 1 || 100; // Multiply by one to convert string to number. Set 1 as default if none specified.
    const recordsToSkip = (pageParam - 1) * limitParam;

    this.query = this.query.skip(recordsToSkip).limit(limitParam);

    return this; // Allows us to chain functions defined inside this class
  }
}

module.exports = APIFeatures;
