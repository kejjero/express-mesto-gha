const User = require('../models/user');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      if (res.status === 200 || 201) {
        res.send({ data: user })
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Данные некорректны'));
      }
      return next(err);
    });
};

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(new ServerError({ message: 'Ошибка сервера' }));
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        next(new NotFoundError({ message: 'Пользователь с таким id не найден.' }));
        return;
      }
      return res.status(200).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Передан некорректный id.' }));
        return;
      }
      next(new ServerError({ message: 'Ошибка сервера' }));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (res.status === 200) {
        return res.send({ data: user })
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные некорректны'));
        return;
      }
      next(new ServerError({ message: 'Ошибка сервера' }));
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Данные некорректны' }));
        return;
      }
      next(new ServerError({ message: 'Ошибка сервера' }));
    });
};

module.exports = {
  createUser, getUsers, getUser, updateUser, updateAvatar,
};
