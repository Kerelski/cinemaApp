export function MovieCard({ movie, isAdmin, onSelect, onEdit, onDelete }) {
  return (
    <article className="movie-card">
      {movie.posterUrl ? (
        <img src={movie.posterUrl} alt="" />
      ) : (
        <div className="poster-placeholder">{movie.title?.slice(0, 1) || 'C'}</div>
      )}
      <div className="movie-content">
        <div>
          <h3>{movie.title}</h3>
          <p className="meta">
            {[movie.releaseYear, movie.director, movie.rating ? `${movie.rating}/10` : null].filter(Boolean).join(' | ')}
          </p>
          {movie.description && <p>{movie.description}</p>}
        </div>
        <div className="card-actions">
          <button type="button" className="ghost compact" onClick={() => onSelect(movie)}>
            Reviews
          </button>
          {isAdmin && (
            <>
              <button type="button" className="secondary compact" onClick={() => onEdit(movie)}>
                Edit
              </button>
              <button type="button" className="danger compact" onClick={() => onDelete(movie.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
