export function LoginForm({ form, loading, onChange, onSubmit }) {
  return (
    <form className="stack-form" onSubmit={onSubmit}>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={onChange} required />
      </label>
      <label>
        Password
        <input name="password" type="password" value={form.password} onChange={onChange} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
