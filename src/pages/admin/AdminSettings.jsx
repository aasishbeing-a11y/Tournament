import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSettings, updateSettings } from '../../services/firestore';
import { Save, Settings, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Countdown from '../../components/Countdown';

const schema = z.object({
  name: z.string().min(2, 'Tournament name required'),
  dates: z.string().min(2, 'Dates required'),
  venue: z.string().min(2, 'Venue required'),
  fee: z.number().min(0, 'Fee must be positive'),
  deadline: z.string().min(2, 'Deadline required'),
  contact: z.string().email('Valid email required'),
  registrationOpen: z.boolean(),
  countdownTarget: z.string().optional(),
});

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const liveCountdownTarget = watch('countdownTarget');

  useEffect(() => {
    getSettings().then(data => {
      reset({
        ...data,
        fee: Number(data.fee) || 500,
        countdownTarget: data.countdownTarget || '2026-10-16T09:00',
        registrationOpen: data.registrationOpen !== false,
      });
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      await updateSettings(data);
      toast.success('Settings and countdown saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Failed to save settings: ' + (err.message || 'Error'));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-dark">Tournament Settings</h1>
        <p className="text-gray-500 text-sm">Control tournament info, fees, status, and the public countdown timer</p>
      </div>

      {/* Countdown Controller Card */}
      <div className="card p-6 bg-gradient-to-br from-dark via-[#1a1200] to-dark text-white border-2 border-primary-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-primary-500" size={20} />
          <h2 className="text-lg font-heading font-bold">Public Countdown Controller</h2>
        </div>
        <p className="text-gray-300 text-xs mb-4">
          Change this target date/time to control the countdown timer on the Home page in real time.
        </p>

        <div className="py-2 flex justify-center">
          <Countdown targetDate={liveCountdownTarget ? new Date(liveCountdownTarget) : undefined} />
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="set-name">Tournament Name</label>
            <input id="set-name" {...register('name')} className="form-input" />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          {/* Countdown Target Date & Time */}
          <div className="bg-primary-50/70 p-4 rounded-xl border border-primary-200">
            <label className="form-label text-primary-900 font-semibold flex items-center gap-1.5" htmlFor="set-countdown">
              <Clock size={16} className="text-primary-600" /> Countdown Target Date & Time *
            </label>
            <input
              id="set-countdown"
              type="datetime-local"
              {...register('countdownTarget')}
              className="form-input bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              The public home page countdown will count down directly to this exact moment.
            </p>
            {errors.countdownTarget && <p className="form-error">{errors.countdownTarget.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="set-dates">Event Date(s) (Display Text)</label>
              <input id="set-dates" {...register('dates')} className="form-input" placeholder="30 Ashwin 2083" />
              {errors.dates && <p className="form-error">{errors.dates.message}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="set-deadline">Registration Deadline (Display Text)</label>
              <input id="set-deadline" {...register('deadline')} className="form-input" placeholder="28 Ashwin 2083" />
              {errors.deadline && <p className="form-error">{errors.deadline.message}</p>}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="set-venue">Venue</label>
            <input id="set-venue" {...register('venue')} className="form-input" />
            {errors.venue && <p className="form-error">{errors.venue.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="set-fee">Registration Fee (₹)</label>
            <input
              id="set-fee"
              type="number"
              {...register('fee', { valueAsNumber: true })}
              className="form-input"
            />
            {errors.fee && <p className="form-error">{errors.fee.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="set-contact">Contact Email</label>
            <input id="set-contact" type="email" {...register('contact')} className="form-input" />
            {errors.contact && <p className="form-error">{errors.contact.message}</p>}
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="font-semibold text-dark text-sm">Registration Status</p>
              <p className="text-gray-500 text-xs">Toggle to open or close team registrations on the website</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('registrationOpen')} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center text-base py-3"
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving Settings...</>
            ) : (
              <><Save size={18} /> Save & Apply All Settings</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
