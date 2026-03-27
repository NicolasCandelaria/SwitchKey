import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const BRANDS = [
  'Nexus Devices',
  'Apex Product Co',
  'Lumina Labs',
  'Vertex Design',
  'Pulse Engineering',
  'Core Systems',
];

const TESTIMONIALS = [
  { quote: 'SwitchKey gave us a clear structure for deliverables and approvals. Our hardware launch stayed on track.', author: 'Sarah Chen', brand: 'Nexus Devices' },
  { quote: 'Finally, a platform that treats vendor work as first-class. Payments trigger when we sign off—no chasing invoices.', author: 'Marcus Webb', brand: 'Apex Product Co' },
  { quote: 'We onboarded three mechanical engineers in one project. The role-based matching saved us weeks.', author: 'Elena Torres', brand: 'Lumina Labs' },
];

const SERVICES = [
  { title: 'Project Setup & Scoping', desc: 'Define deliverables and roles' },
  { title: 'Vendor Matching', desc: 'Find specialists by role and skills' },
  { title: 'Deliverable Tracking', desc: 'Submit, review, and approve work' },
  { title: 'Approval & Payment', desc: 'Trigger payment on sign-off' },
];

const FAQ_ITEMS = [
  { q: 'Who can use SwitchKey?', a: 'Project owners who run complex outsourced projects (e.g. engineering, design, hardware) and specialized vendors or freelancers who deliver work against clear requirements.' },
  { q: 'How does payment work?', a: 'Project owners fund a deposit. When deliverables are approved, payment is released to vendors. SwitchKey may charge a platform or processing fee as described at checkout.' },
  { q: 'Can I invite vendors who aren\'t on SwitchKey yet?', a: 'Yes. When you add preferred vendors by email, they receive an invitation to join the platform and your project.' },
  { q: 'What happens after I create a project?', a: 'We match vendors to your role requirements. You review candidates, assign work, and track deliverables. When work is approved, you trigger payment.' },
];

export default function Home() {
  const [brandIndex, setBrandIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const t = setInterval(() => {
      setBrandIndex((i) => (i + 1) % BRANDS.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setServiceIndex((i) => (i + 1) % SERVICES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const testimonialPair = [testimonialIndex, (testimonialIndex + 1) % TESTIMONIALS.length];
  const servicePair = [serviceIndex, (serviceIndex + 1) % SERVICES.length];
  const brandPair = [brandIndex, (brandIndex + 1) % BRANDS.length];

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content container container-wide">
          <h1 className="hero-headline">
            Define work. Approve delivery. Trigger payment.
          </h1>
          <p className="hero-subtext">
            SwitchKey is a structured system for managing complex outsourced projects
            with clear deliverables and approvals.
          </p>
          <div className="hero-actions">
            <Link to="/sign-in" className="btn btn-primary">
              Start Here
            </Link>
            <Link to="/contact" className="hero-link-secondary">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tight brands-section">
        <div className="container container-wide">
          <h2 className="section-title">Trusted brands</h2>
          <div className="brands-carousel">
            <div className="brands-track">
              {brandPair.map((idx) => (
                <div key={`${brandIndex}-${idx}`} className="brand-card">
                  <span className="brand-name">{BRANDS[idx]}</span>
                </div>
              ))}
            </div>
            <div className="brands-dots">
              {BRANDS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`brand-dot ${i === brandIndex ? 'active' : ''}`}
                  onClick={() => setBrandIndex(i)}
                  aria-label={`Go to brand set ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight mission">
        <div className="container container-narrow">
          <h2 className="section-title">Our mission</h2>
          <p className="mission-statement">
            We believe complex projects succeed when work is clearly defined, progress is visible, and payment is tied to approval. SwitchKey gives project owners and vendors a single place to scope deliverables, match expertise, and get paid when the work is done.
          </p>
        </div>
      </section>

      <section className="section section-tight services">
        <div className="container container-wide">
          <h2 className="section-title">What we offer</h2>
          <div className="services-carousel">
            <div className="services-track services-track-two">
              {servicePair.map((idx) => (
                <div key={SERVICES[idx].title} className="service-card">
                  <div className="service-card-image" style={{ backgroundImage: `url(https://picsum.photos/400/240?random=${idx + 10})` }} />
                  <div className="service-card-content">
                    <h3 className="service-card-title">{SERVICES[idx].title}</h3>
                    <p className="service-card-desc">{SERVICES[idx].desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="services-dots">
              {SERVICES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`service-dot ${i === serviceIndex ? 'active' : ''}`}
                  onClick={() => setServiceIndex(i)}
                  aria-label={`Go to service ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section how-it-works">
        <div className="container container-wide">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <h3 className="step-title">Define project deliverables</h3>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <h3 className="step-title">Vendors submit work</h3>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <h3 className="step-title">Approve work and trigger payment</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight testimonials">
        <div className="container container-wide">
          <h2 className="section-title">Trusted by teams like yours</h2>
          <div className="testimonial-carousel testimonial-carousel-two">
            <div className="testimonial-track">
              {testimonialPair.map((idx) => (
                <div key={idx} className="testimonial-slide">
                  <blockquote className="testimonial-quote">
                    &ldquo;{TESTIMONIALS[idx].quote}&rdquo;
                  </blockquote>
                  <p className="testimonial-author">{TESTIMONIALS[idx].author}</p>
                  <p className="testimonial-brand">{TESTIMONIALS[idx].brand}</p>
                </div>
              ))}
            </div>
            <div className="testimonial-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`testimonial-dot ${i === testimonialIndex ? 'active' : ''}`}
                  onClick={() => setTestimonialIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container container-wide container-narrow">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`faq-item ${faqOpen === i ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                >
                  {item.q}
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight contact-cta-section">
        <div className="container container-narrow">
          <h2 className="section-title">Get in touch</h2>
          <p className="contact-cta-lead">
            Questions about SwitchKey, partnerships, or how we can help? We&apos;d love to hear from you.
          </p>
          <div className="contact-cta-actions">
            <Link to="/contact" className="btn btn-primary">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
