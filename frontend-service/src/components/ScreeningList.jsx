import { ScreeningCard } from './ScreeningCard';

export function ScreeningList({ screenings, loading, isAdmin, onRefresh, onBook, onEdit, onDelete }) {
  const groupedScreenings = screenings.reduce((acc, screening) => {
    const date = new Date(screening.startTime).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(screening);
    return acc;
  }, {});

  return (
    <section className="movie-list">
      <div className="list-header">
        <h2>Screenings</h2>
        <button type="button" className="ghost compact" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading screenings...</p>
      ) : screenings.length === 0 ? (
        <p className="muted">No screenings available</p>
      ) : (
        <div className="screenings-grouped">
          {Object.entries(groupedScreenings).map(([date, dayScreenings]) => (
            <div key={date} className="screening-day">
              <h3 className="day-header">{date}</h3>
              <div className="cards">
                {dayScreenings.map(screening => (
                  <div key={screening.id} className="screening-item">
                    <ScreeningCard screening={screening} onBook={onBook} />
                    {isAdmin && (
                      <div className="admin-actions">
                        <button 
                          type="button" 
                          className="secondary compact" 
                          onClick={() => onEdit(screening)}
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          className="danger compact" 
                          onClick={() => onDelete(screening.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
