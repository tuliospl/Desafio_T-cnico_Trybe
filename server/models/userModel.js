const conn = require('../connection');
// const conn = require('../connection/connectionLocal');

const createNewUser = async ({ name, email, password }) => {
  const db = await conn.connection();
  const newUser = await db.collection('users').insertOne({
    name, email, password, role: 'user',
  });
  return {
    _id: newUser.insertedId, name, email, role: 'user',
  };
};

const getUserEmail = async (email) => {
  const db = await conn.connection();
  const userEmail = await db.collection('users').findOne({ email });
  if (!userEmail) return null;
  return userEmail;
};

module.exports = {
  createNewUser,
  getUserEmail,
};
