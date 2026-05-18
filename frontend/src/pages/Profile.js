import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWatchlist();
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const res = await getWatchlist();
      setWatchlist(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
      setWatchlist(prev => prev.filter(item => item.movie_id !== movieId));
    } catch (err) {
      console.error(err);
    }
  };

  // Obtener todos los géneros únicos de la watchlist
  const allGenres = ['All', ...new Set(
    watchlist.flatMap(item =>
      item.genre ? item.genre.split(',').map(g => g.trim()) : []
    )
  )];

  const filtered = activeGenre === 'All'
    ? watchlist
    : watchlist.filter(item =>
        item.genre && item.genre.split(',').map(g => g.trim()).includes(activeGenre)
      );

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '600', color: '#fff', flexShrink: 0 }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0eeff' }}>{user?.email}</div>
              <div style={{ fontSize: '12px', color: '#4a4a68' }}>
                {watchlist.length} {watchlist.length === 1 ? 'film' : 'films'} saved
              </div>
            </div>
          </div>
        </div>

        {/* WATCHLIST */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#f0eeff' }}>
              My Watchlist
            </h2>
          </div>

          {/* GENRE FILTER */}
          {watchlist.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {allGenres.map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  style={{
                    fontSize: '12px', padding: '6px 14px', borderRadius: '99px',
                    border: '1px solid', cursor: 'pointer', fontFamily: 'inherit',
                    background: activeGenre === g ? 'rgba(83,74,183,0.2)' : 'transparent',
                    borderColor: activeGenre === g ? 'rgba(127,119,221,0.4)' : '#1e1e2e',
                    color: activeGenre === g ? '#a78bfa' : '#5a5a78',
                  }}
                >
                  {g} {g !== 'All' && `(${watchlist.filter(item => item.genre && item.genre.split(',').map(g2 => g2.trim()).includes(g)).length})`}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#3a3a58', fontSize: '14px' }}>
              Loading...
            </div>
          ) : watchlist.length === 0 ? (
            <div style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎬</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#f0eeff', marginBottom: '8px' }}>No films saved yet</div>
              <div style={{ fontSize: '13px', color: '#4a4a68', marginBottom: '24px' }}>Browse the catalog and save films you want to watch</div>
              <Link to="/">
                <button style={{ background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  Browse catalog
                </button>
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#3a3a58', fontSize: '14px' }}>
              No films in this genre.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {filtered.map(item => (
                <div key={item.watchlist_id} style={{ background: '#0e0e1a', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                  <Link to={`/movies/${item.movie_id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ width: '100%', aspectRatio: '2/3', background: 'linear-gradient(135deg,#0d0820,#1a1035)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {item.poster_url ? (
                        <img src={item.poster_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '36px' }}>🎬</span>
                      )}
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#e8e6ff', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#3a3a58', marginBottom: '4px' }}>{item.year}</div>
                      {item.genre && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {item.genre.split(',').map((g, i) => (
                            <span key={i} style={{ fontSize: '9px', background: 'rgba(83,74,183,0.1)', color: '#7f77dd', borderRadius: '99px', padding: '1px 6px' }}>
                              {g.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(item.movie_id)}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(8,8,16,0.8)', border: '1px solid rgba(163,45,45,0.4)', color: '#f09595', width: '28px', height: '28px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                    title="Remove from watchlist"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
