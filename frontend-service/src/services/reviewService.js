import { apiRequest } from './apiClient';

export function getMovieReviews(movieId, session) {
  return apiRequest(`/api/movies/${movieId}/reviews`, { session });
}

export function createMovieReview(movieId, review, session) {
  return apiRequest(`/api/movies/${movieId}/reviews`, {
    method: 'POST',
    body: buildReviewPayload(review, session),
    session,
  });
}

export function updateMovieReview(movieId, reviewId, review, session) {
  return apiRequest(`/api/movies/${movieId}/reviews/${reviewId}`, {
    method: 'PUT',
    body: buildReviewPayload(review, session),
    session,
  });
}

export function deleteMovieReview(movieId, reviewId, session) {
  return apiRequest(`/api/movies/${movieId}/reviews/${reviewId}`, {
    method: 'DELETE',
    session,
  });
}

function buildReviewPayload(review, session) {
  return {
    rating: Number(review.rating),
    comment: review.comment,
    authorEmail: review.authorEmail || session.user.email,
    authorName: review.authorName || buildAuthorName(session.user),
    approved: review.approved ?? true,
  };
}

function buildAuthorName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
}
