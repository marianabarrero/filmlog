import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie, getMovies, updateMovie, deleteMovie } from '../services/api';
import { useAuth } from '../context/AuthContext';

const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-fi', 'Thriller', 'Western'];

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState({
    title: '', genre: '', year: '', synopsis: '', poster_url: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchMovies();
  }, [user]);

  const fetchMovies = async () => {
    try {
      const res = await getMovies(1, '');
      setMovies(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddGenre = (val) => {
    if (!val) return;
    const current = form.genre ? form.genre.split(',').map(g => g.trim()).filter(Boolean) : [];
    if (!current.includes(val)) {
      setForm({ ...form, genre: [...current, val].join(', ') });
    }
  };

  const handleRemoveGenre = (index) => {
    const updated = form.genre.split(',').map(g => g.trim()).filter((_, i) => i !== index);
    setForm({ ...form, genre: updated.join(', ') });
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setForm({
      title: movie.title,
      genre: movie.genre || '',
      year: movie.year.toString(),
      synopsis: movie.synopsis || '',
      poster_url: movie.poster_url || '',
    });
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setForm({ title: '', genre: '', year: '', synopsis: '', poster_url: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.genre) {
      setError('Please select at least one genre');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const data = {
        title: form.title,
        genre: form.genre,
        year: parseInt(form.year),
        synopsis: form.synopsis,
        poster_url: form.poster_url || null,
      };
      if (editingMovie) {
        await updateMovie(editingMovie.id, data);
        setSuccess(`"${form.title}" updated successfully!`);
        setEditingMovie(null);
      } else {
        await createMovie(data);
        setSuccess(`"${form.title}" added successfully!`);
      }
      setForm({ title: '', genre: '', year: '', synopsis: '', poster_url: '' });
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving movie');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteMovie(id);
      if (editingMovie?.id === id) handleCancelEdit();
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.detail || 'Cannot delete movie');
    }
  };

  const inputStyle = {
    width: '100%', background: '#080810', border: '1px solid #2a2a3e',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    color: '#f0eeff', outline: 'none', fontFamily: 'inherit',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '500', color: '#5a5a78',
    display: 'block', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  const selectedGenres = form.genre ? form.genre.split(',').map(g => g.trim()).filter(Boolean) : [];

  return (
    <div style={{ minHeight: '100vh', background: '#080810', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(83,74,183,0.15)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: '99px', padding: '4px 14px', fontSize: '11px', color: '#a78bfa', marginBottom: '12px' }}>
            🛡 Admin Panel
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#f0eeff', letterSpacing: '-0.4px' }}>
            Manage catalog
          </h1>
          <p style={{ fontSize: '13px', color: '#4a4a68', marginTop: '6px' }}>
            Add, edit or remove films from the MovieVerse catalog.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* FORM */}
          <div style={{ background: '#0e0e1a', border: `1px solid ${editingMovie ? '#534ab7' : '#2a2a3e'}`, borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#f0eeff' }}>
                {editingMovie ? `✏️ Editing: ${editingMovie.title}` : 'Add new film'}
              </h2>
              {editingMovie && (
                <button onClick={handleCancelEdit} style={{ background: 'transparent', border: '1px solid #2a2a3e', color: '#5a5a78', padding: '5px 12px', borderRadius: '7px', fontSize: '12px', cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>

            {error && (
              <div style={{ background: 'rgba(163,45,45,0.15)', border: '1px solid rgba(163,45,45,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f09595', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: 'rgba(15,110,86,0.15)', border: '1px solid rgba(15,110,86,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#5dcaa5', marginBottom: '16px' }}>
                ✓ {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input name="title" value={form.title} onChange={handleChange} required  style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Year</label>
                  <input name="year" value={form.year} onChange={handleChange} required type="number"   style={inputStyle} />
                </div>
              </div>

              {/* GENRE SELECTOR */}
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Genre</label>
                <select
                  onChange={(e) => handleAddGenre(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value=""
                >
                  <option value="">+ Add genre</option>
                  {GENRES.filter(g => !selectedGenres.includes(g)).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {selectedGenres.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {selectedGenres.map((g, i) => (
                      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(83,74,183,0.15)', border: '1px solid rgba(127,119,221,0.4)', borderRadius: '99px', padding: '4px 10px', fontSize: '12px', color: '#a78bfa' }}>
                        {g}
                        <span onClick={() => handleRemoveGenre(i)} style={{ cursor: 'pointer', fontSize: '14px', color: '#7f77dd', lineHeight: 1 }}>×</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Synopsis</label>
                <textarea name="synopsis" value={form.synopsis} onChange={handleChange} placeholder="Brief description..." style={{ ...inputStyle, resize: 'vertical' }} rows={3} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Poster URL</label>
                <input name="poster_url" value={form.poster_url} onChange={handleChange} placeholder="https://..." style={inputStyle} />
                <div style={{ fontSize: '11px', color: '#3a3a58', marginTop: '4px' }}>
                  Upload image to S3 and paste the Object URL
                </div>
                {form.poster_url && (
                  <img src={form.poster_url} alt="preview" style={{ width: '80px', marginTop: '8px', borderRadius: '6px', border: '1px solid #2a2a3e' }} onError={e => e.target.style.display = 'none'} />
                )}
              </div>

              <button type="submit" disabled={submitting} style={{ width: '100%', background: editingMovie ? 'linear-gradient(135deg,#0f6e56,#1d9e75)' : 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '12px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Saving...' : editingMovie ? '✓ Save changes' : '+ Add film'}
              </button>
            </form>
          </div>

          {/* MOVIES LIST */}
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#f0eeff', marginBottom: '16px' }}>
              Current catalog ({movies.length})
            </h2>
            {loading ? (
              <div style={{ color: '#3a3a58', fontSize: '14px' }}>Loading...</div>
            ) : movies.length === 0 ? (
              <div style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#3a3a58', fontSize: '14px' }}>
                No films yet. Add one!
              </div>
            ) : (
              movies.map(movie => (
                <div key={movie.id} style={{ background: editingMovie?.id === movie.id ? 'rgba(83,74,183,0.08)' : '#0e0e1a', border: `1px solid ${editingMovie?.id === movie.id ? '#534ab7' : '#1e1e2e'}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '48px', background: 'linear-gradient(135deg,#0d0820,#1a1035)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {movie.poster_url ? (
                        <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <span style={{ fontSize: '16px' }}>🎬</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#e8e6ff' }}>{movie.title}</div>
                      <div style={{ fontSize: '11px', color: '#3a3a58' }}>{movie.year} · {movie.genre}</div>
                      <div style={{ fontSize: '11px', color: '#5a5a78' }}>
                        {movie.avg_score ? `★ ${movie.avg_score.toFixed(1)}` : 'No reviews'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => handleEdit(movie)} style={{ background: 'rgba(83,74,183,0.1)', border: '1px solid rgba(127,119,221,0.25)', color: '#a78bfa', padding: '6px 12px', borderRadius: '7px', fontSize: '11px', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(movie.id, movie.title)} style={{ background: 'rgba(163,45,45,0.1)', border: '1px solid rgba(163,45,45,0.25)', color: '#f09595', padding: '6px 12px', borderRadius: '7px', fontSize: '11px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}