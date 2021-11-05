const userService = require('../services/userService');

const createNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await userService.createNewUser({ name, email, password });
  return res.status(201).json({ user: newUser });
};

module.exports = {
  createNewUser,
};
