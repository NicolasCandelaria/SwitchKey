import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import './CreateProject.css';

export default function Step6Agreement() {
  const { formData, update } = useCreateProject();
  const navigate = useNavigate();
  const signed = formData.agreementSigned;

  function handleBack() {
    navigate('/dashboard/create-project/step/5');
  }

  function handleReviewSign(e) {
    e.preventDefault();
    // Simulate DocuSign: user "signs"
    update('agreementSigned', true);
  }

  function handleFinishSetup(e) {
    e.preventDefault();
    navigate('/dashboard/create-project/success');
  }

  return (
    <div>
      <h1 className="create-project-step-title">Sign Agreement</h1>
      <p className="create-project-step-desc">
        Before the project begins, you must sign the SwitchKey project agreement.
      </p>

      <div className="create-project-card">
        {!signed ? (
          <button type="button" className="btn btn-primary" onClick={handleReviewSign}>
            Review & Sign Agreement
          </button>
        ) : (
          <div>
            <p className="create-project-signed-msg">Agreement signed. You can now finish project setup.</p>
            <button type="button" className="btn btn-primary" onClick={handleFinishSetup}>
              Finish Project Setup
            </button>
          </div>
        )}
      </div>

      <div className="create-project-step-actions">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
}
