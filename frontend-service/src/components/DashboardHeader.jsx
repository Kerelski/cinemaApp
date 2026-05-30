export function DashboardHeader({ session, isAdmin, onLogout, currentPage, onNavigate }) {
  const pages = [
    { id: 'movies', label: 'Movies' },
    { id: 'screenings', label: 'Screenings' },
    { id: 'reservations', label: 'Reservations' },
  ];

  const getPageTitle = () => {
    switch (currentPage) {
      case 'screenings':
        return 'Screenings';
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
            ? 'Administrator account: manage screenings and add new ones.'
            : 'Browse available screenings and reserve seats.';
      case 'reservations':
        return 'View and manage your reservations.';
      default:
        return isAdmin
            ? 'Administrator account: full management of the movie catalog.'
            : 'User account: browse the movie catalog in read-only mode.';
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
        <span>{session.user.email}</span>
        <strong>{isAdmin ? 'ADMIN' : 'UZYTKOWNIK'}</strong>
        <button type="button" className="secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </section>
  );
}
