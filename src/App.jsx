import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import InfoRules from './pages/InfoRules';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
import Teams from './pages/Teams';
import Schedule from './pages/Schedule';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeams from './pages/admin/AdminTeams';
import AdminMatches from './pages/admin/AdminMatches';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSettings from './pages/admin/AdminSettings';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="text-center text-white">
        <p className="text-8xl font-black font-heading text-primary-500 mb-4">404</p>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#212121',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            },
            success: { iconTheme: { primary: '#F57C00', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<InfoRules />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/success" element={<RegistrationSuccess />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
