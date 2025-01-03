const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password field is required.'],
    minLength: [8, 'Password length must be at least 8 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // This only works on model save to DB !!!
      validator: function (fieldValue) {
        return fieldValue === this.password;
      },
      message: 'Passwords do not match.',
    },
  },
  passwordChangedAt: Date,
});

// =======================< Mongoose middlewares >=======================
// -------------< Document middleware >-------------
userSchema.pre('save', async function (next) {
  // Run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm  field (avoid persisting in DB). At this moment passwords have already been compared and we do not need this field anymore.
  this.passwordConfirm = undefined;

  next();
});

// =======================< Schema instance methods >=======================
userSchema.methods.comparePassword = async function (
  inputPassword,
  databasePassword
) {
  return await bcrypt.compare(inputPassword, databasePassword);
};

userSchema.methods.hasTokenPaswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimestamp < passwordChangedTimestamp;
  }

  // false means password has not been changed
  return false;
};

// =======================< Create model from schema >=======================
const User = mongoose.model('User', userSchema);

module.exports = User;
