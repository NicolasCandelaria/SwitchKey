import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../lib/auth';
import './Auth.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const firstName = email.split('@')[0] || 'User';
    setUser({ firstName, email });
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <h1 className="auth-title">Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-submit">
            Sign in
          </button>
        </form>
        <div className="auth-divider">
          <span>OR</span>
        </div>
        <button
          type="button"
          className="btn btn-secondary auth-social"
          onClick={() => alert('Prototype – no LinkedIn integration.')}
        >
          Continue with LinkedIn
        </button>
        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
