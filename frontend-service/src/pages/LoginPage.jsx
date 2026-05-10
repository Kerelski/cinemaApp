import { useState } from 'react';
import { AlertMessage } from '../components/AlertMessage';
import { AuthTabs } from '../components/AuthTabs';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { emptyLogin, emptyRegister } from '../constants/forms';
import { login, registerUser } from '../services/authService';

export function LoginPage({ onSessionCreated }) {
  const [authMode, setAuthMode] = useState('login');
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const session = await login(loginForm);
      onSessionCreated(session);
      setLoginForm(emptyLogin);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const session = await registerUser(registerForm);
      onSessionCreated(session);
      setRegisterForm(emptyRegister);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function updateLoginField(event) {
    const { name, value } = event.target;
    setLoginForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function updateRegisterField(event) {
    const { name, value } = event.target;
    setRegisterForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Cinema App</p>
          <h1>Sign in</h1>
          <p className="summary">Access the cinema dashboard with role-based movie management.</p>
        </div>

        <AuthTabs activeMode={authMode} onModeChange={setAuthMode} />
        <AlertMessage message={error} />

        {authMode === 'login' ? (
          <LoginForm form={loginForm} loading={loading} onChange={updateLoginField} onSubmit={handleLogin} />
        ) : (
          <RegisterForm
            form={registerForm}
            loading={loading}
            onChange={updateRegisterField}
            onSubmit={handleRegister}
          />
        )}
      </section>
    </main>
  );
}
