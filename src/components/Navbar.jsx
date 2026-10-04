import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';
import { TOURNAMENT } from '../utils/constants';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/info', label: 'Info & Rules' },
  { to: '/register', label: 'Register' },
  { to: '/teams', label: 'Teams' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md shadow-xl' : 'bg-dark/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={TOURNAMENT.logoUrl}
                alt="Husler Cup"
                className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-contain ring-2 ring-primary-500 group-hover:ring-primary-400 transition-all"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div>
              <span className="text-white font-heading font-bold text-lg lg:text-xl tracking-wider">
                HUSLER <span className="text-primary-500">CUP</span>
              </span>
              <p className="text-gray-400 text-xs hidden lg:block">Basketball Tournament 2083</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/register" className="ml-3 btn-primary text-sm py-2">
              Register Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-dark/98 border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/register"
            className="block mt-3 btn-primary justify-center"
          >
            <Trophy size={16} /> Register Your Team
          </Link>
        </div>
      </div>
    </nav>
  );
}
