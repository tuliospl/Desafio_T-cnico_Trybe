const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_DB_URL = process.env
  .MONGO_DB_URL || 'mongodb://mongodb:27017/ebytr_tasks';

const DB_NAME = 'ebytr_tasks';

let schema = null;

async function connection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient
    .connect(MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(DB_NAME))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { connection };
