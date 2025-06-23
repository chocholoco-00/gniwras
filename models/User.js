const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true}, // admin, caja, general, etc
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
