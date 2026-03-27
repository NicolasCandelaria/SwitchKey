import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { useProjects } from '../../context/ProjectsContext';
import { getUser } from '../../lib/auth';
import { PATHWAY_ITEMS } from './constants';

function getOwnerInitials() {
  const user = getUser();
  if (!user) return null;
  const first = (user.firstName || '').trim();
  const last = (user.lastName || '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  const email = (user.email || '').trim();
  if (email) return email.slice(0, 2).toUpperCase();
  return null;
}
import './CreateProject.css';

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const REQUIRED_FIELDS = [
  'projectName',
  'productDescription',
  'primaryCategory',
  'productCategory',
];

function isFormComplete(formData) {
  return REQUIRED_FIELDS.every((key) => {
    const value = formData[key];
    return value != null && String(value).trim() !== '';
  });
}

export default function CreateProjectSpecConfirm() {
  const { formData } = useCreateProject();
  const { addProject } = useProjects();
  const navigate = useNavigate();

  const slug = slugify(formData.projectName || 'project');
  const canConfirm = isFormComplete(formData);

  const pathwayIdToLabel = PATHWAY_ITEMS.reduce((acc, p) => {
    acc[p.id] = p.label;
    return acc;
  }, {});
  const selectedPathwayLabels = (Array.isArray(formData.selectedPathways) ? formData.selectedPathways : [])
    .map((id) => pathwayIdToLabel[id])
    .filter(Boolean);

  async function handleConfirm() {
    if (!canConfirm) return;
    const ownerInitials = getOwnerInitials();
    const project = await addProject(formData, ownerInitials != null ? { ownerInitials } : {});
    navigate('/dashboard/projects/drafts');
  }

  return (
    <div className="create-project-step">
      <h1 className="create-project-step-title">Project spec</h1>
      <p className="create-project-step-desc">
        Review the baseline project spec. After you confirm, the project will be saved as a draft and you can open it from the Drafts page in the sidebar.
      </p>

      <div className="create-project-spec card">
        <dl className="create-project-spec-list">
          <div className="create-project-spec-row">
            <dt>Project name</dt>
            <dd>{formData.projectName || '—'}</dd>
          </div>
          <div className="create-project-spec-row">
            <dt>Product description</dt>
            <dd>{formData.productDescription || '—'}</dd>
          </div>
          <div className="create-project-spec-row">
            <dt>Primary category</dt>
            <dd>{formData.primaryCategory || '—'}</dd>
          </div>
          <div className="create-project-spec-row">
            <dt>Secondary category</dt>
            <dd>{formData.secondaryCategory || '—'}</dd>
          </div>
          <div className="create-project-spec-row">
            <dt>Product category</dt>
            <dd>{formData.productCategory || '—'}</dd>
          </div>
          <div className="create-project-spec-row">
            <dt>Scenario tags</dt>
            <dd>
              {Array.isArray(formData.scenarioTags) && formData.scenarioTags.length > 0
                ? formData.scenarioTags.join(', ')
                : '—'}
            </dd>
          </div>
          <div className="create-project-spec-row">
            <dt>Roles</dt>
            <dd>
              {selectedPathwayLabels.length > 0
                ? selectedPathwayLabels.join(', ')
                : '—'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="create-project-step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard/create-project/step/2')}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={!canConfirm}
          title={!canConfirm ? 'Fill all required fields (project name, product description, primary category, product category) to confirm.' : undefined}
        >
          Confirm and save draft
        </button>
      </div>
      {!canConfirm && (
        <p className="create-project-step-desc" style={{ marginTop: '0.5rem' }}>
          Fill all required fields in the previous step to enable confirmation.
        </p>
      )}
    </div>
  );
}
