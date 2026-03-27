import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getUser, getProfileProgress } from '../lib/auth';
import { useProjects } from '../context/ProjectsContext';
import { PATHWAY_ITEMS } from './CreateProject/constants';
import './Dashboard.css';

const LINKEDIN_KEY = 'switchkey_linkedin_connected';
const PRIORITIES = ['high', 'medium', 'low'];

function formatRelativeTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

function getTasksFromProjects(projects) {
  const pathwayIdToLabel = PATHWAY_ITEMS.reduce((acc, p) => {
    acc[p.id] = p.label;
    return acc;
  }, {});
  const all = [];
  let idx = 0;
  projects.forEach((proj) => {
    (proj.selectedPathways || []).forEach((pathwayId) => {
      const label = pathwayIdToLabel[pathwayId] || pathwayId;
      all.push({
        id: `task-${proj.id}-${pathwayId}-${idx}`,
        title: label,
        project: proj.projectName,
        projectSlug: proj.slug,
        role: 'Project Owner',
        priority: PRIORITIES[idx % PRIORITIES.length],
      });
      idx += 1;
    });
  });
  const n = all.length;
  const todo = all.slice(0, Math.ceil(n * 0.4));
  const inProgress = all.slice(Math.ceil(n * 0.4), Math.ceil(n * 0.7));
  const done = all.slice(Math.ceil(n * 0.7));
  return { todo, inProgress, done };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const { projects, loading } = useProjects();
  const [linkedInConnected, setLinkedInConnected] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(LINKEDIN_KEY) === 'true'
  );
  const firstName = user?.firstName || 'User';
  const [searchParams] = useSearchParams();
  const forceEmpty = searchParams.get('empty') === '1';
  const displayProjects = forceEmpty ? [] : projects;

  const profileProgress = getProfileProgress(user);
  const isProfileComplete = profileProgress === 100;
  const canShowTaskBoard = displayProjects.length > 0 && isProfileComplete && linkedInConnected;
  const tasksByColumn = canShowTaskBoard ? getTasksFromProjects(displayProjects) : { todo: [], inProgress: [], done: [] };

  function handleConnectLinkedIn() {
    localStorage.setItem(LINKEDIN_KEY, 'true');
    setLinkedInConnected(true);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-welcome">Welcome back, {firstName}</h1>
      </header>

      <section className="dashboard-taskboard">
        {!canShowTaskBoard ? (
          <div className="dashboard-cta-cards">
            <div className="dashboard-cta-card card">
              <span className="dashboard-cta-card-title">Complete your profile</span>
              <p className="dashboard-cta-card-desc">Add your details so your Task Board can be shown.</p>
              <div className="dashboard-cta-card-progress">
                <div className="dashboard-profile-progress-bar">
                  <div
                    className="dashboard-profile-progress-fill"
                    style={{ width: `${profileProgress}%` }}
                  />
                </div>
                <span className="dashboard-profile-progress-label">{profileProgress}%</span>
              </div>
              <Link to="/dashboard/profile" className="btn btn-secondary btn-sm">
                Edit profile
              </Link>
            </div>
            <div className="dashboard-cta-card card">
              <div className="dashboard-cta-card-linkedin-head">
                <span className="dashboard-cta-card-linkedin-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                <span className="dashboard-cta-card-title">Connect to LinkedIn</span>
              </div>
              <p className="dashboard-cta-card-desc">Link your account to help others find you and unlock your Task Board.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleConnectLinkedIn}
                disabled={linkedInConnected}
              >
                {linkedInConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="dashboard-section-title">Task Board</h2>
            <div className="dashboard-kanban">
            <div className="dashboard-column">
              <h3 className="dashboard-column-title">To Do</h3>
              {tasksByColumn.todo.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="dashboard-task-card card"
                  onClick={() => navigate(`/dashboard/project/${t.projectSlug}`)}
                >
                  <div className="dashboard-task-priority" data-priority={t.priority}>
                    {t.priority}
                  </div>
                  <div className="dashboard-task-title">{t.title}</div>
                  <div className="dashboard-task-tags">
                    <span className="dashboard-task-tag project">{t.project}</span>
                    <span className="dashboard-task-tag role">{t.role}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="dashboard-column">
              <h3 className="dashboard-column-title">In Progress</h3>
              {tasksByColumn.inProgress.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="dashboard-task-card card"
                  onClick={() => navigate(`/dashboard/project/${t.projectSlug}`)}
                >
                  <div className="dashboard-task-priority" data-priority={t.priority}>
                    {t.priority}
                  </div>
                  <div className="dashboard-task-title">{t.title}</div>
                  <div className="dashboard-task-tags">
                    <span className="dashboard-task-tag project">{t.project}</span>
                    <span className="dashboard-task-tag role">{t.role}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="dashboard-column">
              <h3 className="dashboard-column-title">Done</h3>
              {tasksByColumn.done.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="dashboard-task-card card"
                  onClick={() => navigate(`/dashboard/project/${t.projectSlug}`)}
                >
                  <div className="dashboard-task-priority" data-priority={t.priority}>
                    {t.priority}
                  </div>
                  <div className="dashboard-task-title">{t.title}</div>
                  <div className="dashboard-task-tags">
                    <span className="dashboard-task-tag project">{t.project}</span>
                    <span className="dashboard-task-tag role">{t.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          </>
        )}
      </section>

      <hr className="dashboard-divider" />

      <section className="dashboard-section dashboard-recent">
        <h2 className="dashboard-section-title">Recent Projects</h2>
        {loading ? (
          <p className="dashboard-recent-empty">Loading…</p>
        ) : displayProjects.length === 0 ? (
          <p className="dashboard-recent-empty">No project available</p>
        ) : (
          <div className="dashboard-table-wrap card">
            <table className="dashboard-table">
              <tbody className="dashboard-table-body">
                {displayProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="dashboard-table-row"
                    onClick={() => navigate(`/dashboard/project/${p.slug}`)}
                  >
                    <td>
                      <Link to={`/dashboard/project/${p.slug}`} className="dashboard-table-link">
                        {p.projectName}
                      </Link>
                      <div className="dashboard-project-meta">
                        {(p.participants || []).length > 0 && (
                          <>
                            <div className="dashboard-project-avatars">
                              {(p.participants || []).slice(0, 3).map((initials, index) => (
                                <span key={`${p.id}-${initials}-${index}`} className="dashboard-project-avatar">
                                  {initials}
                                </span>
                              ))}
                            </div>
                            <span className="dashboard-project-dot" />
                          </>
                        )}
                        <span className="dashboard-project-updated">
                          Updated {formatRelativeTime(p.updatedAt || p.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="dashboard-baseline-cats">
                      {[p.primaryCategory, p.secondaryCategory, p.productCategory].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="dashboard-table-cta"
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/project/${p.slug}`); }}
                      >
                        <span>Go to Project</span>
                        <span className="dashboard-table-cta-arrow">→</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
