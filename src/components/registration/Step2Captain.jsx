import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step2Captain() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark mb-1">Captain & Contact</h2>
        <p className="text-gray-500 text-sm">Provide the team captain and coach/manager details</p>
      </div>

      <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Team Captain</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="captainName">Captain Name *</label>
          <input id="captainName" {...register('captainName')} className="form-input" placeholder="Full name" />
          {errors.captainName && <p className="form-error">{errors.captainName.message}</p>}
        </div>
        <div>
          <label className="form-label" htmlFor="captainPhone">Phone / WhatsApp *</label>
          <input id="captainPhone" {...register('captainPhone')} className="form-input" placeholder="98XXXXXXXX" />
          {errors.captainPhone && <p className="form-error">{errors.captainPhone.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="captainEmail">Email Address *</label>
        <input id="captainEmail" type="email" {...register('captainEmail')} className="form-input" placeholder="captain@example.com" />
        {errors.captainEmail && <p className="form-error">{errors.captainEmail.message}</p>}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-4">Coach / Manager (Optional)</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="coachName">Coach/Manager Name</label>
            <input id="coachName" {...register('coachName')} className="form-input" placeholder="Full name" />
          </div>
          <div>
            <label className="form-label" htmlFor="coachPhone">Coach/Manager Phone</label>
            <input id="coachPhone" {...register('coachPhone')} className="form-input" placeholder="98XXXXXXXX" />
          </div>
        </div>
      </div>
    </div>
  );
}
