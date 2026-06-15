import { useEffect, useMemo, useState } from 'react';
import { AlertMessage } from '../components/AlertMessage';
import { DashboardHeader } from '../components/DashboardHeader';
import { MovieForm } from '../components/MovieForm';
import { MovieList } from '../components/MovieList';
import { MovieReviewsPanel } from '../components/MovieReviewsPanel';
import { ReservationModal } from '../components/ReservationModal';
import { ScreeningCard } from '../components/ScreeningCard';
import { emptyMovie, emptyReview } from '../constants/forms';
import { createMovie, deleteMovie, getMovies, updateMovie } from '../services/movieService';
import {
  createMovieReview,
  deleteMovieReview,
  getMovieReviews,
  updateMovieReview,
} from '../services/reviewService';
import { getUpcomingScreenings } from '../services/screeningService';

export function MoviesPage({ session, onLogout, onNavigate }) {
  const [movies, setMovies] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [screenings, setScreenings] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = session?.user?.roles?.includes('ADMIN');

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }, [movies]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);
      return date;
    });
  }, []);

  const weeklyScreenings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return screenings
      .filter((screening) => {
        const startTime = new Date(screening.startTime);
        const screeningDate = toDateKey(startTime);
        return startTime >= today && startTime < nextWeek
          && (!selectedScheduleDate || screeningDate === selectedScheduleDate);
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [screenings, selectedScheduleDate]);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    setLoading(true);
    setError('');

    try {
      const [moviesData, screeningsData] = await Promise.all([
        getMovies(session),
        getUpcomingScreenings(session),
      ]);
      setMovies(moviesData);
      setScreenings(screeningsData);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function selectMovie(movie) {
    setSelectedMovie(movie);
    setReviewsLoading(true);
    setError('');
    cancelReviewEdit();

    try {
      setReviews(await getMovieReviews(movie.id, session));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setReviewsLoading(false);
    }
  }

  async function handleMovieSubmit(event) {
    event.preventDefault();

    if (!isAdmin) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const savedMovie = editingMovieId
        ? await updateMovie(editingMovieId, movieForm, session)
        : await createMovie(movieForm, session);

      setMovies((currentMovies) => {
        if (!editingMovieId) {
          return [savedMovie, ...currentMovies];
        }

        return currentMovies.map((movie) => (movie.id === savedMovie.id ? savedMovie : movie));
      });
      cancelEdit();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMovie(movieId) {
    if (!isAdmin) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      await deleteMovie(movieId, session);
      setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId));

      if (editingMovieId === movieId) {
        cancelEdit();
      }
      if (selectedMovie?.id === movieId) {
        closeReviewsPanel();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!selectedMovie) {
      return;
    }

    setReviewSaving(true);
    setError('');

    try {
      const savedReview = editingReviewId
        ? await updateMovieReview(selectedMovie.id, editingReviewId, reviewForm, session)
        : await createMovieReview(selectedMovie.id, reviewForm, session);

      setReviews((currentReviews) => {
        if (!editingReviewId) {
          return [savedReview, ...currentReviews];
        }

        return currentReviews.map((review) => (review.id === savedReview.id ? savedReview : review));
      });
      cancelReviewEdit();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setReviewSaving(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!selectedMovie) {
      return;
    }

    setReviewSaving(true);
    setError('');

    try {
      await deleteMovieReview(selectedMovie.id, reviewId, session);
      setReviews((currentReviews) => currentReviews.filter((review) => review.id !== reviewId));

      if (editingReviewId === reviewId) {
        cancelReviewEdit();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setReviewSaving(false);
    }
  }

  function startEdit(movie) {
    setEditingMovieId(movie.id);
    setMovieForm({
      title: movie.title || '',
      description: movie.description || '',
      releaseYear: movie.releaseYear || '',
      director: movie.director || '',
      rating: movie.rating || '',
      posterUrl: movie.posterUrl || '',
    });
  }

  function cancelEdit() {
    setEditingMovieId(null);
    setMovieForm(emptyMovie);
  }

  function startReviewEdit(review) {
    setEditingReviewId(review.id);
    setReviewForm({
      rating: review.rating || '8',
      comment: review.comment || '',
      authorEmail: review.authorEmail,
      authorName: review.authorName,
      approved: review.approved,
    });
  }

  function cancelReviewEdit() {
    setEditingReviewId(null);
    setReviewForm(emptyReview);
  }

  function closeReviewsPanel() {
    setSelectedMovie(null);
    setReviews([]);
    cancelReviewEdit();
  }

  function updateMovieField(event) {
    const { name, value } = event.target;
    setMovieForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function updateReviewField(event) {
    const { name, value } = event.target;
    setReviewForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleBookScreening(screening) {
    setSelectedScreening(screening);
  }

  function handleReservationSuccess() {
    setSelectedScreening(null);
    onNavigate('cart');
  }

  function toDateKey(date) {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().slice(0, 10);
  }

  function formatScheduleDay(date) {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  return (
    <main className="app-shell">
      <DashboardHeader 
        session={session} 
        isAdmin={isAdmin} 
        onLogout={onLogout}
        currentPage="movies"
        onNavigate={onNavigate}
      />
      <AlertMessage message={error} />

      <section className={isAdmin ? 'workspace' : 'workspace read-only'}>
        {isAdmin && (
          <MovieForm
            form={movieForm}
            editingMovieId={editingMovieId}
            saving={saving}
            onChange={updateMovieField}
            onCancelEdit={cancelEdit}
            onSubmit={handleMovieSubmit}
          />
        )}

        <MovieList
          movies={sortedMovies}
          loading={loading}
          isAdmin={isAdmin}
          onRefresh={loadMovies}
          onSelect={selectMovie}
          onEdit={startEdit}
          onDelete={handleDeleteMovie}
        />
      </section>

      <section className="weekly-schedule">
        <div className="list-header">
          <div>
            <h2>This week's schedule</h2>
            <p className="muted">Choose a screening to open seat selection.</p>
          </div>
          <button type="button" className="ghost compact" onClick={loadMovies} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="date-filter">
          <button
            type="button"
            className={!selectedScheduleDate ? 'date-chip active' : 'date-chip'}
            onClick={() => setSelectedScheduleDate('')}
          >
            All week
          </button>
          {weekDays.map((date) => {
            const dateKey = toDateKey(date);
            return (
              <button
                key={dateKey}
                type="button"
                className={selectedScheduleDate === dateKey ? 'date-chip active' : 'date-chip'}
                onClick={() => setSelectedScheduleDate(dateKey)}
              >
                {formatScheduleDay(date)}
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="muted">Loading schedule...</p>
        ) : weeklyScreenings.length === 0 ? (
          <div className="empty-state">
            <p>No screenings found for the selected date.</p>
            <button type="button" onClick={() => onNavigate('screenings')}>
              See all screenings
            </button>
          </div>
        ) : (
          <div className="home-screenings-grid">
            {weeklyScreenings.map((screening) => (
              <ScreeningCard
                key={screening.id}
                screening={screening}
                onBook={handleBookScreening}
              />
            ))}
          </div>
        )}
      </section>

      {selectedMovie && (
        <section className="reviews-drawer">
          <div className="form-title">
            <div>
              <h2>{selectedMovie.title}</h2>
              <p className="muted">{reviewsLoading ? 'Loading reviews...' : `${reviews.length} reviews`}</p>
            </div>
            <button type="button" className="ghost compact" onClick={closeReviewsPanel}>
              Close
            </button>
          </div>
          <MovieReviewsPanel
            reviews={reviews}
            reviewForm={reviewForm}
            editingReviewId={editingReviewId}
            saving={reviewSaving}
            currentUserEmail={session.user.email}
            isAdmin={isAdmin}
            onReviewChange={updateReviewField}
            onReviewSubmit={handleReviewSubmit}
            onCancelReviewEdit={cancelReviewEdit}
            onEditReview={startReviewEdit}
            onDeleteReview={handleDeleteReview}
          />
        </section>
      )}

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
