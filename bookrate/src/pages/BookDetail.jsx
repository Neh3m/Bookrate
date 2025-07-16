import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')); // ✅ defined only once

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.error('Failed to fetch book details', err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        alert('Book deleted');
        navigate('/booklist');
      } catch (err) {
        console.error('Delete failed', err);
        alert('Delete failed');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/books/${id}/reviews`, {
        username: user?.username || 'Anonymous',
        comment: newReview,
        rating: parseInt(newRating),
      });

      setNewReview('');
      setNewRating(5);
      await fetchBook(); // refresh book data
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-detail" style={{ padding: '2rem' }}>
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Average Rating:</strong> {book.rating.toFixed(1)} / 5</p>

      {/* ✅ Only admin sees Delete button */}
      {user?.isAdmin && (
        <button
          onClick={handleDelete}
          style={{ backgroundColor: 'red', color: 'white', marginBottom: '1rem' }}
        >
          Delete Book
        </button>
      )}

      <hr />

      <h3>Reviews</h3>
      {book.reviews && book.reviews.length > 0 ? (
        <ul>
          {book.reviews.map((r, i) => (
            <li key={i}>
              <strong>{r.username}</strong>: {r.comment} — <em>{r.rating}/5</em>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      <hr />

      <h3>Submit a Review</h3>
      <form onSubmit={handleReviewSubmit} style={{ maxWidth: '400px', marginTop: '1rem' }}>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          rows={4}
          placeholder="Write your review..."
          style={{ width: '100%', marginBottom: '1rem' }}
          required
        />
        <br />
        <label>Rating:</label>
        <select
          value={newRating}
          onChange={(e) => setNewRating(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
