import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { getSuggestedPathways } from './constants';
import './CreateProject.css';

export default function CreateProjectPathways() {
  const { formData, update } = useCreateProject();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  const suggested = getSuggestedPathways(formData);
  const selectedPathways = Array.isArray(formData.selectedPathways) ? formData.selectedPathways : [];

  useEffect(() => {
    if (hasInitialized.current || suggested.length === 0) return;
    if (selectedPathways.length === 0) {
      update('selectedPathways', suggested.map((p) => p.id));
      hasInitialized.current = true;
    }
  }, [suggested, selectedPathways.length, update]);

  const displayedIds = suggested.map((p) => p.id);
  const selectedSet = new Set(selectedPathways.filter((id) => displayedIds.includes(id)));

  function togglePathway(id) {
    const next = selectedSet.has(id)
      ? selectedPathways.filter((x) => x !== id)
      : [...selectedPathways, id];
    update('selectedPathways', next);
  }

  function selectAll() {
    update('selectedPathways', [...suggested.map((p) => p.id)]);
  }

  function deselectAll() {
    update('selectedPathways', []);
  }

  function handleContinue(e) {
    e.preventDefault();
    navigate('/dashboard/create-project/spec');
  }

  return (
    <div className="create-project-step">
      <h1 className="create-project-step-title">Roles</h1>
      <p className="create-project-step-desc">
        Our system compiled these role progress items from your basic project info. Select or deselect the ones you need for this baseline.
      </p>

      <div className="pathways-actions-inline">
        <button type="button" className="btn btn-secondary btn-sm" onClick={selectAll}>
          Select all
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={deselectAll}>
          Deselect all
        </button>
      </div>

      <form onSubmit={handleContinue}>
        <ul className="pathways-list" role="group" aria-label="Role selection">
          {suggested.map((pathway) => (
            <li key={pathway.id} className="pathway-item">
              <label className="pathway-label">
                <input
                  type="checkbox"
                  checked={selectedSet.has(pathway.id)}
                  onChange={() => togglePathway(pathway.id)}
                />
                <span className="pathway-label-text">{pathway.label}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="create-project-step-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard/create-project/step/1')}
          >
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Continue to review
          </button>
        </div>
      </form>
    </div>
  );
}
