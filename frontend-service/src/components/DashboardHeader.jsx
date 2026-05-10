export function DashboardHeader({ session, isAdmin, onLogout }) {
  return (
    <section className="topbar">
      <div>
        <p className="eyebrow">Cinema App</p>
        <h1>Movie catalog</h1>
        <p className="summary">
          {isAdmin
            ? 'Admin account: full movie catalog management is enabled.'
            : 'User account: movie catalog is available in read-only mode.'}
        </p>
      </div>
      <div className="account-box">
        <span>{session.user.email}</span>
        <strong>{isAdmin ? 'ADMIN' : 'USER'}</strong>
        <button type="button" className="secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </section>
  );
}
