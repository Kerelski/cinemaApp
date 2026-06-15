import { useEffect, useMemo, useState } from 'react';
import { AlertMessage } from '../components/AlertMessage';
import { DashboardHeader } from '../components/DashboardHeader';
import { clearCart, getCart, removeCartItem } from '../services/cartService';
import { createReservation } from '../services/reservationService';

export function CartPage({ session, onLogout, onNavigate }) {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = session?.user?.roles?.includes('ADMIN');
  const items = cart?.items || [];

  const groupedItems = useMemo(() => {
    return items.reduce((groups, item) => {
      const key = String(item.screeningId);
      if (!groups[key]) {
        groups[key] = {
          screeningId: item.screeningId,
          movieId: item.movieId,
          movieTitle: item.movieTitle,
          moviePosterUrl: item.moviePosterUrl,
          screeningTime: item.screeningTime,
          room: item.room,
          pricePerSeat: item.price,
          seats: [],
        };
      }
      groups[key].seats.push(item);
      return groups;
    }, {});
  }, [items]);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    setLoading(true);
    setError('');

    try {
      setCart(await getCart(session));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveItem(item) {
    setError('');

    try {
      setCart(await removeCartItem(item.screeningId, item.seatNumber, session));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleClearCart() {
    setError('');

    try {
      await clearCart(session);
      setCart({ items: [], totalPrice: 0 });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCheckout() {
    if (items.length === 0) return;

    setSubmitting(true);
    setError('');

    try {
      const reservations = Object.values(groupedItems).map((group) =>
        createReservation({
          screeningId: group.screeningId,
          movieId: group.movieId,
          movieTitle: group.movieTitle,
          screeningTime: group.screeningTime,
          room: group.room,
          pricePerSeat: group.pricePerSeat,
          seatNumbers: group.seats.map((seat) => seat.seatNumber),
        }, session)
      );

      await Promise.all(reservations);
      await clearCart(session);
      setCart({ items: [], totalPrice: 0 });
      onNavigate('reservations');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'No date';

    return new Date(dateStr).toLocaleString('pl-PL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="app-shell">
      <DashboardHeader
        session={session}
        isAdmin={isAdmin}
        onLogout={onLogout}
        currentPage="cart"
        onNavigate={onNavigate}
      />
      <AlertMessage message={error} />

      <section className="cart-page">
        <div className="page-header">
          <div>
            <h2>Cart</h2>
            <p className="muted">
              {loading ? 'Loading...' : `${items.length} selected seats`}
            </p>
          </div>
          <div className="header-actions">
            <button type="button" className="ghost compact" onClick={loadCart}>
              Refresh
            </button>
            <button type="button" className="danger compact" disabled={items.length === 0} onClick={handleClearCart}>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <button type="button" onClick={() => onNavigate('screenings')}>
              Browse screenings
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {Object.values(groupedItems).map((group) => (
                <article key={group.screeningId} className="cart-group">
                  <div className="cart-group-header">
                    {group.moviePosterUrl ? (
                      <img className="cart-poster" src={group.moviePosterUrl} alt="" />
                    ) : (
                      <div className="cart-poster placeholder">{group.movieTitle?.slice(0, 1) || 'C'}</div>
                    )}
                    <div>
                      <h3>{group.movieTitle}</h3>
                      <p className="muted">
                        {formatDateTime(group.screeningTime)} - Room {group.room}
                      </p>
                    </div>
                    <strong>{(group.seats.length * group.pricePerSeat).toFixed(2)} PLN</strong>
                  </div>

                  <div className="cart-seat-list">
                    {group.seats.map((item) => (
                      <div key={`${item.screeningId}-${item.seatNumber}`} className="cart-seat-row">
                        <span>Seat {item.seatNumber}</span>
                        <span>{item.price?.toFixed(2)} PLN</span>
                        <button type="button" className="ghost compact" onClick={() => handleRemoveItem(item)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-checkout">
              <div>
                <span>Total</span>
                <strong>{cart.totalPrice?.toFixed(2)} PLN</strong>
              </div>
              <button type="button" disabled={submitting || items.length === 0} onClick={handleCheckout}>
                {submitting ? 'Creating reservations...' : 'Reserve selected seats'}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
