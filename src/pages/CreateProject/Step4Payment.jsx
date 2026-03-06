import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import './CreateProject.css';

const DEPOSIT = 500;
const PLATFORM_FEE = 100;
const PROCESSING_FEE = 20;
const TOTAL = DEPOSIT + PLATFORM_FEE + PROCESSING_FEE;

export default function Step4Payment() {
  const { update } = useCreateProject();
  const navigate = useNavigate();

  function handleBack() {
    navigate('/dashboard/create-project/step/3');
  }

  function handleProceed(e) {
    e.preventDefault();
    // Simulate Stripe Checkout: user "completes" payment
    update('paymentComplete', true);
    navigate('/dashboard/create-project/step/5');
  }

  return (
    <form onSubmit={handleProceed}>
      <h1 className="create-project-step-title">Project Deposit</h1>
      <p className="create-project-step-desc">
        SwitchKey requires a deposit before vendor matching begins.
      </p>

      <div className="create-project-card create-project-price-card">
        <div className="create-project-price-row">
          <span>Project Deposit</span>
          <span>${DEPOSIT}</span>
        </div>
        <div className="create-project-price-row">
          <span>Platform Setup Fee</span>
          <span>${PLATFORM_FEE}</span>
        </div>
        <div className="create-project-price-row">
          <span>Processing Fee</span>
          <span>${PROCESSING_FEE}</span>
        </div>
        <div className="create-project-price-row create-project-price-total">
          <span>Total</span>
          <span>${TOTAL}</span>
        </div>
      </div>

      <p className="create-project-step-desc">
        Click below to proceed to Stripe Checkout. (Prototype: no real payment.)
      </p>

      <div className="create-project-step-actions">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
        <button type="submit" className="btn btn-primary">
          Proceed to Payment
        </button>
      </div>
    </form>
  );
}
