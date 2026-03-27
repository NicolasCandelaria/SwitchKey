import { useParams, useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import Step1Basics from './Step1Basics';
import Step2Roles from './Step2Roles';
import Step3Specs from './Step3Specs';
import Step4Payment from './Step4Payment';
import Step5Matching from './Step5Matching';
import Step6Agreement from './Step6Agreement';
import './CreateProject.css';

const STEP_COMPONENTS = {
  1: Step1Basics,
  2: Step2Roles,
  3: Step3Specs,
  4: Step4Payment,
  5: Step5Matching,
  6: Step6Agreement,
};

export default function CreateProjectLayout() {
  const { steps } = useCreateProject();
  const { step } = useParams();
  const navigate = useNavigate();
  const stepNum = parseInt(step, 10) || 1;
  const isValidStep = stepNum >= 1 && stepNum <= 6;

  if (!isValidStep) {
    navigate('/dashboard/create-project/step/1', { replace: true });
    return null;
  }

  const StepComponent = STEP_COMPONENTS[stepNum];

  return (
    <div className="create-project">
      <div className="create-project-progress-wrap">
        <div className="create-project-progress">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`create-project-progress-item ${stepNum >= s.num ? 'active' : ''} ${stepNum === s.num ? 'current' : ''}`}
            >
              <span className="create-project-progress-num">{s.num}</span>
              <span className="create-project-progress-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="create-project-content">
        {StepComponent && <StepComponent />}
      </div>
    </div>
  );
}
