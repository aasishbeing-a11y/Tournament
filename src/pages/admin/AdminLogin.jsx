import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginAdmin } from '../../firebase/auth';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff, Trophy } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    try {
      await loginAdmin(email, password);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-xl">
            <Trophy className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">Husler Cup Admin Panel</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="admin-email">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="admin-email"
                  type="email"
                  {...register('email')}
                  className="form-input pl-10"
                  placeholder="utsavparajuli035@gmail.com"
                  defaultValue={import.meta.env.VITE_ADMIN_EMAIL || ''}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  {...register('password')}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><Lock size={16} /> Sign In</>
              )}
            </button>
          </form>

          {/* First-time setup helper */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <details className="text-xs text-gray-500 group">
              <summary className="cursor-pointer font-semibold text-primary-600 hover:text-primary-700 select-none flex items-center justify-between">
                <span>First time logging in? Click here for instructions</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed text-gray-600">
                <p className="font-semibold text-gray-700">How to create your Admin account in Firebase:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-primary-600 underline">Firebase Console</a> and click project <strong>hustlercup</strong></li>
                  <li>Click <strong>Authentication</strong> → <strong>Sign-in method</strong> tab → enable <strong>Email/Password</strong></li>
                  <li>Click <strong>Users</strong> tab → click <strong>Add user</strong></li>
                  <li>Enter email: <code className="bg-gray-200 px-1 py-0.5 rounded text-dark font-mono">{import.meta.env.VITE_ADMIN_EMAIL || 'utsavparajuli035@gmail.com'}</code> and choose your password</li>
                  <li>Come back here and sign in with those credentials!</li>
                </ol>
              </div>
            </details>
          </div>

          <div className="mt-4 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-primary-500 transition-colors">
              ← Return to Tournament Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
