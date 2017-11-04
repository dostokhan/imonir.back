const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String , required: true },
  body: String,
  published: { type: Boolean, default: false },
  created_at: Date,
  updated_at: Date,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
