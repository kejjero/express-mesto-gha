const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const regExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const errorHandler = (err, req, res, next) => {
  res.status(err.code).send({ message: err.message });
  next();
};

mongoose.connect('mongodb://localhost:27017/mestodb');

// я поторопился и забыл смерджить ветки, из-за этого так много ошибок :)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExp),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
