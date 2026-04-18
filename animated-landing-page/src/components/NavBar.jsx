import { useState } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav>
        <img src="/logo.jpeg" alt="SwiftSolve AI logo" />

        {/* Desktop links */}
        <ul>
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`ham-bar ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`ham-bar ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`ham-bar ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default NavBar;
