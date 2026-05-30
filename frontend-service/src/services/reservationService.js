import { apiRequest } from './apiClient';

export function getMyReservations(session) {
  return apiRequest('/api/reservations/my', {
    session,
    headers: {
      'X-User-Id': session.user.id || session.user.email,
      'X-User-Email': session.user.email,
    },
  });
}

export function getAllReservations(session) {
  return apiRequest('/api/reservations', { session });
}

export function getReservationById(reservationId, session) {
  return apiRequest(`/api/reservations/${reservationId}`, { session });
}

export function getScreeningSeats(screeningId, session) {
  return apiRequest(`/api/reservations/screenings/${screeningId}/seats`, { session });
}

export function createReservation(reservation, session) {
  const userName = [session.user.firstName, session.user.lastName].filter(Boolean).join(' ') || session.user.email;
  
  return apiRequest('/api/reservations', {
    method: 'POST',
    body: reservation,
    session,
    headers: {
      'X-User-Id': session.user.id || session.user.email,
      'X-User-Email': session.user.email,
      'X-User-Name': userName,
    },
  });
}

export function cancelReservation(reservationId, session) {
  return apiRequest(`/api/reservations/${reservationId}/cancel`, {
    method: 'POST',
    session,
    headers: {
      'X-User-Id': session.user.id || session.user.email,
      'X-User-Email': session.user.email,
    },
  });
}

export function adminCancelReservation(reservationId, session) {
  return apiRequest(`/api/reservations/${reservationId}/admin-cancel`, {
    method: 'POST',
    session,
  });
}
