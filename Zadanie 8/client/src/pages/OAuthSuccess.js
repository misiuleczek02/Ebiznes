import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Endpoint na ktory serwer redirectuje po wymianie code z dostawca.
// Otrzymuje WLASNY token serwera (nie token od Google/GitHub), zapisuje go i przechodzi do dashboard.
export default function OAuthSuccess({ onAuth }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');
    if (error) {
      alert('Błąd OAuth: ' + error);
      navigate('/login');
      return;
    }
    if (token) {
      localStorage.setItem('token', token);
      onAuth(token);
      navigate('/');
    }
  }, [params, navigate, onAuth]);

  return <div className="container"><p>Logowanie OAuth2 w toku…</p></div>;
}
