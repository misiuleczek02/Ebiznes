import axios from 'axios';

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

export const api = axios.create({ baseURL: SERVER_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
