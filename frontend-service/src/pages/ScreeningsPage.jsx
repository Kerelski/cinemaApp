import { useEffect, useState } from 'react';
import { AlertMessage } from '../components/AlertMessage';
import { DashboardHeader } from '../components/DashboardHeader';
import { ScreeningForm } from '../components/ScreeningForm';
import { ScreeningList } from '../components/ScreeningList';
import { ReservationModal } from '../components/ReservationModal';
import { emptyScreening } from '../constants/forms';
import { getMovies } from '../services/movieService';
import {
  getUpcomingScreenings,
  createScreening,
  updateScreening,
  deleteScreening,
} from '../services/screeningService';

export function ScreeningsPage({ session, onLogout, onNavigate }) {
  const [screenings, setScreenings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screeningForm, setScreeningForm] = useState(emptyScreening);
  const [editingScreeningId, setEditingScreeningId] = useState(null);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = session?.user?.roles?.includes('ADMIN');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [screeningsData, moviesData] = await Promise.all([
        getUpcomingScreenings(session),
        getMovies(session),
      ]);
      setScreenings(screeningsData);
      setMovies(moviesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleScreeningSubmit(event) {
    event.preventDefault();

    if (!isAdmin) return;

    setSaving(true);
    setError('');

    try {
      const savedScreening = editingScreeningId
        ? await updateScreening(editingScreeningId, screeningForm, session)
        : await createScreening(screeningForm, session);

      if (editingScreeningId) {
        setScreenings(current =>
          current.map(s => (s.id === savedScreening.id ? savedScreening : s))
        );
      } else {
        setScreenings(current => [...current, savedScreening].sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        ));
      }
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteScreening(screeningId) {
    if (!isAdmin) return;

    setSaving(true);
    setError('');

    try {
      await deleteScreening(screeningId, session);
      setScreenings(current => current.filter(s => s.id !== screeningId));
      if (editingScreeningId === screeningId) {
        cancelEdit();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(screening) {
    setEditingScreeningId(screening.id);
    const startTime = new Date(screening.startTime);
    startTime.setMinutes(startTime.getMinutes() - startTime.getTimezoneOffset());
    
    setScreeningForm({
      movieId: String(screening.movieId),
      startTime: startTime.toISOString().slice(0, 16),
      room: screening.room || '',
      price: String(screening.price || '25'),
    });
  }

  function cancelEdit() {
    setEditingScreeningId(null);
    setScreeningForm(emptyScreening);
  }

  function updateScreeningField(event) {
    const { name, value } = event.target;
    setScreeningForm(current => ({ ...current, [name]: value }));
  }

  function handleBookScreening(screening) {
    setSelectedScreening(screening);
  }

  function handleReservationSuccess() {
    setSelectedScreening(null);
    onNavigate('reservations');
  }

  return (
    <main className="app-shell">
      <DashboardHeader 
        session={session} 
        isAdmin={isAdmin} 
        onLogout={onLogout}
        currentPage="screenings"
        onNavigate={onNavigate}
      />
      <AlertMessage message={error} />

      <section className={isAdmin ? 'workspace' : 'workspace read-only'}>
        {isAdmin && (
          <ScreeningForm
            form={screeningForm}
            movies={movies}
            editingScreeningId={editingScreeningId}
            saving={saving}
            onChange={updateScreeningField}
            onCancelEdit={cancelEdit}
            onSubmit={handleScreeningSubmit}
          />
        )}

        <ScreeningList
          screenings={screenings}
          loading={loading}
          isAdmin={isAdmin}
          onRefresh={loadData}
          onBook={handleBookScreening}
          onEdit={startEdit}
          onDelete={handleDeleteScreening}
        />
      </section>

      {selectedScreening && (
        <ReservationModal
          screening={selectedScreening}
          session={session}
          onClose={() => setSelectedScreening(null)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </main>
  );
}
