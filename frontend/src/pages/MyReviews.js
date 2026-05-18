import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MyReviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/my-reviews');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '600', color: '#fff', flexShrink: 0 }}>
            {(user?.username || user?.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0eeff' }}>{user?.username || user?.email}</div>
            <div style={{ fontSize: '12px', color: '#4a4a68' }}>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} written</div>
          </div>
        </div>

        <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#f0eeff', marginBottom: '20px' }}>My Reviews</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#3a3a58', fontSize: '14px' }}>Loading...</div>
        ) : reviews.length === 0 ? (
          <div style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⭐</div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#f0eeff', marginBottom: '8px' }}>No reviews yet</div>
            <div style={{ fontSize: '13px', color: '#4a4a68', marginBottom: '24px' }}>Start watching films and share your opinion</div>
            <Link to="/">
              <button style={{ background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                Browse catalog
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map(review => (
              <Link key={review.id} to={`/movies/${review.movie_id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#534ab7'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
                >
                  <div style={{ width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg,#0d0820,#1a1035)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {review.poster_url ? (
                      <img src={review.poster_url} alt={review.movie_title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '20px' }}>🎬</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0eeff', marginBottom: '4px' }}>{review.movie_title}</div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ fontSize: '13px', color: s <= review.score ? '#ef9f27' : '#2a2a3e' }}>★</span>
                      ))}
                      <span style={{ fontSize: '12px', color: '#5a5a78', marginLeft: '6px' }}>{review.score}/5</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#9998b3', lineHeight: '1.6' }}>{review.body}</div>
                    <div style={{ fontSize: '11px', color: '#3a3a58', marginTop: '8px' }}>
                      {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}