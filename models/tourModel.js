// LIBRARY
const mongoose = require('mongoose');
const slugify = require('slugify');

// =======================< Schema >=======================
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxLength: [75, 'A tour name must have less or equal to 75 characters.'],
      minLength: [3, 'A tour name must have 3 or more characters.'],
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty defined.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal to 1.0.'],
      max: [5, 'Rating must be below or equal to 5.0.'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // NOTE: this object only points to current document on NEW document creation. This will not work on update.
          return val < this.price; // Return true if priceDiscount is lower than price. False will raise validation error.
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary.'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// =======================< Virtual properties >=======================
// Virtual properties are not persisted in database, re-calculated during execution (ie get method)
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// =======================< Mongoose middlewares >=======================
// Mongoose has 4 types of middleware: document middleware, model middleware, aggregate middleware, and query middleware.

// -------------< Document middleware >-------------
// In Moongoose document middleware object 'this' represents document
// PRE SAVE HOOK - runs before .save() and .create()  methods
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// // POST SAVE HOOK - executed after all PRE SAVE HOOK middleware functions have been completed
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// -------------< Query middleware >-------------
// Regex /^find/ used to cover all Moongoose methods that start with word find: find(), findOne(), findOneAndDelete(), findOneAndUpdate()
// In Moongoose query middleware object 'this' represents query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // Get tours that are not secret
  this.startTime = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.startTime} ms`);
  next();
});

// -------------< Aggregation middleware >-------------
// In Moongoose aggregation middleware object 'this' represents aggregation
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

// =======================< Create model from schema >=======================
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
