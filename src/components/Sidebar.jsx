import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { getUser, clearUser } from '../lib/auth';
import Logo from './Logo';
import './Sidebar.css';

const MOCK_NOTIFICATIONS = [
  { text: 'John Wang imported an SVG file', time: '2 hours ago' },
  { text: 'You imported a file', time: 'Yesterday' },
];

const iconSvg = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  project: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileAnchorRef = useRef(/** @type {HTMLElement | null} */ (null));
  const notificationsAnchorRef = useRef(/** @type {HTMLElement | null} */ (null));
  const location = useLocation();
  const user = getUser();

  if (!user) return null;

  const displayName = user.firstName || 'User';

  function openProfile(e) {
    profileAnchorRef.current = e.currentTarget;
    setNotificationsOpen(false);
    setProfileOpen(true);
  }

  function openNotifications(e) {
    notificationsAnchorRef.current = e.currentTarget;
    setProfileOpen(false);
    setNotificationsOpen(true);
  }

  function handleLogout() {
    clearUser();
    setProfileOpen(false);
    setNotificationsOpen(false);
    window.location.href = '/sign-in';
  }

  function getDropdownStyle(anchorRef) {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return {};
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
      return {
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '72px',
        width: 'min(320px, calc(100vw - var(--space-lg)))',
        minWidth: 0,
      };
    }
    return {
      position: 'fixed',
      left: rect.left,
      bottom: window.innerHeight - rect.top + 8,
      width: rect.width,
      minWidth: rect.width,
    };
  }

  return (
    <>
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-upper">
          <div className="sidebar-top">
            <Link
              to="/dashboard"
              className="sidebar-project-icon-button sidebar-logo-button"
              aria-label="SwitchKey"
            >
              <span className="sidebar-project-icon" aria-hidden="true">
                <Logo width={48} height={48} ariaLabel="" />
              </span>
            </Link>
            <nav className="sidebar-nav" aria-label="Main">
              <ul className="sidebar-nav-list">
                <li>
                  <Link to="/dashboard" className="sidebar-project-icon-button">
                    <span className="sidebar-project-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </span>
                    <span className="sidebar-project-icon-label">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/projects/drafts" className="sidebar-project-icon-button">
                    <span className="sidebar-project-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    <span className="sidebar-project-icon-label">Drafts</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/projects" className="sidebar-project-icon-button">
                    <span className="sidebar-project-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    <span className="sidebar-project-icon-label">Project</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/projects/trash" className="sidebar-project-icon-button">
                    <span className="sidebar-project-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      </svg>
                    </span>
                    <span className="sidebar-project-icon-label">Trash</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/wallet" className="sidebar-project-icon-button">
                    <span className="sidebar-project-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    </span>
                    <span className="sidebar-project-icon-label">Wallet</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile" className="sidebar-project-icon-button">
                    <span className="sidebar-project-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <span className="sidebar-project-icon-label">Profile</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sidebar-lower">
          <ul className="sidebar-lower-list">
            <li className="sidebar-notifications-wrap">
              <button
                type="button"
                className="sidebar-notification-trigger"
                onClick={(e) => {
                  if (notificationsOpen) setNotificationsOpen(false);
                  else openNotifications(e);
                }}
                aria-expanded={notificationsOpen}
                aria-label="Notifications"
              >
                <span className="sidebar-notification-icon-wrap" aria-hidden="true">
                  <span className="sidebar-notification-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </span>
                  {MOCK_NOTIFICATIONS.length > 0 && (
                    <span className="sidebar-notification-badge">{MOCK_NOTIFICATIONS.length}</span>
                  )}
                </span>
              </button>
            </li>
            <li className="sidebar-avatar-wrap">
              <button
                type="button"
                className="sidebar-avatar-button"
                onClick={(e) => {
                  if (profileOpen) setProfileOpen(false);
                  else openProfile(e);
                }}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label={`Account menu for ${displayName}`}
              >
                <span className="sidebar-avatar">{displayName.charAt(0)}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    {/* Profile dropdown: portaled so it pops over the sidebar */}
    {profileOpen && createPortal(
      <>
        <div
          className="sidebar-dropdown-backdrop"
          onClick={() => setProfileOpen(false)}
          aria-hidden="true"
        />
        <div
          className="sidebar-dropdown sidebar-avatar-dropdown sidebar-dropdown-portal"
          style={getDropdownStyle(profileAnchorRef)}
        >
          <Link to="/dashboard/profile" className="sidebar-dropdown-item" onClick={() => setProfileOpen(false)}>
            Profile
          </Link>
          <button type="button" className="sidebar-dropdown-item" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </>,
      document.body
    )}

    {/* Notifications dropdown: portaled so it pops over the sidebar */}
    {notificationsOpen && createPortal(
      <>
        <div
          className="sidebar-dropdown-backdrop"
          onClick={() => setNotificationsOpen(false)}
          aria-hidden="true"
        />
        <div
          className="sidebar-dropdown sidebar-notifications-panel sidebar-dropdown-portal"
          style={getDropdownStyle(notificationsAnchorRef)}
        >
          <div className="sidebar-notifications-header">Activity</div>
          <ul className="sidebar-notifications-list">
            {MOCK_NOTIFICATIONS.map((n, i) => (
              <li key={i} className="sidebar-notification-item">
                <span className="sidebar-notification-text">{n.text}</span>
                <span className="sidebar-notification-time">{n.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </>,
      document.body
    )}

    {/* Mobile app menu: bottom navigation bar */}
    <nav className="sidebar-app-menu" aria-label="App menu">
      <Link
        to="/dashboard"
        className={`sidebar-app-menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
        aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
      >
        <span className="sidebar-app-menu-icon">{iconSvg.home}</span>
        <span className="sidebar-app-menu-label">Home</span>
      </Link>
      <Link
        to="/dashboard/projects/drafts"
        className={`sidebar-app-menu-item ${
          location.pathname.startsWith('/dashboard/projects/drafts') ? 'active' : ''
        }`}
        aria-current={location.pathname.startsWith('/dashboard/projects/drafts') ? 'page' : undefined}
      >
        <span className="sidebar-app-menu-icon">{iconSvg.project}</span>
        <span className="sidebar-app-menu-label">Drafts</span>
      </Link>
      <Link
        to="/dashboard/projects"
        className={`sidebar-app-menu-item ${
          location.pathname === '/dashboard/projects' ? 'active' : ''
        }`}
        aria-current={location.pathname === '/dashboard/projects' ? 'page' : undefined}
      >
        <span className="sidebar-app-menu-icon">{iconSvg.project}</span>
        <span className="sidebar-app-menu-label">Project</span>
      </Link>
      <Link
        to="/dashboard/projects/trash"
        className={`sidebar-app-menu-item ${
          location.pathname.startsWith('/dashboard/projects/trash') ? 'active' : ''
        }`}
        aria-current={location.pathname.startsWith('/dashboard/projects/trash') ? 'page' : undefined}
      >
        <span className="sidebar-app-menu-icon">{iconSvg.project}</span>
        <span className="sidebar-app-menu-label">Trash</span>
      </Link>
      <Link
        to="/dashboard/wallet"
        className={`sidebar-app-menu-item ${location.pathname.startsWith('/dashboard/wallet') ? 'active' : ''}`}
        aria-current={location.pathname.startsWith('/dashboard/wallet') ? 'page' : undefined}
      >
        <span className="sidebar-app-menu-icon">{iconSvg.wallet}</span>
        <span className="sidebar-app-menu-label">Wallet</span>
      </Link>
      <Link
        to="/dashboard/profile"
        className={`sidebar-app-menu-item ${location.pathname.startsWith('/dashboard/profile') ? 'active' : ''}`}
        aria-current={location.pathname.startsWith('/dashboard/profile') ? 'page' : undefined}
      >
        <span className="sidebar-app-menu-icon">{iconSvg.profile}</span>
        <span className="sidebar-app-menu-label">Profile</span>
      </Link>
      <div className="sidebar-app-menu-item-wrap">
        <button
          type="button"
          className="sidebar-app-menu-item sidebar-app-menu-trigger"
          onClick={(e) => {
            if (notificationsOpen) setNotificationsOpen(false);
            else openNotifications(e);
          }}
          aria-expanded={notificationsOpen}
          aria-label="Notifications"
        >
          <span className="sidebar-app-menu-icon sidebar-notification-icon-wrap">
            <span className="sidebar-notification-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            {MOCK_NOTIFICATIONS.length > 0 && (
              <span className="sidebar-notification-badge">{MOCK_NOTIFICATIONS.length}</span>
            )}
          </span>
          <span className="sidebar-app-menu-label">Activity</span>
        </button>
      </div>
      <div className="sidebar-app-menu-item-wrap">
        <button
          type="button"
          className="sidebar-app-menu-item sidebar-app-menu-trigger"
          onClick={(e) => {
            if (profileOpen) setProfileOpen(false);
            else openProfile(e);
          }}
          aria-expanded={profileOpen}
          aria-label={`Account: ${displayName}`}
        >
          <span className="sidebar-app-menu-icon">
            <span className="sidebar-avatar sidebar-app-menu-avatar">{displayName.charAt(0)}</span>
          </span>
          <span className="sidebar-app-menu-label">Account</span>
        </button>
      </div>
    </nav>
    </>
  );
}
