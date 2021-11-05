const { ObjectId } = require('mongodb');
const conn = require('../connection');
// const conn = require('../connection/connectionLocal');

const createNewTask = async ({ task, userId }) => {
  if (!task) return null;
  const date = new Date();

  const db = await conn.connection();
  const result = await db.collection('tasks')
    .insertOne({ task, date, userId });
  return {
    task, userId, _id: result.insertedId, date,
  };
};

const getAllTasks = async () => {
  const db = await conn.connection('ebytr_tasks');
  const allTasks = await db.collection('tasks').find().toArray();
  return ({ tasks: allTasks });
};

const getTaskByName = async (task) => {
  const db = await conn.connection();
  const getByName = await db.collection('tasks').findOne({ task });
  if (!getByName) return null;
  return getByName;
};

const getTaskById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await conn.connection();
  const getById = await db.collection('tasks').findOne({ _id: ObjectId(id) });
  return getById;
};

const updateTask = async (id, task) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await conn.connection();
  const result = db.collection('tasks').updateOne({ _id: ObjectId(id) }, { $set: task });
  return { _id: result.id, task };
};

const deleteTask = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await conn.connection();
  const result = await db.collection('tasks').findOneAndDelete({ _id: ObjectId(id) });
  return result.value;
};

const deleteAllTask = async () => {
  const db = await conn.connection();
  const result = await db.collection('tasks').deleteMany();
  return result;
};

module.exports = {
  createNewTask,
  getAllTasks,
  getTaskByName,
  getTaskById,
  updateTask,
  deleteTask,
  deleteAllTask,
};
