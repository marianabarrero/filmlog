import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie, getReviews, createReview, updateReview, deleteReview, deleteMovie } from '../services/api';
import { checkWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(5);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editScore, setEditScore] = useState(5);
  const [editBody, setEditBody] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [movieRes, reviewsRes] = await Promise.all([getMovie(id), getReviews(id)]);
      setMovie(movieRes.data);
      setReviews(reviewsRes.data);
      if (user) {
        const wRes = await checkWatchlist(id);
        setInWatchlist(wRes.data.in_watchlist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createReview(id, { score, body });
      setBody('');
      setScore(5);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || 'Cannot delete movie');
    }
  };

  const handleEditReview = async (reviewId) => {
    try {
      await updateReview(reviewId, { score: editScore, body: editBody });
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error updating review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await deleteReview(reviewId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error deleting review');
    }
  };

  const handleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await removeFromWatchlist(id);
        setInWatchlist(false);
      } else {
        await addToWatchlist(id);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const userReview = reviews.find(r => r.user_id === user?.id);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
     const handleResize = () => setIsMobile(window.innerWidth < 768);
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
    }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a3a58', fontSize: '14px' }}>
      Loading...
    </div>
  );

  if (!movie) return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a3a58', fontSize: '14px' }}>
      Movie not found.
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080810', padding: isMobile ? '16px' : '32px' }}>
      <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid #2a2a3e', color: '#5a5a78', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '24px', cursor: 'pointer' }}>
        ← Back
      </button>

      {/* MOVIE DETAIL */}
      <div style={{ background: '#0e0e1a', border: '1px solid #2a2a3e', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
        <div className="movie-detail-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr' }}>
          <div style={{ background: 'linear-gradient(135deg,#0d0820,#1a1035)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? '240px' : '280px' }}>
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: isMobile ? '240px' : '100%' }} />
            ) : (
              <span style={{ fontSize: '48px' }}>🎬</span>
            )}
          </div>
          <div style={{ padding: isMobile ? '16px' : '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: '600', color: '#f0eeff', marginBottom: '6px' }}>{movie.title}</h1>
                <div style={{ fontSize: '13px', color: '#5a5a78', marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <span>{movie.year}</span>
                  {movie.genre && movie.genre.split(',').map((g, i) => (
                    <span key={i} style={{ background: 'rgba(83,74,183,0.15)', border: '1px solid rgba(127,119,221,0.2)', borderRadius: '99px', padding: '2px 10px', fontSize: '11px', color: '#a78bfa' }}>
                      {g.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {user?.role === 'admin' && (
                  <button onClick={handleDelete} style={{ background: 'rgba(163,45,45,0.15)', border: '1px solid rgba(163,45,45,0.3)', color: '#f09595', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    🗑 Delete
                  </button>
                )}
                {user && user.role !== 'admin' && (
                  <button onClick={handleWatchlist} style={{ background: inWatchlist ? 'rgba(83,74,183,0.2)' : 'transparent', border: `1px solid ${inWatchlist ? 'rgba(127,119,221,0.5)' : '#2a2a3e'}`, color: inWatchlist ? '#a78bfa' : '#5a5a78', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    {inWatchlist ? '★ Saved' : '☆ Save'}
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: '18px', color: movie.avg_score && s <= Math.round(movie.avg_score) ? '#ef9f27' : '#2a2a3e' }}>★</span>
              ))}
              <span style={{ fontSize: '14px', color: '#5a5a78', marginLeft: '8px' }}>
                {movie.avg_score ? `${movie.avg_score.toFixed(1)} · ${reviews.length} reviews` : 'No reviews yet'}
              </span>
            </div>
            {movie.synopsis && (
              <p style={{ fontSize: '14px', color: '#5a5a78', lineHeight: '1.7' }}>{movie.synopsis}</p>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (user?.role === 'admin' ? '1fr' : '1fr 1fr'), gap: '24px' }}>
        {/* REVIEWS LIST */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#5a5a78', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Community reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#3a3a58', fontSize: '14px' }}>
              No reviews yet. Be the first!
            </div>
          ) : (
            reviews.map(r => (
              <div key={r.id} style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                {editingId === r.id ? (
                  <div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} onClick={() => setEditScore(s)} style={{ fontSize: '20px', cursor: 'pointer', color: s <= editScore ? '#ef9f27' : '#2a2a3e' }}>★</span>
                      ))}
                    </div>
                    <textarea value={editBody} onChange={e => setEditBody(e.target.value)} style={{ width: '100%', background: '#080810', border: '1px solid #2a2a3e', borderRadius: '8px', padding: '10px', fontSize: '13px', color: '#f0eeff', outline: 'none', resize: 'vertical', marginBottom: '8px' }} rows={3} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditReview(r.id)} style={{ background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: 'transparent', border: '1px solid #2a2a3e', color: '#5a5a78', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ fontSize: '13px', color: s <= r.score ? '#ef9f27' : '#2a2a3e' }}>★</span>
                        ))}
                      </div>
                      {user && r.user_id === user.id && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => { setEditingId(r.id); setEditScore(r.score); setEditBody(r.body); }} style={{ background: 'transparent', border: '1px solid #2a2a3e', color: '#5a5a78', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDeleteReview(r.id)} style={{ background: 'transparent', border: '1px solid rgba(163,45,45,0.3)', color: '#f09595', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: '#9998b3', lineHeight: '1.6' }}>{r.body}</p>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* WRITE REVIEW */}
        {user?.role !== 'admin' && (
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#5a5a78', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Write a review
            </h2>
            {!user ? (
              <div style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                <p style={{ color: '#3a3a58', fontSize: '14px', marginBottom: '16px' }}>Sign in to write a review</p>
                <button onClick={() => navigate('/login')} style={{ background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '9px', fontSize: '13px', cursor: 'pointer' }}>Sign in</button>
              </div>
            ) : userReview ? (
              <div style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#5a5a78', fontSize: '14px' }}>
                You already reviewed this film. Edit it from the list.
              </div>
            ) : (
              <div style={{ background: '#0e0e1a', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '20px' }}>
                {error && <div style={{ background: 'rgba(163,45,45,0.15)', border: '1px solid rgba(163,45,45,0.3)', borderRadius: '8px', padding: '10px', fontSize: '13px', color: '#f09595', marginBottom: '16px' }}>{error}</div>}
                <form onSubmit={handleReview}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '500', color: '#5a5a78', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your score</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} onClick={() => setScore(s)} style={{ fontSize: '28px', cursor: 'pointer', color: s <= score ? '#ef9f27' : '#2a2a3e', transition: 'color 0.15s' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '500', color: '#5a5a78', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your review</label>
                    <textarea value={body} onChange={e => setBody(e.target.value)} required placeholder="Share your thoughts about this film..." style={{ width: '100%', background: '#080810', border: '1px solid #2a2a3e', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#f0eeff', outline: 'none', resize: 'vertical' }} rows={4} />
                  </div>
                  <button type="submit" disabled={submitting} style={{ width: '100%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '12px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Submitting...' : 'Submit review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}