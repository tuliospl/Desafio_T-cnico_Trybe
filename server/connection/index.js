const { MongoClient } = require('mongodb');

const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let atlasDb;

module.exports = {
  connectToServer(callback) {
    client.connect((err, db) => {
      if (db) {
        atlasDb = db.db('ebytr_tasks');
        console.log('Successfully connected to MongoDB.');
      }
      return callback(err);
    });
  },

  connection() {
    return atlasDb;
  },
};
