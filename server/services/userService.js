const userModel = require('../models/userModel');

const createNewUser = async ({ name, email, password }) => {
  const newUser = await userModel.createNewUser({ name, email, password });
  return newUser;
};

module.exports = {
  createNewUser,
};
