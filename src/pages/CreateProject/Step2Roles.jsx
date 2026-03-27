import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../context/CreateProjectContext';
import { ROLES } from './constants';
import './CreateProject.css';

export default function Step2Roles() {
  const { formData, updateRoles, addPreferredVendor, removePreferredVendor } = useCreateProject();
  const navigate = useNavigate();
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');

  function handleBack() {
    navigate('/dashboard/create-project/step/1');
  }

  function handleContinue(e) {
    e.preventDefault();
    const hasAnyRole = Object.values(formData.roles).some((q) => q > 0);
    if (!hasAnyRole) {
      alert('Please select at least one role with quantity greater than 0.');
      return;
    }
    navigate('/dashboard/create-project/step/3');
  }

  function handleAddVendor(e) {
    e.preventDefault();
    if (!vendorName.trim() || !vendorEmail.trim()) return;
    addPreferredVendor(vendorName.trim(), vendorEmail.trim());
    setVendorName('');
    setVendorEmail('');
  }

  return (
    <form onSubmit={handleContinue}>
      <h1 className="create-project-step-title">Project Roles</h1>
      <p className="create-project-step-desc">
        Define which specialists are required for this project.
      </p>

      <div className="create-project-card">
        <h2 className="create-project-card-title">Role Selection</h2>
        {ROLES.map((role) => (
          <div key={role} className="create-project-role-row">
            <label className="create-project-role-label">
              <input
                type="checkbox"
                checked={(formData.roles[role] || 0) > 0}
                onChange={(e) => updateRoles(role, e.target.checked ? 1 : 0)}
              />
              <span>{role}</span>
            </label>
            <div className="create-project-role-qty">
              <label htmlFor={`qty-${role}`}>Quantity:</label>
              <input
                id={`qty-${role}`}
                type="number"
                min={0}
                max={10}
                value={formData.roles[role] || 0}
                onChange={(e) => updateRoles(role, parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="create-project-card">
        <h2 className="create-project-card-title">Preferred Vendors (optional)</h2>
        <p className="create-project-notice">
          If the vendor is not yet on SwitchKey, they will receive an email invitation to create an account and join the project.
        </p>
        <div className="create-project-vendor-add">
          <div className="form-group">
            <label htmlFor="vendor-name">Vendor Name</label>
            <input
              id="vendor-name"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="vendor-email">Vendor Email</label>
            <input
              id="vendor-email"
              type="email"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <button type="button" className="btn btn-secondary" onClick={handleAddVendor}>
            Add Vendor
          </button>
        </div>
        {formData.preferredVendors.length > 0 && (
          <ul className="create-project-vendor-list">
            {formData.preferredVendors.map((v, i) => (
              <li key={i}>
                <span>{v.name} — {v.email}</span>
                <button type="button" className="create-project-vendor-remove" onClick={() => removePreferredVendor(i)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
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
