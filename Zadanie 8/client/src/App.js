import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OAuthSuccess from './pages/OAuthSuccess';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={token ? <Dashboard onLogout={logout} /> : <Login onAuth={setToken} />} />
      <Route path="/login" element={<Login onAuth={setToken} />} />
      <Route path="/register" element={<Register onAuth={setToken} />} />
      <Route path="/oauth-success" element={<OAuthSuccess onAuth={setToken} />} />
      <Route path="*" element={<Link to="/">strona główna</Link>} />
    </Routes>
  );
}
