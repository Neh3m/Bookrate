import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    rating: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
      alert('Access denied: Only admins can add books');
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/books', formData);
      alert('Book added successfully!');
      setFormData({ title: '', author: '', description: '', rating: '' });
    } catch (error) {
      console.error("Error adding book:", error);
      alert('Failed to add book');
    }
  };

  return (
    <div className="formBox">
      <h1 className="addBook">Book Review</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input className="field" type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
        <input className="field" type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} />
        <textarea className="desc" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input className="rating" type="number" name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} />
        <button className="addbutton" type="submit">Add Book</button>
      </form>
    </div>
  );
}
