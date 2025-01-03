const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = generateToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = { ...req.body };

  // Check received data
  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  // Check if user exists and provided password matches
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError('Incorrect email or password!', 401));

  // Send token to client
  const token = generateToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  let token;

  // Check received token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError('Your are not logged in. Please log in to gain access!', 401)
    );

  // Verify token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Check if user still exists (could have been deleted)
  const loggedUser = await User.findById(decodedToken.id);
  if (!loggedUser)
    return next(
      new AppError('The user for provided token does not exist.', 401)
    );

  // Check if user changed password after JWT was issued
  if (loggedUser.hasTokenPaswordChanged(decodedToken.iat))
    return next(
      new AppError(
        'User password has been changed recently! Please log in again.'
      ),
      401
    );

  // If code reaches this point then grant access to protected route (all checks have passed without errors). Attach user to request to make it available in following middlewares.
  req.user = loggedUser;
  next();
});
