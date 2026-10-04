import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Trophy, Share2, Home } from 'lucide-react';
import Layout from '../components/Layout';

export default function RegistrationSuccess() {
  const [params] = useSearchParams();
  const id = params.get('id') || 'BB-2026-0001';
  const team = params.get('team') || 'Your Team';

  return (
    <Layout>
      <section className="py-20 min-h-screen bg-gray-50 flex items-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="card p-8 sm:p-12">
            {/* Success icon */}
            <div className="relative mb-6 inline-block">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-500" size={52} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Trophy className="text-white" size={16} />
              </div>
            </div>

            <h1 className="text-3xl font-heading font-black text-dark mb-2">
              Registration Submitted!
            </h1>
            <p className="text-gray-500 mb-6">
              <strong className="text-dark">{team}</strong> has been registered for Husler Cup 2083. 
              Our team will review your registration and get back to you.
            </p>

            {/* Registration ID */}
            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Registration ID</p>
              <p className="text-3xl font-heading font-black text-primary-600 tracking-wider">{id}</p>
              <p className="text-xs text-gray-400 mt-1">Save this for your records</p>
            </div>

            {/* Next steps */}
            <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <p className="text-sm font-semibold text-dark">What happens next?</p>
              {[
                'Our admin will review your registration within 24–48 hours.',
                'Payment will be verified against your transaction ID/screenshot.',
                'Once approved, your team will appear on the public Teams page.',
                'You will be notified via the captain\'s email.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/" className="btn-secondary flex-1 justify-center">
                <Home size={18} /> Go Home
              </Link>
              <Link to="/teams" className="btn-primary flex-1 justify-center">
                <Trophy size={18} /> View Teams
              </Link>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Questions? Email <a href="mailto:utsavparajuli035@gmail.com" className="text-primary-500 hover:underline">utsavparajuli035@gmail.com</a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
