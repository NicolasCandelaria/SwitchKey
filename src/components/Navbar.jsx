import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <Logo width={52} height={52} ariaLabel="SwitchKey" />
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
        </button>

        <nav className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/sign-in" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Start Here
          </Link>
        </nav>
      </div>
    </header>
  );
}
