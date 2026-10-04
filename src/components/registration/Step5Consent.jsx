import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Shield, AlertTriangle, CheckCircle, User, Users } from 'lucide-react';

const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-dark font-medium text-sm text-right max-w-[60%] truncate">{value || '—'}</span>
  </div>
);

export default function Step5Consent({ formValues }) {
  const { register, formState: { errors } } = useFormContext();
  const v = formValues || {};

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark mb-1">Review & Submit</h2>
        <p className="text-gray-500 text-sm">Review your information and accept the terms before submitting.</p>
      </div>

      {/* Review summary */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-dark mb-3 flex items-center gap-2 text-sm">
          <User size={16} className="text-primary-500" /> Team Summary
        </h3>
        <ReviewRow label="Team Name" value={v.teamName} />
        <ReviewRow label="Category" value={v.category} />
        <ReviewRow label="City / Club" value={v.city} />
        <ReviewRow label="Captain" value={v.captainName} />
        <ReviewRow label="Captain Phone" value={v.captainPhone} />
        <ReviewRow label="Captain Email" value={v.captainEmail} />
        {v.coachName && <ReviewRow label="Coach" value={v.coachName} />}
        <ReviewRow label="Players" value={`${v.players?.length || 0} registered`} />
        <ReviewRow label="Payment Method" value={v.paymentMethod} />
        <ReviewRow label="Transaction ID" value={v.transactionId} />
      </div>

      {/* Players list */}
      {v.players?.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-dark mb-3 flex items-center gap-2 text-sm">
            <Users size={16} className="text-primary-500" /> Players ({v.players.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {v.players.map((p, i) => (
              <div key={i} className="bg-white rounded-lg p-2 border border-gray-100 text-xs">
                <p className="font-semibold text-dark">#{p.jerseyNumber} {p.name}</p>
                <p className="text-gray-400">{p.position} · DOB: {p.dob}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consent checkboxes */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('acceptRules')}
            className="mt-1 accent-primary-500 w-4 h-4"
          />
          <div>
            <p className="text-sm text-dark group-hover:text-primary-600 transition-colors">
              <Shield className="inline mr-1 text-primary-500" size={14} />
              I have read and agree to all the{' '}
              <a href="/info" target="_blank" className="text-primary-500 underline">tournament rules and regulations</a>.
            </p>
            {errors.acceptRules && <p className="form-error">{errors.acceptRules.message}</p>}
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('acceptRisk')}
            className="mt-1 accent-primary-500 w-4 h-4"
          />
          <div>
            <p className="text-sm text-dark group-hover:text-primary-600 transition-colors">
              <AlertTriangle className="inline mr-1 text-orange-500" size={14} />
              I acknowledge the inherent risks of playing basketball and take full responsibility for the safety of all registered players.
            </p>
            {errors.acceptRisk && <p className="form-error">{errors.acceptRisk.message}</p>}
          </div>
        </label>
      </div>

      {/* Typed signature */}
      <div>
        <label className="form-label" htmlFor="signature">
          <CheckCircle className="inline mr-1 text-green-500" size={14} />
          Type your full name as a digital signature *
        </label>
        <input
          id="signature"
          {...register('signature')}
          className="form-input font-serif italic"
          placeholder="Your full name"
        />
        {errors.signature && <p className="form-error">{errors.signature.message}</p>}
        <p className="text-xs text-gray-400 mt-1">By typing your name, you confirm all information is accurate and complete.</p>
      </div>
    </div>
  );
}
