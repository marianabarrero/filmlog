import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/api';

const GENRES = ['All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-fi', 'Thriller'];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [genre, page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await getMovies(page, genre);
      setMovies(res.data.results);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / 10);

  return (
    <div style={{ minHeight: '100vh' }}>

     {/* HERO */}
     <div style={{ position: 'relative', padding: '72px 32px 48px', textAlign: 'center', overflow: 'hidden' }}>
         <div style={{ position: 'relative', zIndex: 1 }}>
             <h1 style={{ fontSize: '52px', fontWeight: '700', color: '#f0eeff', lineHeight: '1.15', marginBottom: '16px', letterSpacing: '-1px' }}>
                 Discover films<br />
                 <span style={{ background: 'linear-gradient(90deg,#c084fc,#a78bfa,#7f77dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>worth watching</span>
              </h1>
              <p style={{ fontSize: '16px', color: '#6b6a88', marginBottom: '40px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 40px' }}>
                 A curated catalog rated by real cinephiles<br />Find your next favorite film
              </p>
                {/* SEARCH */}
                <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
                  <input
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     placeholder="Search by title..."
                     style={{
                         width: '100%',
                         background: 'rgba(83,74,183,0.1)',
                         border: '1.5px solid rgba(127,119,221,0.4)',
                         borderRadius: '12px',
                         padding: '14px 52px 14px 20px',
                         fontSize: '15px',
                         color: '#f0eeff',
                         outline: 'none',
                         fontFamily: 'inherit',
                         boxShadow: '0 0 30px rgba(83,74,183,0.15)',
                       }}
                   />
                   <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                   </div>
                </div>
          </div>
      </div>


      {/* GENRE TABS */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 32px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {GENRES.map(g => (
          <button
            key={g}
            onClick={() => { setGenre(g === 'All' ? '' : g); setPage(1); }}
            style={{
              fontSize: '12px', padding: '7px 16px', borderRadius: '99px',
              border: '1px solid', cursor: 'pointer', fontFamily: 'inherit',
              background: (genre === (g === 'All' ? '' : g)) ? 'rgba(83,74,183,0.2)' : 'transparent',
              borderColor: (genre === (g === 'All' ? '' : g)) ? 'rgba(127,119,221,0.4)' : '#1e1e2e',
              color: (genre === (g === 'All' ? '' : g)) ? '#a78bfa' : '#5a5a78',
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* GRID LABEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: '500', color: '#3a3a58', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {total} films
        </span>
      </div>

      {/* MOVIES GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#3a3a58', fontSize: '14px' }}>
          Loading films...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#3a3a58', fontSize: '14px' }}>
          No films found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', padding: '0 32px 32px' }}>
          {filtered.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

    </div>
  );
}

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'rgba(14,14,26,0.85)',
          border: `1px solid ${hovered ? '#534ab7' : 'rgba(127,119,221,0.1)'}`,
          borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: 'all 0.25s ease',
          boxShadow: hovered ? '0 20px 40px rgba(83,74,183,0.3)' : 'none',
        }}
      >
        <div style={{ width: '100%', aspectRatio: '2/3', background: 'linear-gradient(135deg,#0d0820,#1a1035)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {movie.poster_url ? (
            <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '36px' }}>🎬</span>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(14,14,26,0.9) 0%,transparent 50%)', zIndex: 1 }} />
        </div>

        <div style={{ padding: '10px 12px', height: '80px', overflow: 'hidden' }}>
          <div style={{ fontSize: '13px', fontWeight: '500', color: '#e8e6ff', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {movie.title}
          </div>
          <div style={{ fontSize: '11px', color: '#3a3a58', marginBottom: '6px', display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center' }}>
            <span>{movie.year}</span>
            {movie.genre && movie.genre.split(',').slice(0, 2).map((g, i) => (
              <span key={i} style={{ background: 'rgba(83,74,183,0.1)', borderRadius: '99px', padding: '1px 6px', fontSize: '10px', color: '#7f77dd' }}>
                {g.trim()}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: '11px', color: movie.avg_score && s <= Math.round(movie.avg_score) ? '#ef9f27' : '#2a2a3e' }}>★</span>
            ))}
            <span style={{ fontSize: '11px', color: '#5a5a78', marginLeft: '4px' }}>
              {movie.avg_score ? movie.avg_score.toFixed(1) : 'No reviews'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}