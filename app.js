const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

const errorHandler = (err, req, res, next) => {
  if (err.code) {
    return res.status(err.code).send({ message: err.message || 'Ошибка' });
  }
  res.status(err.code).send(err.message);
  return next();
};

app.use(errorHandler);

app.use((req, _, next) => {
  req.user = {
    _id: '62c17401d2c998946b390be1',
  };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (_, res) => res.status(404).send({ message: 'Cтраница не найдена.' }));

app.listen(PORT);
