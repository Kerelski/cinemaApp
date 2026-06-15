import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { MoviesPage } from './pages/MoviesPage';
import { ScreeningsPage } from './pages/ScreeningsPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { CartPage } from './pages/CartPage';
import { clearStoredSession, getStoredSession, storeSession } from './services/sessionStorage';

export function App() {
  const [session, setSession] = useState(getStoredSession);
  const [currentPage, setCurrentPage] = useState('movies');

  function handleSessionCreated(nextSession) {
    storeSession(nextSession);
    setSession(nextSession);
  }

  function handleLogout() {
    clearStoredSession();
    setSession(null);
    setCurrentPage('movies');
  }

  function handleNavigate(page) {
    setCurrentPage(page);
  }

  if (!session) {
    return <LoginPage onSessionCreated={handleSessionCreated} />;
  }

  const pageProps = {
    session,
    onLogout: handleLogout,
    onNavigate: handleNavigate,
  };

  switch (currentPage) {
    case 'screenings':
      return <ScreeningsPage {...pageProps} />;
    case 'cart':
      return <CartPage {...pageProps} />;
    case 'reservations':
      return <ReservationsPage {...pageProps} />;
    default:
      return <MoviesPage {...pageProps} />;
  }
}
