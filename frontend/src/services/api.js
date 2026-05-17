import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Agrega el token automáticamente a cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (email, password) =>
  api.post('/auth/register', { email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// Movies
export const getMovies = (page = 1, genre = '') =>
  api.get(`/movies?page=${page}&genre=${genre}`);

export const getMovie = (id) =>
  api.get(`/movies/${id}`);

export const createMovie = (data) =>
  api.post('/movies', data);

export const updateMovie = (id, data) =>
  api.put(`/movies/${id}`, data);

export const deleteMovie = (id) =>
  api.delete(`/movies/${id}`);

// Reviews
export const getReviews = (movieId) =>
  api.get(`/movies/${movieId}/reviews`);

export const createReview = (movieId, data) =>
  api.post(`/movies/${movieId}/reviews`, data);

export const updateReview = (id, data) =>
  api.put(`/reviews/${id}`, data);

export const deleteReview = (id) =>
  api.delete(`/reviews/${id}`);

export default api;
// Watchlist
export const getWatchlist = () =>
  api.get('/watchlist');

export const addToWatchlist = (movieId) =>
  api.post(`/watchlist/${movieId}`);

export const removeFromWatchlist = (movieId) =>
  api.delete(`/watchlist/${movieId}`);

export const checkWatchlist = (movieId) =>
  api.get(`/watchlist/check/${movieId}`);