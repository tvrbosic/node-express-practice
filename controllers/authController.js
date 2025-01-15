// LIBRARY
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// APP
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKE_EXPIRATION * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    ...(process.env.NODE_ENV === 'production' && { secure: true }),
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createAndSendToken(newUser, 201, res);
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

  createAndSendToken(user, 200, res);
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

  /**
   * ==========| GRANT ACCESS TO PROTECTED ROUTE |==========
   * If code reaches this point then grant access to protected route (all checks have passed without errors).
   * Attach user to request to make it available in following middlewares.
   */
  req.user = loggedUser;
  next();
});

// Create closure wrapper function because we need to pass parameters to middleware function
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Roles is an array: ['admin', 'lead-guide']
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError('There is no user with provided email address!', 404)
    );

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to users email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n If you did not forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedPasswordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedPasswordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  // 3) Update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Log the user in and send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted password is correct
  if (!(await user.comparePassword(req.body.currentPassword, user.password)))
    return next(new AppError('Incorrect password provided.', 401));

  // 3) If password is correct update the password (we set passwordConfirm to trigger model validation which will not be persisted in database)
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  // 4) Log user in with new JWT token (new token required because password has been changed)
  createAndSendToken(user, 200, res);
});
