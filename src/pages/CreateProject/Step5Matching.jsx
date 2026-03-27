import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { ROLES } from './constants';
import './CreateProject.css';

const STATUS_STEPS = [
  'Submit Idea',
  'Submit Vendor Forms',
  'Respond to Forms',
  'Vendor Selection',
];
const CURRENT_STATUS_INDEX = 2;

const ROLE_SKILLS = {
  'Industrial Designer': 'CAD software, injection molding, ergonomics',
  'Mechanical Designer': 'CAD, DFM, prototyping',
  'Electrical Engineer': 'Circuit design, PCB, firmware',
  'Package Designer': 'Structural packaging, sustainability',
};

export default function Step5Matching() {
  const { formData } = useCreateProject();
  const navigate = useNavigate();

  const rolesWithQty = ROLES.filter((r) => (formData.roles[r] || 0) > 0);

  function handleBack() {
    navigate('/dashboard/create-project/step/4');
  }

  function handleContinue(e) {
    e.preventDefault();
    navigate('/dashboard/create-project/step/6');
  }

  return (
    <form onSubmit={handleContinue}>
      <h1 className="create-project-step-title">Vendor Matching in Progress</h1>

      <div className="create-project-status-tracker">
        {STATUS_STEPS.map((label, i) => (
          <div
            key={label}
            className={`create-project-status-item ${i <= CURRENT_STATUS_INDEX ? 'active' : ''} ${i === CURRENT_STATUS_INDEX ? 'current' : ''}`}
          >
            <span className="create-project-status-dot" />
            <span className="create-project-status-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="create-project-role-cards">
        {rolesWithQty.map((role) => {
          const qty = formData.roles[role] || 0;
          const found = Math.min(1, qty);
          return (
            <div key={role} className="create-project-role-card create-project-card">
              <h3 className="create-project-role-card-title">{role}</h3>
              <p className="create-project-role-card-skills">
                <strong>Required Skills:</strong> {ROLE_SKILLS[role] || '—'}
              </p>
              <p className="create-project-role-card-candidates">
                Candidates Found: {found} / {qty}
              </p>
              <button type="button" className="btn btn-secondary btn-sm">
                View Details
              </button>
            </div>
          );
        })}
      </div>

      <p className="create-project-matching-notice">
        We will continue connecting vendors for up to 4 days until the required number are found.
      </p>

      <button type="button" className="create-project-refund-link">
        Request refund
      </button>

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
