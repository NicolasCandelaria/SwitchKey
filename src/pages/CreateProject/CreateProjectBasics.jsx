import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { PRIMARY_CATEGORIES, SECONDARY_BY_PRIMARY, PRODUCT_CATEGORIES, SCENARIO_TAGS } from './constants';
import './CreateProject.css';

const MIN_PROJECT_NAME_LENGTH = 2;
const MIN_PRODUCT_DESCRIPTION_LENGTH = 10;

export default function CreateProjectBasics() {
  const { formData, update } = useCreateProject();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const firstErrorRef = useRef(null);

  const secondaryOptions = formData.primaryCategory
    ? (SECONDARY_BY_PRIMARY[formData.primaryCategory] || [])
    : [];
  const scenarioTags = Array.isArray(formData.scenarioTags) ? formData.scenarioTags : [];

  function toggleScenarioTag(tag) {
    const next = scenarioTags.includes(tag)
      ? scenarioTags.filter((t) => t !== tag)
      : [...scenarioTags, tag];
    update('scenarioTags', next);
  }

  function validate() {
    const next = {};
    const name = formData.projectName?.trim() || '';
    const desc = formData.productDescription?.trim() || '';

    if (!name) {
      next.projectName = 'Project name is required';
    } else if (name.length < MIN_PROJECT_NAME_LENGTH) {
      next.projectName = `Project name must be at least ${MIN_PROJECT_NAME_LENGTH} characters`;
    }

    if (!desc) {
      next.productDescription = 'Product description is required';
    } else if (desc.length < MIN_PRODUCT_DESCRIPTION_LENGTH) {
      next.productDescription = `Product description must be at least ${MIN_PRODUCT_DESCRIPTION_LENGTH} characters`;
    }

    if (!formData.primaryCategory) {
      next.primaryCategory = 'Primary category is required';
    }

    if (!formData.productCategory) {
      next.productCategory = 'Product category is required';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleContinue(e) {
    e.preventDefault();
    if (!validate()) {
      firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    navigate('/dashboard/create-project/step/2');
  }

  return (
    <div className="create-project-step">
      <h1 className="create-project-step-title">Basic project info</h1>
      <p className="create-project-step-desc">Enter the basics for your baseline. You can add more details later.</p>

      <form onSubmit={handleContinue}>
        {Object.keys(errors).length > 0 && (
          <div
            ref={firstErrorRef}
            className="create-project-validation-summary"
            role="alert"
            aria-live="polite"
          >
            Please fix the errors below before continuing to review.
          </div>
        )}
        <div className="form-group">
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            type="text"
            value={formData.projectName || ''}
            onChange={(e) => update('projectName', e.target.value)}
            placeholder="e.g. AquaVoice"
            className={errors.projectName ? 'error' : ''}
          />
          {errors.projectName && <span className="error-message">{errors.projectName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="product-desc">Product description</label>
          <textarea
            id="product-desc"
            value={formData.productDescription || ''}
            onChange={(e) => update('productDescription', e.target.value)}
            placeholder="Short description of the product."
            rows={3}
            className={errors.productDescription ? 'error' : ''}
          />
          {errors.productDescription && <span className="error-message">{errors.productDescription}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="primary-category">Primary category</label>
          <select
            id="primary-category"
            value={formData.primaryCategory || ''}
            onChange={(e) => {
              update('primaryCategory', e.target.value);
              update('secondaryCategory', '');
            }}
            className={errors.primaryCategory ? 'error' : ''}
          >
            <option value="">Select...</option>
            {PRIMARY_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.primaryCategory && <span className="error-message">{errors.primaryCategory}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="secondary-category">Secondary category</label>
          <select
            id="secondary-category"
            value={formData.secondaryCategory || ''}
            onChange={(e) => update('secondaryCategory', e.target.value)}
            disabled={!formData.primaryCategory}
          >
            <option value="">Select...</option>
            {secondaryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="product-category">Product category</label>
          <select
            id="product-category"
            value={formData.productCategory || ''}
            onChange={(e) => update('productCategory', e.target.value)}
            className={errors.productCategory ? 'error' : ''}
          >
            <option value="">Select your product category...</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.productCategory && <span className="error-message">{errors.productCategory}</span>}
        </div>

        <div className="form-group">
          <span className="form-label">Scenario tags</span>
          <p className="create-project-field-hint">Select any that apply to this baseline.</p>
          <div className="scenario-tags-wrap" role="group" aria-label="Scenario tags">
            {SCENARIO_TAGS.map((tag) => (
              <label key={tag} className="scenario-tag-label">
                <input
                  type="checkbox"
                  checked={scenarioTags.includes(tag)}
                  onChange={() => toggleScenarioTag(tag)}
                />
                <span className="scenario-tag-text">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="create-project-step-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Continue to review
          </button>
        </div>
      </form>
    </div>
  );
}
