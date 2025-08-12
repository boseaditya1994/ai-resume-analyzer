import React from 'react';
import { Link } from 'react-router';

const Navbar: React.FC = () => {
  return (
    <nav
      className="navbar flex items-center justify-between px-4 py-2"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo / Home Link */}
      <Link
        to="/"
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Go to CareerMind homepage"
      >
        <h1 className="text-2xl font-bold text-gradient m-0">CAREERMIND</h1>
      </Link>

      {/* Upload Resume Button */}
      <Link
        to="/upload"
        className="primary-button w-fit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Upload your resume"
      >
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
