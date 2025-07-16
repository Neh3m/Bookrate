const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET all books with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH and FILTER books
router.get('/search', async (req, res) => {
  try {
    const { title, minRating } = req.query;

    const query = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // case-insensitive
    }
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error searching books' });
  }
});


// GET a single book by ID (with reviews)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a review for a book
router.post('/:id/reviews', async (req, res) => {
  try {
    const { username, comment, rating } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Add review
    const newReview = { username, comment, rating };
    book.reviews.push(newReview);

    // Recalculate average rating
    const totalRatings = book.reviews.reduce((acc, r) => acc + r.rating, 0);
    book.rating = totalRatings / book.reviews.length;

    await book.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding review' });
  }
});


// POST a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, description, rating } = req.body;
    const book = new Book({ title, author, description, rating });
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a book
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a review to a book
router.post('/:id/reviews', async (req, res) => {
  const { comment, rating, username } = req.body;

  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const newReview = {
      user: null, // optional: set to req.user.id if using auth middleware
      username,
      comment,
      rating,
    };

    book.reviews.push(newReview);

    // Optional: update overall rating (average of all reviews)
    const totalRatings = book.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    book.rating = totalRatings / book.reviews.length;

    await book.save();
    res.status(201).json({ message: 'Review added', review: newReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
