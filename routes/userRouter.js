const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// =======================< Routes >=======================
const router = express.Router();

// Registration and login
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Password operations
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-password',
  authController.protectRoute,
  authController.updatePassword
);

// User routes
router.patch(
  '/update-authenticated',
  authController.protectRoute,
  userController.updateAuthenticatedUser
);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// =======================< Exports >=======================
module.exports = router;
