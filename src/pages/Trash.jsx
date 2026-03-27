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

export default function Trash() {
  const { projects, loading, updateProjectStatus, deleteProject } = useProjects();

  const trashedProjects = projects.filter((p) => p.status === 'trash');

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1 className="projects-title">Trash</h1>
      </header>
      <div className="projects-grid">
        {loading ? (
          <p className="projects-empty">Loading…</p>
        ) : trashedProjects.length === 0 ? (
          <p className="projects-empty">
            Trash is empty. Deleted drafts will appear here so you can restore them.
          </p>
        ) : (
          trashedProjects.map((p) => (
            <div key={p.id} className="projects-card card">
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
                  Deleted {formatRelativeTime(p.updatedAt || p.createdAt)}
                </span>
              </div>
              <div className="projects-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => updateProjectStatus(p.slug, 'draft')}
                >
                  Restore
                </button>
                <button
                  type="button"
                  className="btn btn-text"
                  onClick={() => deleteProject(p.slug)}
                >
                  Delete permanently
                </button>
                <Link
                  to={`/dashboard/project/${p.slug}`}
                  className="btn btn-link"
                >
                  Open baseline
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

