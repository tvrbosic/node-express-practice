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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscouunt: {
      type: Number,
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

// =======================< Create model from schema >=======================
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
