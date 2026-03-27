import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">SwitchKey</Link>
            <p className="footer-tagline">Structured collaboration for complex projects.</p>
          </div>
          <div className="footer-sitemap">
            <h4 className="footer-heading">Site Map</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/sign-in">Sign In</Link></li>
              <li><Link to="/sign-in">Start Here</Link></li>
            </ul>
          </div>
          <div className="footer-legal">
            <h4 className="footer-heading">Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">&copy; {new Date().getFullYear()} SwitchKey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
