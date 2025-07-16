import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get('/books?page=1&limit=6');
        const sorted = res.data.books.sort((a, b) => b.rating - a.rating);
        setBooks(sorted.slice(0, 3)); // show top 3
        setLoading(false);
      } catch (err) {
        setError('Failed to load featured books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading featured books...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📚 Welcome to BookRate!</h1>
      <p>Discover the top rated books below.</p>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {books.map(book => (
          <div key={book._id} style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '1rem',
            width: '250px',
            backgroundColor: '#f8d9aa'
          }}>
            <h3>{book.title}</h3>
            <p>{book.description?.slice(0, 100)}...</p>
            <p>⭐ Rating: {book.rating || 'N/A'}</p>
            <Link to={`/books/${book._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
