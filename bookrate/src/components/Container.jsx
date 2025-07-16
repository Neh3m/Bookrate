import React from 'react';
import { Link } from 'react-router-dom';


export default function Container({ id, title, author, description, rating }) {
  return (
    <Link to={`/books/${id}`} className="card-link">
      <div className="card">
        <div className="book-card">
          <h3>{title}</h3>
          <p><strong>Author:</strong> {author}</p>
          <p>{description}</p>
          <p><strong>Rating:</strong> {rating}/5</p>
        </div>
      </div>
    </Link>
  );
}
