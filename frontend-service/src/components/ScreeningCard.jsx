export function ScreeningCard({ screening, onBook }) {
  const startTime = new Date(screening.startTime);
  const endTime = screening.endTime ? new Date(screening.endTime) : null;

  const formatTime = (date) => {
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <article className="screening-card">
      <div className="screening-time">
        <span className="date">{formatDate(startTime)}</span>
        <span className="time">{formatTime(startTime)}</span>
        {endTime && (
          <span className="duration">do {formatTime(endTime)}</span>
        )}
      </div>
      <div className="screening-details">
        <div className="screening-info">
          <span className="room">{screening.room}</span>
          <span className="price">{screening.price?.toFixed(2)} PLN</span>
        </div>
        {screening.movieTitle && (
          <span className="movie-title">{screening.movieTitle}</span>
        )}
      </div>
      <button type="button" className="compact" onClick={() => onBook(screening)}>
        Reserve
      </button>
    </article>
  );
}
