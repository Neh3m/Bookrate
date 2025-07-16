import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books?page=${page}&limit=5`);
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching books", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/search`, {
        params: {
          title: search,
          minRating
        }
      });
      setBooks(res.data);
      setIsFiltering(true);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setMinRating('');
    setIsFiltering(false);
    setPage(1);
    fetchBooks();
  };

  useEffect(() => {
    if (!isFiltering) {
      fetchBooks();
    }
  }, [page]);

  return (
    <>
      <h1 className="htitle">Here Is All Your Books</h1>

      {/* 🔍 Search and Filter */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">Min Rating</option>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r}+</option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
        {isFiltering && <button onClick={resetFilters}>Reset</button>}
      </div>

      {/* 📚 Book List */}
      <div className="book-container">
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book) => (
            <Link to={`/books/${book._id}`} key={book._id} className="card-link">
              <div className="book-card">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Rating:</strong> {book.rating.toFixed(1)}/5</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>

      {/* 📄 Pagination */}
      {!isFiltering && (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>⬅ Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next ➡</button>
        </div>
      )}
    </>
  );
}
