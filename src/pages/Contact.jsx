import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const next = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
  }

  if (submitted) {
    return (
      <section className="contact-page">
        <div className="container">
          <div className="contact-success-wrap">
            <div className="contact-success-card card">
              <h1 className="contact-success-title">Message sent</h1>
              <p className="contact-success-msg">Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
              <button type="button" className="btn btn-primary" onClick={() => setSubmitted(false)}>
                Send another message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-page">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <h1 className="contact-title">Get in touch</h1>
            <p className="contact-lead">
              Have questions about SwitchKey, partnerships, or how we can help your team? We&apos;d love to hear from you.
            </p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="contact-detail-label">Email</span>
                <a href="mailto:hello@switchkey.com">hello@switchkey.com</a>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-label">General inquiries</span>
                <a href="mailto:support@switchkey.com">support@switchkey.com</a>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-label">Phone</span>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-label">Office</span>
                <address>
                  123 Innovation Way, Suite 400<br />
                  San Francisco, CA 94107
                </address>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-label">Hours</span>
                <p>Monday – Friday, 9am – 6pm PT</p>
              </div>
            </div>
          </div>
          <div className="contact-form-wrap">
            <div className="contact-form-card card">
              <h2 className="contact-form-title">Send a message</h2>
              <p className="contact-form-desc">For questions about SwitchKey or partnerships.</p>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? 'error' : ''}
                    autoComplete="name"
                    placeholder="Your name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'error' : ''}
                    autoComplete="email"
                    placeholder="you@company.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className={errors.message ? 'error' : ''}
                    placeholder="How can we help?"
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary contact-submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
