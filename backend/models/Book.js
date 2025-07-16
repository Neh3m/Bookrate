const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, {
  timestamps: true
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  description: String,
  rating: { type: Number, default: 0 }, 
  reviews: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
