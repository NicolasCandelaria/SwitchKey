import { Link, useSearchParams } from 'react-router-dom';
import { getUser } from '../lib/auth';
import './Dashboard.css';

const MOCK_PROJECTS = [
  { id: '1', slug: 'videonow', name: 'VideoNow', status: 'Searching and Matching', date: '2025-03-01' },
  { id: '2', slug: 'tooth-tunes', name: 'Tooth Tunes', status: 'Awaiting Payment', date: '2025-02-28' },
  { id: '3', slug: 'zoombox', name: 'ZoomBox', status: 'Completed', date: '2025-02-15' },
];

const MOCK_APPLICATIONS = [
  { status: 'Pending', count: 2 },
  { status: 'Accepted', count: 1 },
  { status: 'Action Needed', count: 0 },
];

const MOCK_ACTIVITY = [
  { text: 'John Wang imported an SVG file', time: '2 hours ago' },
  { text: 'You imported a file', time: 'Yesterday' },
];

const MOCK_TASKS = {
  todo: [
    { id: 't1', title: 'Provide review to Product Spec', project: 'VideoNow', role: 'Vendor' },
  ],
  inProgress: [
    { id: 't2', title: 'Finalize hardware BOM', project: 'Tooth Tunes', role: 'Project Owner' },
  ],
  done: [
    { id: 't3', title: 'Design review sign-off', project: 'ZoomBox', role: 'Vendor' },
  ],
};

export default function Dashboard() {
  const user = getUser();
  const projects = MOCK_PROJECTS;
  const firstName = user?.firstName || 'User';
  const [searchParams] = useSearchParams();
  const forceEmpty = searchParams.get('empty') === '1';
  const displayProjects = forceEmpty ? [] : projects;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-welcome">Welcome back, {firstName}</h1>
      </header>

      <section className="dashboard-hero card">
        <h2 className="dashboard-hero-title">Ready for a new project?</h2>
        <div className="dashboard-hero-actions">
          <button type="button" className="btn btn-primary" onClick={() => alert('Project creation flow – coming later.')}>
            Join as Project Owner
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => alert('Vendor onboarding flow – coming later.')}>
            Join as Vendor
          </button>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section dashboard-recent">
          <h2 className="dashboard-section-title">Recent Projects</h2>
          {displayProjects.length === 0 ? (
            <div className="dashboard-empty card">
              <p className="dashboard-empty-text">No projects yet</p>
              <button type="button" className="btn btn-primary" onClick={() => alert('Project creation flow – coming later.')}>
                Create New Project
              </button>
            </div>
          ) : (
            <div className="dashboard-table-wrap card">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {displayProjects.map((p) => (
                    <tr key={p.id}>
                      <td><Link to={`/dashboard/project/${p.slug}`} className="dashboard-table-link">{p.name}</Link></td>
                      <td>{p.status}</td>
                      <td>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-section dashboard-status card">
          <h2 className="dashboard-section-title">Application Status</h2>
          <ul className="dashboard-status-list">
            {MOCK_APPLICATIONS.map((a) => (
              <li key={a.status} className="dashboard-status-item">
                <span className="dashboard-status-label">{a.status}</span>
                <span className="dashboard-status-count">{a.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="dashboard-activity card">
        <h2 className="dashboard-section-title">Activity</h2>
        <ul className="dashboard-activity-list">
          {MOCK_ACTIVITY.map((a, i) => (
            <li key={i} className="dashboard-activity-item">
              <span className="dashboard-activity-text">{a.text}</span>
              <span className="dashboard-activity-time">{a.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard-taskboard">
        <h2 className="dashboard-section-title">Task Board</h2>
        <div className="dashboard-kanban">
          <div className="dashboard-column">
            <h3 className="dashboard-column-title">To Do</h3>
            {MOCK_TASKS.todo.map((t) => (
              <div key={t.id} className="dashboard-task-card card">
                <div className="dashboard-task-title">{t.title}</div>
                <div className="dashboard-task-tags">
                  <span className="dashboard-task-tag project">{t.project}</span>
                  <span className="dashboard-task-tag role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-column">
            <h3 className="dashboard-column-title">In Progress</h3>
            {MOCK_TASKS.inProgress.map((t) => (
              <div key={t.id} className="dashboard-task-card card">
                <div className="dashboard-task-title">{t.title}</div>
                <div className="dashboard-task-tags">
                  <span className="dashboard-task-tag project">{t.project}</span>
                  <span className="dashboard-task-tag role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-column">
            <h3 className="dashboard-column-title">Done</h3>
            {MOCK_TASKS.done.map((t) => (
              <div key={t.id} className="dashboard-task-card card">
                <div className="dashboard-task-title">{t.title}</div>
                <div className="dashboard-task-tags">
                  <span className="dashboard-task-tag project">{t.project}</span>
                  <span className="dashboard-task-tag role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
