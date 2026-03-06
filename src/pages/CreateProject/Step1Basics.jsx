import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { PRIMARY_CATEGORIES, SECONDARY_BY_PRIMARY, LOCATIONS } from './constants';
import './CreateProject.css';

export default function Step1Basics() {
  const { formData, update } = useCreateProject();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const secondaryOptions = formData.primaryCategory
    ? (SECONDARY_BY_PRIMARY[formData.primaryCategory] || [])
    : [];

  function validate() {
    const next = {};
    if (!formData.projectName.trim()) next.projectName = 'Project name is required';
    if (!formData.productDescription.trim()) next.productDescription = 'Product description is required';
    if (!formData.projectDescription.trim()) next.projectDescription = 'Project description is required';
    if (!formData.primaryCategory) next.primaryCategory = 'Primary category is required';
    if (!formData.locationTimezone) next.locationTimezone = 'Location / timezone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleContinue(e) {
    e.preventDefault();
    if (!validate()) return;
    navigate('/dashboard/create-project/step/2');
  }

  return (
    <form onSubmit={handleContinue}>
      <h1 className="create-project-step-title">Create New Project</h1>
      <p className="create-project-step-desc">1. Project Basics</p>

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
        <label htmlFor="project-desc">How would you describe your project</label>
        <textarea
          id="project-desc"
          value={formData.projectDescription}
          onChange={(e) => update('projectDescription', e.target.value)}
          placeholder="More detailed explanation of goals."
          rows={4}
          className={errors.projectDescription ? 'error' : ''}
        />
        {errors.projectDescription && <span className="error-message">{errors.projectDescription}</span>}
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
        <label htmlFor="location">Project Location / Timezone</label>
        <select
          id="location"
          value={formData.locationTimezone}
          onChange={(e) => update('locationTimezone', e.target.value)}
          className={errors.locationTimezone ? 'error' : ''}
        >
          <option value="">Select...</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        {errors.locationTimezone && <span className="error-message">{errors.locationTimezone}</span>}
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
