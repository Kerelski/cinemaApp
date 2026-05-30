export function ReservationCard({ reservation, onCancel, canCancel }) {
  const screeningTime = new Date(reservation.screeningTime);
  const createdAt = new Date(reservation.createdAt);
  const isPast = screeningTime < new Date();
  const isCancelled = reservation.status === 'CANCELLED';

  const formatDateTime = (date) => {
    return date.toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = () => {
    if (isCancelled) return 'status-cancelled';
    if (isPast) return 'status-past';
    return 'status-confirmed';
  };

  const getStatusText = () => {
    if (isCancelled) return 'Canceled';
    if (isPast) return 'Completed';
    return 'Confirmed';
  };

  return (
    <article className={`reservation-card ${getStatusClass()}`}>
      <div className="reservation-header">
        <h3>{reservation.movieTitle}</h3>
        <span className={`status-badge ${getStatusClass()}`}>{getStatusText()}</span>
      </div>
      
      <div className="reservation-details">
        <div className="detail-row">
          <span className="label">Screening:</span>
          <span className="value">{formatDateTime(screeningTime)}</span>
        </div>
        <div className="detail-row">
          <span className="label">Room:</span>
          <span className="value">{reservation.room}</span>
        </div>
        <div className="detail-row">
          <span className="label">Seats:</span>
          <span className="value seats">{reservation.seatNumbers?.join(', ')}</span>
        </div>
        <div className="detail-row">
          <span className="label">Price:</span>
          <span className="value price">{reservation.totalPrice?.toFixed(2)} PLN</span>
        </div>
        <div className="detail-row muted">
          <span className="label">Reservation:</span>
          <span className="value">{formatDateTime(createdAt)}</span>
        </div>
      </div>

      {canCancel && !isCancelled && !isPast && (
        <div className="reservation-actions">
          <button 
            type="button" 
            className="danger compact" 
            onClick={() => onCancel(reservation.id)}
          >
            Cancel reservation
          </button>
        </div>
      )}
    </article>
  );
}
