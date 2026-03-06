import { Link } from 'react-router-dom';
import './Auth.css';

export default function SignUpSuccess() {
  return (
    <div className="auth-layout">
      <div className="auth-card card auth-success-card">
        <h1 className="auth-title">You&apos;re in</h1>
        <p className="auth-text">
          Your account has been created. You can now access the platform.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Continue
        </Link>
      </div>
    </div>
  );
}
