const userRoutes = require('express').Router();
const rescue = require('express-rescue');

const isValid = require('../validations/userValidation');

const userController = require('../controllers/userController');

userRoutes.post('/',
  isValid.isValidName,
  isValid.isValidPassword,
  isValid.isValidEmail,
  isValid.userExists,
  rescue(userController.createNewUser));

module.exports = userRoutes;
