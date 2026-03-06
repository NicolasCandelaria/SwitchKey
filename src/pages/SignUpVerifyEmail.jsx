import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSignUpData } from './SignUp';
import './Auth.css';

export default function SignUpVerifyEmail() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const data = getSignUpData();
  if (!data) {
    navigate('/sign-up', { replace: true });
    return null;
  }

  function handleVerify(e) {
    e.preventDefault();
    const digits = code.replace(/\D/g, '');
    if (digits.length !== 6) {
      setError('Enter a 6-digit code');
      return;
    }
    setError('');
    navigate('/sign-up/password');
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <h1 className="auth-title">Verify Your Email</h1>
        <p className="auth-text">
          We sent a 6-digit verification code to your email.
        </p>
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="verify-code">Verification code</label>
            <input
              id="verify-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              placeholder="000000"
              className={error ? 'error' : ''}
              autoComplete="one-time-code"
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-submit">
            Verify
          </button>
        </form>
        <button
          type="button"
          className="auth-link"
          onClick={() => alert('Prototype – code not actually sent. Use any 6 digits to continue.')}
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}
