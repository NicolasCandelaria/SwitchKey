import { Link } from 'react-router-dom';
import './Contact.css';

export default function Privacy() {
  return (
    <section className="contact-page legal-page">
      <div className="container contact-container">
        <h1 className="contact-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: March 2025</p>
        <div className="legal-content">
          <p>
            SwitchKey (&quot;we&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information when you use our platform.
          </p>
          <h2>Information We Collect</h2>
          <p>We collect information you provide when creating an account, managing projects, and communicating with vendors or project owners. This may include name, email, company details, and project-related content.</p>
          <h2>How We Use Your Information</h2>
          <p>We use your information to operate the platform, match vendors to projects, process payments, and send service-related communications. We do not sell your personal information to third parties.</p>
          <h2>Data Security</h2>
          <p>We implement industry-standard measures to protect your data. Access to personal information is limited to authorized personnel and service providers necessary to operate the service.</p>
          <h2>Contact</h2>
          <p>For privacy-related questions, please use our <Link to="/contact">Contact</Link> page.</p>
        </div>
      </div>
    </section>
  );
}
