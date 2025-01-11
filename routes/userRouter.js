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

// General user routes
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// =======================< Exports >=======================
module.exports = router;
