import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import './CreateProject.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
    }))
  );

  return (
    <div className="create-project-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="create-project-confetti-piece"
          style={{
            '--confetti-left': p.left,
            '--confetti-delay': `${p.delay}s`,
            '--confetti-duration': `${p.duration}s`,
            '--confetti-color': p.color,
            '--confetti-size': `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function CreateProjectSuccess() {
  const { formData, reset } = useCreateProject();
  const projectName = formData.projectName || 'Your project';

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <div className="create-project-success">
      <Confetti />
      <div className="create-project-success-content">
        <h1 className="create-project-success-title">Project Created</h1>
        <p className="create-project-success-msg">
          Your project <strong>{projectName}</strong> has been successfully created.
        </p>
        <p className="create-project-success-msg">
          Vendor matching is now in progress.
        </p>
        <div className="create-project-success-actions">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
}
