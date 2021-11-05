const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
const dbo = require('./connection');

const { user, login, task } = require('./routes');

app.use('/register', user);

app.use('/login', login);

app.use('/tasks', task);

app.listen(PORT, () => {
  dbo.connectToServer((err) => {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${PORT}`);
});
