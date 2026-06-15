import { apiRequest } from './apiClient';

function cartHeaders(session) {
  return {
    'X-User-Id': session.user.id || session.user.email,
  };
}

export function getCart(session) {
  return apiRequest('/api/v1/carts', {
    session,
    headers: cartHeaders(session),
  });
}

export function addCartItem(item, session) {
  return apiRequest('/api/v1/carts/items', {
    method: 'POST',
    body: item,
    session,
    headers: cartHeaders(session),
  });
}

export function removeCartItem(screeningId, seatNumber, session) {
  const params = new URLSearchParams({
    screeningId: String(screeningId),
    seatNumber,
  });

  return apiRequest(`/api/v1/carts/items?${params.toString()}`, {
    method: 'DELETE',
    session,
    headers: cartHeaders(session),
  });
}

export function clearCart(session) {
  return apiRequest('/api/v1/carts', {
    method: 'DELETE',
    session,
    headers: cartHeaders(session),
  });
}
