const taskRoutes = require('express').Router();
const rescue = require('express-rescue');
const taskIsValid = require('../validations/taskValidation');
const auth = require('../validations/authJWT');

const taskController = require('../controllers/taskcontroller');

taskRoutes.get('/',
  taskController.getAllTasks);

taskRoutes.post('/',
  auth.validateJWT,
  taskIsValid.checkSmallTask,
  taskIsValid.checkBigTask,
  rescue(taskController.createNewTask));

taskRoutes.get('/:id',
  taskIsValid.checkTaskId,
  rescue(taskController.getTaskById));

taskRoutes.put('/:id',
  auth.validateJWT,
  taskIsValid.checkSmallTask,
  taskIsValid.checkBigTask,
  taskIsValid.checkTaskId,
  rescue(taskController.updateTask));

taskRoutes.delete('/:id',
  auth.validateJWT,
  taskIsValid.checkTaskId,
  rescue(taskController.deleteTask));

taskRoutes.delete('/',
  auth.validateJWT,
  rescue(taskController.deleteAllTask));

module.exports = taskRoutes;
