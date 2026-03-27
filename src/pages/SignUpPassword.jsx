import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSignUpData } from './SignUp';
import './Auth.css';

const MIN_LENGTH = 8;
const hasLetter = (s) => /[a-zA-Z]/.test(s);
const hasNumber = (s) => /\d/.test(s);

export default function SignUpPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});

  const data = getSignUpData();
  if (!data) {
    navigate('/sign-up', { replace: true });
    return null;
  }

  const lengthOk = password.length >= MIN_LENGTH;
  const hasLetterNum = hasLetter(password) && hasNumber(password);
  const match = password && password === confirm;
  const valid = lengthOk && hasLetterNum && match;

  function validate() {
    const next = {};
    if (!lengthOk) next.password = `Minimum ${MIN_LENGTH} characters`;
    else if (!hasLetterNum) next.password = 'Must contain letters and numbers';
    if (password !== confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!valid || !validate()) return;
    navigate('/sign-up/terms');
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <h1 className="auth-title">Create Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              autoComplete="new-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <ul className="password-rules">
              <li className={lengthOk ? 'valid' : ''}>Minimum 8 characters</li>
              <li className={hasLetterNum ? 'valid' : ''}>Must contain letters and numbers</li>
            </ul>
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={errors.confirm ? 'error' : ''}
              autoComplete="new-password"
            />
            {errors.confirm && <span className="error-message">{errors.confirm}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={!valid}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
