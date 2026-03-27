import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import './Projects.css';

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

export default function Drafts() {
  const { projects, loading } = useProjects();

  const draftProjects = projects.filter((p) => p.status === 'draft');

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1 className="projects-title">Drafts</h1>
      </header>
      <div className="projects-grid">
        {loading ? (
          <p className="projects-empty">Loading…</p>
        ) : draftProjects.length === 0 ? (
          <p className="projects-empty">
            No drafts yet. Complete a baseline to save a project as a draft.
          </p>
        ) : (
          draftProjects.map((p) => (
            <Link
              key={p.id}
              to={`/dashboard/project/${p.slug}`}
              className="projects-card card"
            >
              <div className="projects-card-name">{p.projectName}</div>
              {p.scenarioTags?.length > 0 && (
                <div className="projects-card-tags">
                  {p.scenarioTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="projects-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="projects-card-meta">
                <span className="projects-card-updated">
                  Saved {formatRelativeTime(p.updatedAt || p.createdAt)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

