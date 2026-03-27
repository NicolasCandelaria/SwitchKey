import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSignUpData } from './SignUp';
import { setUser, TERMS_VERSION } from '../lib/auth';
import './Terms.css';

const TERMS_CONTENT = `
SwitchKey Terms and Conditions

Last updated: 2025

1. Acceptance of Terms

By accessing or using SwitchKey ("Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Platform.

2. Description of Service

SwitchKey provides a structured system for managing collaboration between project owners and vendors on complex projects. The Platform enables definition of deliverables, submission of work, approvals, and payment triggers.

3. Account and Eligibility

You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials. You may act as a Project Owner, Vendor, or both under a single account.

4. Use of the Platform

You agree to use the Platform only for lawful purposes and in accordance with these Terms. You may not misuse the Platform, attempt to gain unauthorized access, or interfere with other users.

5. Projects and Deliverables

Project owners define work and assign vendors. Vendors submit work according to requirements. Approval and payment flows are governed by the project terms set on the Platform.

6. Fees and Payment

Payment terms are defined per project. SwitchKey may charge fees as described in separate fee schedules. You are responsible for any applicable taxes.

7. Intellectual Property

You retain ownership of content you submit. By submitting work, you grant necessary rights for the Platform to operate and for project owners to receive deliverables as agreed.

8. Limitation of Liability

To the maximum extent permitted by law, SwitchKey shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the Platform.

9. Changes to Terms

We may update these Terms. Continued use after changes constitutes acceptance. Material changes may be communicated via email or in-Platform notice.

10. Termination

We may suspend or terminate your access for violation of these Terms or for any other reason at our discretion.

11. Governing Law

These Terms are governed by the laws of the jurisdiction in which SwitchKey operates, without regard to conflict of law principles.

12. Contact

For questions about these Terms, use the Contact page on the SwitchKey website.
`;

export default function Terms() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const signUpData = getSignUpData();
  if (!signUpData) {
    navigate('/sign-up', { replace: true });
    return null;
  }

  function handleAccept() {
    if (!agreed) return;
    setUser({
      ...signUpData,
      acceptedTermsVersion: TERMS_VERSION,
      acceptedTermsAt: new Date().toISOString(),
    });
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="auth-layout terms-page">
      <div className="terms-card card">
        <h1 className="terms-title">Terms & Conditions</h1>
        <div className="terms-content">
          <pre className="terms-text">{TERMS_CONTENT.trim()}</pre>
        </div>
        <div className="terms-actions">
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I agree to the SwitchKey Terms & Conditions</span>
          </label>
          <button
            type="button"
            className="btn btn-primary terms-submit"
            disabled={!agreed}
            onClick={handleAccept}
          >
            Accept and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
