import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNewName(parsedUser.username);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  const handleEdit = () => {
    // This is just a mock — implement backend update later if needed
    setUser((prev) => ({ ...prev, username: newName }));
    localStorage.setItem('user', JSON.stringify({ ...user, username: newName }));
    setEditing(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {user.username}!</h2>

      {editing ? (
        <>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={handleEdit}>Save</button>
        </>
      ) : (
        <button onClick={() => setEditing(true)}>Edit Name</button>
      )}

      <br /><br />
      <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>
        Logout
      </button>
    </div>
  );
}
