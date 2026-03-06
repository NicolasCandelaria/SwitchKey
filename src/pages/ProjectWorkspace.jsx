import { useParams } from 'react-router-dom';
import './Dashboard.css';

export default function ProjectWorkspace() {
  const { slug } = useParams();
  const rawName = slug ? slug.replace(/-/g, ' ') : 'Project';
  const name = rawName.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-welcome">{name} (workspace)</h1>
      </header>
      <p className="dashboard-empty-text">Project workspace – coming later.</p>
    </div>
  );
}
