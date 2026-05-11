import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register({ onAuth }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { email, username, password });
      localStorage.setItem('token', data.token);
      onAuth(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd rejestracji');
    }
  };

  return (
    <div className="container">
      <h1>Rejestracja</h1>
      <form onSubmit={submit}>
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Nazwa użytkownika
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>Hasło (min. 6 znaków)
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>
        <button type="submit">Zarejestruj</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="row">
        <span>Masz już konto?</span>
        <Link to="/login" className="link">Zaloguj się</Link>
      </div>
    </div>
  );
}
