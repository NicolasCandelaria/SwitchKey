import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser, clearUser } from '../lib/auth';
import './Sidebar.css';

const MOCK_PROJECTS = [
  { id: '1', name: 'VideoNow', slug: 'videonow' },
  { id: '2', name: 'Tooth Tunes', slug: 'tooth-tunes' },
  { id: '3', name: 'ZoomBox', slug: 'zoombox' },
];

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const user = getUser();

  if (!user) return null;

  const displayName = user.firstName || 'User';
  const role = user.role || 'Project Owner';

  function handleLogout() {
    clearUser();
    setProfileOpen(false);
    window.location.href = '/sign-in';
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <Link to="/dashboard" className="sidebar-logo">
            SwitchKey
          </Link>
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="sidebar-link">
              Home
            </Link>
            <Link to="/dashboard/create-project/step/1" className="sidebar-link">
              Create New Project
            </Link>
          </nav>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-projects">
          <span className="sidebar-label">Projects</span>
          <ul className="sidebar-project-list">
            {MOCK_PROJECTS.map((p) => (
              <li key={p.id}>
                <Link to={`/dashboard/project/${p.slug}`} className="sidebar-project-link">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-profile-wrap">
            <button
              type="button"
              className="sidebar-profile-trigger"
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
            >
              <span className="sidebar-avatar">{displayName.charAt(0)}</span>
              <div className="sidebar-profile-info">
                <span className="sidebar-profile-name">{displayName}</span>
                <span className="sidebar-profile-role">{role}</span>
              </div>
            </button>
            {profileOpen && (
              <>
                <div
                  className="sidebar-dropdown-backdrop"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div className="sidebar-dropdown">
                  <Link to="/dashboard" className="sidebar-dropdown-item" onClick={() => setProfileOpen(false)}>
                    Profile
                  </Link>
                  <button type="button" className="sidebar-dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
