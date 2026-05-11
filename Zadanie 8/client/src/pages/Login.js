import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, SERVER_URL } from '../api';

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      onAuth(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd logowania');
    }
  };

  // OAuth2 - klient KIERUJE na endpoint serwera (nie tworzy klienta OAuth bezpośrednio)
  const oauthGoogle = () => { window.location.href = `${SERVER_URL}/auth/google`; };
  const oauthGithub = () => { window.location.href = `${SERVER_URL}/auth/github`; };

  return (
    <div className="container">
      <h1>Logowanie</h1>
      <form onSubmit={submit}>
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Hasło
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Zaloguj</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="divider">— lub —</div>
      <button className="google" onClick={oauthGoogle}>Zaloguj przez Google</button>
      <button className="github" onClick={oauthGithub}>Zaloguj przez GitHub</button>
      <div className="row">
        <span>Nie masz konta?</span>
        <Link to="/register" className="link">Zarejestruj się</Link>
      </div>
    </div>
  );
}
