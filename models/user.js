const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://i.pinimg.com/originals/9f/0d/0c/9f0d0c6b8d291fc1f8efb709e709239f.jpg',
  },
});

module.exports = mongoose.model('user', userSchema);
