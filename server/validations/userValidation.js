const userModel = require('../models/userModel');

const isValidName = (req, res, next) => {
  const { name } = req.body;

  if (!name || name === '') {
    return res.status(400).json({
      err: {
        code: 'invalid_data',
        message: 'Invalid entries. Try again.',
      },
    });
  }
  return next();
};

const userExists = async (req, res, next) => {
  const { email } = req.body;

  const userEmail = await userModel.getUserEmail(email);

  if (userEmail) {
    return res.status(409).json({
      err: {
        code: 'invalid_data',
        message: 'Email already registered',
      },
    });
  }
  return next();
};

const isValidEmail = (req, res, next) => {
  const { email } = req.body;
  const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.([a-z]+))?$/i;

  if (!regex.test(email) || !email) {
    return res.status(400).json({
      err: {
        code: 'invalid_data',
        message: 'Invalid entries. Try again.',
      },
    });
  }
  return next();
};

const isValidPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password || password === '') {
    return res.status(400).json({
      err: {
        code: 'invalid_data',
        message: 'Invalid entries. Try again.',
      },
    });
  }
  return next();
};

module.exports = {
  isValidName,
  userExists,
  isValidEmail,
  isValidPassword,
};
