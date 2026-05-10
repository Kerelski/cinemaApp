import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { MoviesPage } from './pages/MoviesPage';
import { clearStoredSession, getStoredSession, storeSession } from './services/sessionStorage';

export function App() {
  const [session, setSession] = useState(getStoredSession);

  function handleSessionCreated(nextSession) {
    storeSession(nextSession);
    setSession(nextSession);
  }

  function handleLogout() {
    clearStoredSession();
    setSession(null);
  }

  if (!session) {
    return <LoginPage onSessionCreated={handleSessionCreated} />;
  }

  return <MoviesPage session={session} onLogout={handleLogout} />;
}
