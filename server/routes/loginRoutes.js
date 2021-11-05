const loginRoutes = require('express').Router();
const rescue = require('express-rescue');

const loginController = require('../controllers/loginController');

loginRoutes.post('/',
  rescue(loginController.login));

module.exports = loginRoutes;
