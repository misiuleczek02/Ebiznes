import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/me')
      .then(({ data }) => setUser(data))
      .catch((err) => setError(err.response?.data?.message || 'Błąd autoryzacji'));
  }, []);

  return (
    <div className="container">
      <h1>Panel użytkownika</h1>
      {error && <div className="error">{error}</div>}
      {user && (
        <div className="userbox">
          {user.avatar_url && <img className="avatar" src={user.avatar_url} alt="avatar" referrerPolicy="no-referrer" />}
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username || '—'}</p>
          <p><strong>Provider:</strong> {user.provider}</p>
          <p><strong>ID:</strong> {user.ID}</p>
        </div>
      )}
      <button className="secondary" onClick={onLogout}>Wyloguj</button>
    </div>
  );
}
