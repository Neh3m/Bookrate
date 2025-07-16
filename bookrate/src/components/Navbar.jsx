import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen to custom "userChanged" event
    const onUserChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userChanged', onUserChange);

    return () => window.removeEventListener('userChanged', onUserChange);
  }, []);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/booklist">Books</Link>
          {user?.isAdmin && <Link to="/addbook">Add Book</Link>}
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    </div>
  );
}
