const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regExp } = require('../utils/utils');

const {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).custom(regExp),
  }),
}), updateAvatar);

module.exports = router;
