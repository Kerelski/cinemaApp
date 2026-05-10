export function AuthTabs({ activeMode, onModeChange }) {
  return (
    <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
      <button
        type="button"
        className={activeMode === 'login' ? 'active-tab' : 'ghost'}
        onClick={() => onModeChange('login')}
      >
        Login
      </button>
      <button
        type="button"
        className={activeMode === 'register' ? 'active-tab' : 'ghost'}
        onClick={() => onModeChange('register')}
      >
        Register
      </button>
    </div>
  );
}
