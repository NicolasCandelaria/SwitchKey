import { Link } from 'react-router-dom';
import './PlatformNav.css';

export default function PlatformNav() {
  return (
    <header className="platform-nav">
      <div className="platform-nav-inner">
        <div className="platform-nav-left" />
        <Link
          to="/dashboard/create-project/step/1"
          className="btn btn-primary platform-nav-create"
        >
          + Create
        </Link>
      </div>
    </header>
  );
}
