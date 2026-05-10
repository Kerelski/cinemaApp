import { apiRequest } from './apiClient';

export function login(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export function registerUser(userData) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: userData,
  });
}
