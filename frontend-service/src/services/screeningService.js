import { apiRequest } from './apiClient';

export function getUpcomingScreenings(session) {
  return apiRequest('/api/movies/screenings/upcoming', { session });
}

export function getAllScreenings(session) {
  return apiRequest('/api/movies/screenings', { session });
}

export function getScreeningsByMovieId(movieId, session) {
  return apiRequest(`/api/movies/screenings/movie/${movieId}`, { session });
}

export function getScreeningById(screeningId, session) {
  return apiRequest(`/api/movies/screenings/${screeningId}`, { session });
}

export function getMoviesWithScreenings(session) {
  return apiRequest('/api/movies/screenings/with-movies', { session });
}

export function createScreening(screening, session) {
  return apiRequest('/api/movies/screenings', {
    method: 'POST',
    body: normalizeScreeningPayload(screening),
    session,
  });
}

export function updateScreening(screeningId, screening, session) {
  return apiRequest(`/api/movies/screenings/${screeningId}`, {
    method: 'PUT',
    body: normalizeScreeningPayload(screening),
    session,
  });
}

export function deleteScreening(screeningId, session) {
  return apiRequest(`/api/movies/screenings/${screeningId}`, {
    method: 'DELETE',
    session,
  });
}

function normalizeScreeningPayload(screening) {
  return {
    movieId: Number(screening.movieId),
    startTime: screening.startTime,
    room: screening.room,
    price: screening.price ? Number(screening.price) : null,
  };
}
