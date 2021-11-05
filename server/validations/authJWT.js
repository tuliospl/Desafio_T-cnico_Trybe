const jwt = require('jsonwebtoken');

const secret = 'Ebytr@NewTask#2021';

const validateJWT = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'missing auth token' });
  }
  try {
    const decoded = jwt.verify(authorization, secret);
    req.userInfo = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = { validateJWT };
