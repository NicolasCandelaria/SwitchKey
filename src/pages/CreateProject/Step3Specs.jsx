import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { MATERIAL_OPTIONS } from './constants';
import './CreateProject.css';

export default function Step3Specs() {
  const { formData, update } = useCreateProject();
  const navigate = useNavigate();

  function handleBack() {
    navigate('/dashboard/create-project/step/2');
  }

  function handleContinue(e) {
    e.preventDefault();
    navigate('/dashboard/create-project/step/4');
  }

  return (
    <form onSubmit={handleContinue}>
      <h1 className="create-project-step-title">Project Specifications</h1>
      <p className="create-project-step-desc">
        Provide basic technical information to help vendors understand the project.
      </p>

      <div className="form-group">
        <label htmlFor="material-main">Material for main housing</label>
        <select
          id="material-main"
          value={formData.materialMain}
          onChange={(e) => update('materialMain', e.target.value)}
        >
          <option value="">Select...</option>
          {MATERIAL_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="material-secondary">Material for secondary housing</label>
        <select
          id="material-secondary"
          value={formData.materialSecondary}
          onChange={(e) => update('materialSecondary', e.target.value)}
        >
          <option value="">Select...</option>
          {MATERIAL_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Does the product require a remote control?</label>
        <div className="create-project-radio-group">
          <label>
            <input
              type="radio"
              name="remote"
              value="yes"
              checked={formData.requiresRemote === 'yes'}
              onChange={() => update('requiresRemote', 'yes')}
            />
            <span>Yes</span>
          </label>
          <label>
            <input
              type="radio"
              name="remote"
              value="no"
              checked={formData.requiresRemote === 'no'}
              onChange={() => update('requiresRemote', 'no')}
            />
            <span>No</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Does the product include a speaker?</label>
        <div className="create-project-radio-group">
          <label>
            <input
              type="radio"
              name="speaker"
              value="yes"
              checked={formData.includesSpeaker === 'yes'}
              onChange={() => update('includesSpeaker', 'yes')}
            />
            <span>Yes</span>
          </label>
          <label>
            <input
              type="radio"
              name="speaker"
              value="no"
              checked={formData.includesSpeaker === 'no'}
              onChange={() => update('includesSpeaker', 'no')}
            />
            <span>No</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="additional-notes">Additional notes</label>
        <textarea
          id="additional-notes"
          value={formData.additionalNotes}
          onChange={(e) => update('additionalNotes', e.target.value)}
          rows={4}
          placeholder="Any other technical details..."
        />
      </div>

      <div className="create-project-step-actions">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </div>
    </form>
  );
}
