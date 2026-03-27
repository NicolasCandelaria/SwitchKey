import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SIGNUP_STORAGE_KEY = 'switchkey_signup';

export function getSignUpData() {
  try {
    const raw = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSignUpData(data) {
  sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(data));
}

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!firstName.trim()) next.firstName = 'First name is required';
    if (!lastName.trim()) next.lastName = 'Last name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!location.trim()) next.location = 'Location is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSignUpData({ firstName, lastName, email, location });
    navigate('/sign-up/verify-email');
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-first">First Name</label>
            <input
              id="signup-first"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={errors.firstName ? 'error' : ''}
              autoComplete="given-name"
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-last">Last Name</label>
            <input
              id="signup-last"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={errors.lastName ? 'error' : ''}
              autoComplete="family-name"
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-location">Location (City, Country)</label>
            <input
              id="signup-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, USA"
              className={errors.location ? 'error' : ''}
              autoComplete="address-level2"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
