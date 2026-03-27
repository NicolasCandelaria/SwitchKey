import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './CreateProjectShell.css';

const PROGRESS_STEPS = [
  { path: 'step/1', label: 'Basic project info' },
  { path: 'step/2', label: 'Roles' },
  { path: 'spec', label: 'Review spec' },
];

export default function CreateProjectShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace(/^.*\/create-project\/?/, '') || 'step/1';

  return (
    <div className="create-project-shell">
      <header className="create-project-shell-header">
        <Link to="/dashboard" className="create-project-shell-back" aria-label="Back to dashboard">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="create-project-shell-title">New baseline</span>
      </header>

      <div className="create-project-shell-body">
        <aside className="create-project-shell-progress">
          <nav className="create-project-shell-progress-nav" aria-label="Progress">
            {PROGRESS_STEPS.map((step, index) => {
              const stepActive = path === step.path;
              return (
                <button
                  key={step.path}
                  type="button"
                  className={`create-project-shell-progress-item ${stepActive ? 'active' : ''}`}
                  onClick={() => navigate(`/dashboard/create-project/${step.path}`)}
                >
                  <span className="create-project-shell-progress-num">{index + 1}</span>
                  <span className="create-project-shell-progress-label">{step.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>
        <main className="create-project-shell-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
