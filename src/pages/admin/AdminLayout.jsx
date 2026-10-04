import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, Image, Settings,
  LogOut, Menu, X, Trophy, ChevronRight
} from 'lucide-react';
import { logoutAdmin } from '../../firebase/auth';
import toast from 'react-hot-toast';
import { TOURNAMENT } from '../../utils/constants';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/teams', icon: Users, label: 'Teams' },
  { to: '/admin/matches', icon: Calendar, label: 'Matches' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
          <Trophy className="text-white" size={18} />
        </div>
        <div>
          <p className="font-heading font-bold text-dark text-sm">Husler Cup</p>
          <p className="text-gray-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-dark'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 bg-white h-full shadow-xl flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <Trophy className="text-white" size={14} />
            </div>
            <span className="font-heading font-bold text-dark text-sm">Admin Panel</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
