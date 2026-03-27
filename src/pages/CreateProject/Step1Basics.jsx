import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { PRIMARY_CATEGORIES, SECONDARY_BY_PRIMARY, PRODUCT_CATEGORIES } from './constants';
import './CreateProject.css';

const MIN_PROJECT_NAME_LENGTH = 2;
const MIN_PRODUCT_DESCRIPTION_LENGTH = 10;

export default function Step1Basics() {
  const { formData, update } = useCreateProject();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const firstErrorRef = useRef(null);

  const secondaryOptions = formData.primaryCategory
    ? (SECONDARY_BY_PRIMARY[formData.primaryCategory] || [])
    : [];

  function validate() {
    const next = {};
    const name = (formData.projectName || '').trim();
    const desc = (formData.productDescription || '').trim();

    if (!name) next.projectName = 'Project name is required';
    else if (name.length < MIN_PROJECT_NAME_LENGTH) next.projectName = `Project name must be at least ${MIN_PROJECT_NAME_LENGTH} characters`;

    if (!desc) next.productDescription = 'Product description is required';
    else if (desc.length < MIN_PRODUCT_DESCRIPTION_LENGTH) next.productDescription = `Product description must be at least ${MIN_PRODUCT_DESCRIPTION_LENGTH} characters`;

    if (!formData.primaryCategory) next.primaryCategory = 'Primary category is required';
    if (!formData.productCategory) next.productCategory = 'Product category is required';

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
    <form onSubmit={handleContinue}>
      <h1 className="create-project-step-title">Create New Project</h1>
      <p className="create-project-step-desc">1. Project Basics</p>

      {Object.keys(errors).length > 0 && (
        <div
          ref={firstErrorRef}
          className="create-project-validation-summary"
          role="alert"
          aria-live="polite"
        >
          Please fix the errors below before continuing.
        </div>
      )}

      <div className="form-group">
        <label htmlFor="project-name">Project Name</label>
        <input
          id="project-name"
          type="text"
          value={formData.projectName}
          onChange={(e) => update('projectName', e.target.value)}
          placeholder="e.g. AquaVoice"
          className={errors.projectName ? 'error' : ''}
        />
        {errors.projectName && <span className="error-message">{errors.projectName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="product-desc">Simple Product Description</label>
        <textarea
          id="product-desc"
          value={formData.productDescription}
          onChange={(e) => update('productDescription', e.target.value)}
          placeholder="e.g. Waterproof karaoke microphone designed for shower and outdoor environments."
          rows={3}
          className={errors.productDescription ? 'error' : ''}
        />
        {errors.productDescription && <span className="error-message">{errors.productDescription}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="primary-category">Primary Category</label>
        <select
          id="primary-category"
          value={formData.primaryCategory}
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
        <label htmlFor="secondary-category">Secondary Category</label>
        <select
          id="secondary-category"
          value={formData.secondaryCategory}
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

      <div className="create-project-step-actions">
        <button type="button" className="btn btn-secondary" disabled>
          Back
        </button>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </div>
    </form>
  );
}
