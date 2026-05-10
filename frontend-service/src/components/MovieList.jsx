import { MovieCard } from './MovieCard';

export function MovieList({ movies, loading, isAdmin, onRefresh, onSelect, onEdit, onDelete }) {
  return (
    <section className="movie-list" aria-live="polite">
      <div className="list-header">
        <h2>Movies</h2>
        <button type="button" className="secondary" onClick={onRefresh} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className="muted">No movies found.</p>
      ) : (
        <div className="cards">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id ?? movie.title}
              movie={movie}
              isAdmin={isAdmin}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
