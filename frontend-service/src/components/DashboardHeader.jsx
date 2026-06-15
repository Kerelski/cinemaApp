export function DashboardHeader({ session, isAdmin, onLogout, currentPage, onNavigate }) {
  const pages = [
    { id: 'movies', label: 'Movies' },
    { id: 'screenings', label: 'Screenings' },
  ];

  const getPageTitle = () => {
    switch (currentPage) {
      case 'screenings':
        return 'Screenings';
      case 'cart':
        return 'Cart';
      case 'reservations':
        return 'Reservations';
      default:
        return 'Movie Catalog';
    }
  };

  const getPageDescription = () => {
    switch (currentPage) {
      case 'screenings':
        return isAdmin
            ? 'Manage screenings and add new ones.'
            : 'Browse available screenings and reserve seats.';
      case 'cart':
        return 'Review selected seats and create reservations.';
      case 'reservations':
        return 'View and manage your reservations.';
      default:
        return isAdmin
            ? 'Manage movies in the catalog.'
            : 'Browse the movie catalog in read-only mode.';
    }
  };

  return (
    <section className="topbar">
      <div>
        <p className="eyebrow">Cinema App</p>
        <h1>{getPageTitle()}</h1>
        <p className="summary">{getPageDescription()}</p>
        
        <nav className="nav-tabs">
          {pages.map(page => (
            <button
              key={page.id}
              type="button"
              className={`nav-tab ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => onNavigate(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="account-box">
        <div className="account-meta">
          <span>{session.user.email}</span>
          <strong>{isAdmin ? 'ADMIN' : 'UZYTKOWNIK'}</strong>
        </div>
        <div className="account-actions">
          <button
            type="button"
            className={`account-nav ${currentPage === 'cart' ? 'active' : ''}`}
            onClick={() => onNavigate('cart')}
          >
            Cart
          </button>
          <button
            type="button"
            className={`account-nav ${currentPage === 'reservations' ? 'active' : ''}`}
            onClick={() => onNavigate('reservations')}
          >
            My reservations
          </button>
          <button type="button" className="secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
