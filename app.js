const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

const errorHandler = (err, req, res, next) => {
  res.status(err.code).send({ message: err.message });
  next();
};

app.use((req, _res, next) => {
  req.user = {
    _id: '62c17401d2c998946b390be1',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (_req, res) => res.status(404).send({ message: 'Cтраница не найдена' }));

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
