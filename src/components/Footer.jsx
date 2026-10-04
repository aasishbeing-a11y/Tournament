import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Trophy, MapPin, Phone } from 'lucide-react';
import { FaInstagram as Instagram, FaFacebook as Facebook, FaYoutube as Youtube } from 'react-icons/fa';
import { TOURNAMENT } from '../utils/constants';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={TOURNAMENT.logoUrl}
                alt="Husler Cup"
                className="h-12 w-12 rounded-full object-contain ring-2 ring-primary-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h3 className="font-heading font-bold text-xl">
                  HUSLER <span className="text-primary-500">CUP</span>
                </h3>
                <p className="text-gray-400 text-sm">Basketball Tournament 2083</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              The premier basketball tournament in Chitwan. Bringing together the best talent from across the region.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-primary-500 transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-primary-500 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-primary-500 transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-xs">Designed by</p>
              <img
                src={TOURNAMENT.designerUrl}
                alt="Aashish Graphics"
                className="h-8 mt-1 object-contain opacity-80 hover:opacity-100 transition-opacity"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/info', label: 'Info & Rules' },
                { to: '/register', label: 'Register' },
                { to: '/teams', label: 'Teams' },
                { to: '/schedule', label: 'Schedule' },
                { to: '/gallery', label: 'Gallery' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1"
                  >
                    <span className="text-primary-500">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="text-primary-500 mt-0.5 shrink-0" />
                <span>{TOURNAMENT.venue}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} className="text-primary-500 shrink-0" />
                <a href={`mailto:${TOURNAMENT.contact}`} className="hover:text-primary-400 transition-colors break-all">
                  {TOURNAMENT.contact}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Trophy size={16} className="text-primary-500 shrink-0" />
                <span>Categories: {TOURNAMENT.categories.join(', ')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © 2083 Husler Cup. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Made with ❤️ for basketball</span>
            <span>•</span>
            <Link to="/admin/login" className="text-gray-400 hover:text-primary-400 transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
