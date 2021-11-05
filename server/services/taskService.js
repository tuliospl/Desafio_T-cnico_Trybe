const taskModel = require('../models/taskModel');

const createNewTask = async ({ task, data }) => {
  const userId = data.id;
  const newTask = await taskModel.createNewTask({ task, userId });
  return { status: 201, newTask };
};

const getAllTasks = async () => {
  const allTasks = await taskModel.getAllTasks();
  return allTasks;
};

const getTaskById = async (id) => {
  const taskById = await taskModel.getTaskById(id);

  if (!taskById) {
    return { status: 404, message: 'task not found' };
  }

  return { status: 200, taskById };
};

const updateTask = async (id, task, data) => {
  const taskById = await taskModel.getTaskById(id);

  if (!taskById) {
    return { status: 404, message: 'task not found' };
  }

  const idUser = data.id;

  if (taskById.userId === idUser || data.role === 'admin') {
    const result = await taskModel.updateTask(id, task);
    return { status: 200, result };
  }

  return { status: 401, message: 'missing auth token' };
};

const deleteTask = async (id, data) => {
  const taskById = await taskModel.getTaskById(id);

  if (!taskById) {
    return { status: 404, message: 'task not found' };
  }

  const idUser = data.id;
  console.log(idUser);

  if (taskById.userId === idUser || data.role === 'admin') {
    await taskModel.deleteTask(id);
    return { status: 204 };
  }

  return { status: 401, message: 'missing auth token' };
};

const deleteAllTask = async (data) => {
  if (data.role === 'admin') {
    await taskModel.deleteAllTask();
    return { status: 204 };
  }

  return { status: 401, message: 'missing auth token' };
};

module.exports = {
  createNewTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  deleteAllTask,
};
