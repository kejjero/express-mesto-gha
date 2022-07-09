const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

const errorHandler = (err, req, res, next) => {
  res.status(err.code).send({ message: err.message });
  next();
};

app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (_req, res) => res.status(404).send({ message: 'Cтраница не найдена' }));

app.use(errorHandler);

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use(auth);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
