const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  score: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
