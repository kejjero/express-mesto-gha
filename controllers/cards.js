const Card = require('../models/card');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw next(new BadRequestError({ message: 'Данные некорректны' }));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      if (!cards) {
        throw next(new NotFoundError('Карточка не найдена.'));
      }
    })
    .catch(() => {
      throw next(new ServerError('Ошибка сервера'));
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Карточка не найдена.'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw next(new BadRequestError('Данные некорректны'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Карточка не найдена.'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw next(new BadRequestError('Данные некорректны'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Карточка с таким id не найдена.'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw next(new BadRequestError({ message: 'Данные некорректны' }));
      }
      next(new ServerError({ message: 'Ошибка сервера' }));
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
