export function RegisterForm({ form, loading, onChange, onSubmit }) {
  return (
    <form className="stack-form" onSubmit={onSubmit}>
      <div className="field-row">
        <label>
          First name
          <input name="firstName" value={form.firstName} onChange={onChange} required />
        </label>
        <label>
          Last name
          <input name="lastName" value={form.lastName} onChange={onChange} required />
        </label>
      </div>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={onChange} required />
      </label>
      <label>
        Password
        <input name="password" type="password" minLength="6" value={form.password} onChange={onChange} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create user account'}
      </button>
    </form>
  );
}
