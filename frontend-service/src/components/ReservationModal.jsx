import { useState, useEffect } from 'react';
import { SeatSelector } from './SeatSelector';
import { addCartItem } from '../services/cartService';
import { getScreeningSeats } from '../services/reservationService';

export function ReservationModal({ screening, session, onClose, onSuccess }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const pricePerSeat = screening.price || 25;
  const totalPrice = selectedSeats.length * pricePerSeat;

  useEffect(() => {
    loadSeats();
  }, [screening.id]);

  async function loadSeats() {
    setLoading(true);
    setError('');
    try {
      const response = await getScreeningSeats(screening.id, session);
      setSeats(response.seats || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSeatToggle(seatNumber) {
    setSelectedSeats(current => {
      if (current.includes(seatNumber)) {
        return current.filter(s => s !== seatNumber);
      }
      return [...current, seatNumber];
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (selectedSeats.length === 0) {
      setError('Choose at least one seat');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      for (const seatNumber of selectedSeats) {
        await addCartItem({
          screeningId: screening.id,
          seatNumber,
          movieId: screening.movieId,
          movieTitle: screening.movieTitle,
          moviePosterUrl: screening.moviePosterUrl,
          screeningTime: screening.startTime,
          room: screening.room,
          price: pricePerSeat,
        }, session);
      }
      
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          {screening.moviePosterUrl && (
            <img className="modal-poster" src={screening.moviePosterUrl} alt="" />
          )}
          <div>
            <h2>Seat reservation</h2>
            <p className="muted">{screening.movieTitle}</p>
          </div>
          <button type="button" className="ghost compact" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="screening-summary">
          <div className="summary-item">
            <span className="label">Date and time:</span>
            <span className="value">{formatDateTime(screening.startTime)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Room:</span>
            <span className="value">{screening.room}</span>
          </div>
          <div className="summary-item">
            <span className="label">Price:</span>
            <span className="value">{pricePerSeat.toFixed(2)} PLN</span>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        {loading ? (
          <p className="muted">Loading seats...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <SeatSelector
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
            />

            <div className="reservation-summary">
              <div className="selected-info">
                <span>Chosen seats: </span>
                <strong>{selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'Not found'}</strong>
              </div>
              <div className="total-price">
                <span>Total: </span>
                <strong>{totalPrice.toFixed(2)} PLN</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="ghost" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting || selectedSeats.length === 0}
              >
                {submitting ? 'Adding...' : 'Add to cart'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
