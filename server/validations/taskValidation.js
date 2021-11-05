const { ObjectId } = require('mongodb');

const checkSmallTask = (req, res, next) => {
  const { task } = req.body;

  if (typeof task !== 'string' || task.length < 10) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: '"task" Your task is too small',
      },
    });
  }
  return next();
};

const checkBigTask = (req, res, next) => {
  const { task } = req.body;

  if (typeof task !== 'string' || task.length > 50) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: '"task" Your task is too big',
      },
    });
  }
  return next();
};

const checkTaskId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    });
  }
  return next();
};

module.exports = {
  checkSmallTask,
  checkBigTask,
  checkTaskId,
};
