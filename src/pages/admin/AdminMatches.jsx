import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getMatches, addMatch, updateMatch, deleteMatch } from '../../services/firestore';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '../../utils/helpers';
import { Timestamp } from 'firebase/firestore';

const schema = z.object({
  teamA: z.string().min(1, 'Team A required'),
  teamB: z.string().min(1, 'Team B required'),
  scheduledAt: z.string().min(1, 'Date/time required'),
  round: z.string().min(1, 'Round required'),
  court: z.string().optional(),
  venue: z.string().optional(),
  status: z.enum(['upcoming', 'live', 'completed']),
  scoreA: z.string().optional(),
  scoreB: z.string().optional(),
});

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const unsub = getMatches((data) => { setMatches(data); setLoading(false); });
    return unsub;
  }, []);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'upcoming', round: 'Group Stage' },
  });

  const openEdit = (match) => {
    setEditing(match);
    const dt = match.scheduledAt?.toDate?.();
    setValue('teamA', match.teamA);
    setValue('teamB', match.teamB);
    setValue('scheduledAt', dt ? dt.toISOString().slice(0, 16) : '');
    setValue('round', match.round);
    setValue('court', match.court);
    setValue('venue', match.venue);
    setValue('status', match.status);
    setValue('scoreA', match.scoreA?.toString());
    setValue('scoreB', match.scoreB?.toString());
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        scheduledAt: Timestamp.fromDate(new Date(data.scheduledAt)),
        scoreA: data.scoreA ? parseInt(data.scoreA) : null,
        scoreB: data.scoreB ? parseInt(data.scoreB) : null,
      };
      if (editing) {
        await updateMatch(editing.id, payload);
        toast.success('Match updated!');
      } else {
        await addMatch(payload);
        toast.success('Match added!');
      }
      reset();
      setShowForm(false);
      setEditing(null);
    } catch {
      toast.error('Failed to save match');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this match?')) return;
    try { await deleteMatch(id); toast.success('Match deleted'); }
    catch { toast.error('Failed to delete match'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark">Matches</h1>
          <p className="text-gray-500 text-sm">{matches.length} fixtures</p>
        </div>
        <button
          onClick={() => { setEditing(null); reset(); setShowForm(!showForm); }}
          className="btn-primary text-sm py-2"
        >
          <Plus size={16} /> Add Match
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5">
          <h3 className="font-bold text-dark mb-4">{editing ? 'Edit Match' : 'Add New Match'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Team A *</label>
                <input {...register('teamA')} className="form-input text-sm" placeholder="Team A name" />
                {errors.teamA && <p className="form-error">{errors.teamA.message}</p>}
              </div>
              <div>
                <label className="form-label text-xs">Team B *</label>
                <input {...register('teamB')} className="form-input text-sm" placeholder="Team B name" />
                {errors.teamB && <p className="form-error">{errors.teamB.message}</p>}
              </div>
              <div>
                <label className="form-label text-xs">Date & Time *</label>
                <input type="datetime-local" {...register('scheduledAt')} className="form-input text-sm" />
                {errors.scheduledAt && <p className="form-error">{errors.scheduledAt.message}</p>}
              </div>
              <div>
                <label className="form-label text-xs">Round *</label>
                <select {...register('round')} className="form-input text-sm">
                  <option>Group Stage</option>
                  <option>Quarter Final</option>
                  <option>Semi Final</option>
                  <option>Final</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Court</label>
                <input {...register('court')} className="form-input text-sm" placeholder="e.g. Court 1" />
              </div>
              <div>
                <label className="form-label text-xs">Venue</label>
                <input {...register('venue')} className="form-input text-sm" placeholder="Glorious Academy" />
              </div>
              <div>
                <label className="form-label text-xs">Status</label>
                <select {...register('status')} className="form-input text-sm">
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Score A</label>
                <input type="number" {...register('scoreA')} className="form-input text-sm" placeholder="0" />
              </div>
              <div>
                <label className="form-label text-xs">Score B</label>
                <input type="number" {...register('scoreB')} className="form-input text-sm" placeholder="0" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="btn-primary text-sm py-2">
                {isSubmitting ? 'Saving...' : editing ? 'Update Match' : 'Add Match'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="btn-secondary text-sm py-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Matches list */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : matches.length === 0 ? (
          <div className="p-8 text-center text-gray-400"><Calendar className="mx-auto mb-2" size={32} /><p>No matches yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Teams</th>
                  <th>Score</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(m => (
                  <tr key={m.id}>
                    <td><span className="badge bg-primary-100 text-primary-700">{m.round}</span></td>
                    <td className="font-medium whitespace-nowrap">{m.teamA} <span className="text-gray-400 mx-1">vs</span> {m.teamB}</td>
                    <td className="font-bold whitespace-nowrap">{m.scoreA ?? '–'} : {m.scoreB ?? '–'}</td>
                    <td className="text-xs text-gray-500 whitespace-nowrap">{m.scheduledAt ? `${formatDate(m.scheduledAt)} ${formatTime(m.scheduledAt)}` : 'TBD'}</td>
                    <td className="text-xs text-gray-500">{m.venue || '—'}</td>
                    <td>
                      <span className={`badge ${m.status === 'completed' ? 'badge-approved' : m.status === 'live' ? 'bg-red-100 text-red-700' : 'badge-pending'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(m)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
