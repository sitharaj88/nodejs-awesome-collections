const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Todo', todoSchema);
