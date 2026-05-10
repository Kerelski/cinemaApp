import { apiRequest } from './apiClient';

export function getMovies(session) {
  return apiRequest('/api/movies', { session });
}

export function createMovie(movie, session) {
  return apiRequest('/api/movies', {
    method: 'POST',
    body: normalizeMoviePayload(movie),
    session,
  });
}

export function updateMovie(movieId, movie, session) {
  return apiRequest(`/api/movies/${movieId}`, {
    method: 'PUT',
    body: normalizeMoviePayload(movie),
    session,
  });
}

export function deleteMovie(movieId, session) {
  return apiRequest(`/api/movies/${movieId}`, {
    method: 'DELETE',
    session,
  });
}

function normalizeMoviePayload(movie) {
  return {
    ...movie,
    releaseYear: movie.releaseYear ? Number(movie.releaseYear) : null,
    rating: movie.rating ? Number(movie.rating) : null,
  };
}
