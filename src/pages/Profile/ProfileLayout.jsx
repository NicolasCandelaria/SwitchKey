import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './ProfileLayout.css';

const PROFILE_NAV = [
  { path: '', label: 'Profile' },
  { path: 'company', label: 'Company' },
  { path: 'tags', label: 'Tags and availability' },
  { path: 'settings', label: 'Settings' },
];

const PAGE_TITLES = {
  '': 'Profile',
  company: 'Company',
  tags: 'Tags and availability',
  settings: 'Settings',
};

export default function ProfileLayout() {
  const location = useLocation();
  const path = location.pathname.replace(/^.*\/profile\/?/, '') || '';
  const pageTitle = PAGE_TITLES[path] ?? 'Profile';

  return (
    <div className="profile-layout">
      <header className="profile-layout-header">
        <h1 className="profile-layout-title">{pageTitle}</h1>
        <nav className="profile-layout-nav" aria-label="Profile sections">
          {PROFILE_NAV.map(({ path: p, label }) => (
            <NavLink
              key={p || 'index'}
              to={p ? `/dashboard/profile/${p}` : '/dashboard/profile'}
              className={({ isActive }) => `profile-layout-nav-link ${isActive ? 'active' : ''}`}
              end={!p}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="profile-layout-main">
        <Outlet />
      </main>
    </div>
  );
}
