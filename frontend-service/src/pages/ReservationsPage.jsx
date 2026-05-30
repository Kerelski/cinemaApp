import { useEffect, useState } from 'react';
import { AlertMessage } from '../components/AlertMessage';
import { DashboardHeader } from '../components/DashboardHeader';
import { ReservationCard } from '../components/ReservationCard';
import { 
  getMyReservations, 
  getAllReservations, 
  cancelReservation, 
  adminCancelReservation 
} from '../services/reservationService';

export function ReservationsPage({ session, onLogout, onNavigate }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  const isAdmin = session?.user?.roles?.includes('ADMIN');

  useEffect(() => {
    loadReservations();
  }, [showAll]);

  async function loadReservations() {
    setLoading(true);
    setError('');

    try {
      const data = (showAll && isAdmin) 
        ? await getAllReservations(session)
        : await getMyReservations(session);
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelReservation(reservationId) {
    setError('');

    try {
      if (showAll && isAdmin) {
        await adminCancelReservation(reservationId, session);
      } else {
        await cancelReservation(reservationId, session);
      }
      
      setReservations(current =>
        current.map(r =>
          r.id === reservationId ? { ...r, status: 'CANCELLED' } : r
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  const activeReservations = reservations.filter(r => r.status !== 'CANCELLED');
  const cancelledReservations = reservations.filter(r => r.status === 'CANCELLED');

  return (
    <main className="app-shell">
      <DashboardHeader 
        session={session} 
        isAdmin={isAdmin} 
        onLogout={onLogout}
        currentPage="reservations"
        onNavigate={onNavigate}
      />
      <AlertMessage message={error} />

      <section className="reservations-page">
        <div className="page-header">
          <div>
            <h2>{showAll && isAdmin ? 'All reservations' : 'My reservations'}</h2>
            <p className="muted">
              {loading ? 'Loading...' : `${reservations.length} reservations`}
            </p>
          </div>
          <div className="header-actions">
            {isAdmin && (
              <button 
                type="button" 
                className={showAll ? 'secondary compact' : 'ghost compact'}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'My reservations' : 'All'}
              </button>
            )}
            <button type="button" className="ghost compact" onClick={loadReservations}>
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading reservations...</p>
        ) : reservations.length === 0 ? (
          <div className="empty-state">
            <p>You do not have any reservations yet.</p>
            <button type="button" onClick={() => onNavigate('screenings')}>
              Browse screenings
            </button>
          </div>
        ) : (
          <>
            {activeReservations.length > 0 && (
              <div className="reservations-section">
                <h3>Active reservations</h3>
                <div className="reservations-grid">
                  {activeReservations.map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancel={handleCancelReservation}
                      canCancel={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {cancelledReservations.length > 0 && (
              <div className="reservations-section">
                <h3>Canceled reservations</h3>
                <div className="reservations-grid">
                  {cancelledReservations.map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancel={handleCancelReservation}
                      canCancel={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
