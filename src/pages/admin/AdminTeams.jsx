import React, { useEffect, useState } from 'react';
import { getAllTeams, updateTeamStatus, markPaymentPaid, deleteTeam, updateTeam } from '../../services/firestore';
import { exportToCSV, formatDate } from '../../utils/helpers';
import { 
  Search, Filter, Download, Eye, Check, X, DollarSign, Trash2, 
  ChevronDown, ChevronUp, User, Users, Pencil, Save, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TOURNAMENT } from '../../utils/constants';

// ─── VIEW TEAM MODAL ────────────────────────────────────────────────
const TeamModal = ({ team, onClose, onEdit }) => {
  if (!team) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src={team.logoUrl} 
              alt={team.teamName} 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.teamName)}&background=F57C00&color=fff`; }}
            />
            <div>
              <h2 className="font-heading font-bold text-dark text-lg">{team.teamName}</h2>
              <p className="text-gray-400 text-xs font-mono">{team.registrationId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onEdit(team); }}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Pencil size={14} /> Edit Team
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-dark rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {team.photoUrl && (
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Team Photo</p>
              <img src={team.photoUrl} alt="Team" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
            </div>
          )}

          {/* Details */}
          <div className="grid sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Team Details</p>
              <div className="space-y-1.5">
                <p><span className="text-gray-500">Category:</span> <span className="font-semibold">{team.category}</span></p>
                <p><span className="text-gray-500">City/Club:</span> <span className="font-semibold">{team.city}</span></p>
                <p>
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className={`badge ${team.status === 'approved' ? 'badge-approved' : team.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                    {team.status}
                  </span>
                </p>
                <p><span className="text-gray-500">Registered:</span> {formatDate(team.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Captain & Coach</p>
              <div className="space-y-1.5">
                <p><span className="text-gray-500">Captain:</span> <span className="font-semibold">{team.captain?.name}</span></p>
                <p><span className="text-gray-500">Phone:</span> <span className="font-semibold">{team.captain?.phone}</span></p>
                <p><span className="text-gray-500">Email:</span> <span className="font-semibold">{team.captain?.email}</span></p>
                {team.coach?.name && <p><span className="text-gray-500">Coach:</span> {team.coach.name} ({team.coach.phone || 'No phone'})</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-orange-50/50 border border-orange-200/60 rounded-xl p-4 text-sm">
            <p className="text-primary-800 text-xs font-bold uppercase mb-2">Payment Information</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <p><span className="text-gray-600">Method:</span> <span className="font-semibold">{team.payment?.method || 'eSewa'}</span></p>
              <p>
                <span className="text-gray-600">Status:</span>{' '}
                <span className={`badge ${team.payment?.status === 'paid' ? 'badge-approved' : 'badge-pending'}`}>
                  {team.payment?.status || 'pending'}
                </span>
              </p>
              <p className="col-span-2"><span className="text-gray-600">Transaction ID:</span> <span className="font-mono">{team.payment?.transactionId || 'None'}</span></p>
            </div>
            {team.payment?.screenshotUrl && (
              <div className="mt-2 pt-2 border-t border-orange-200/50">
                <p className="text-gray-600 text-xs mb-1 font-semibold">Payment Proof Screenshot:</p>
                <img src={team.payment.screenshotUrl} alt="Payment Receipt" className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-white" />
              </div>
            )}
          </div>

          {/* Players */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs font-semibold uppercase">Squad ({team.players?.length || 0} Players)</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {team.players?.map((p, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-dark text-sm">#{p.jerseyNumber} {p.name}</p>
                    <p className="text-gray-400 mt-0.5">{p.position} · DOB: {p.dob}</p>
                  </div>
                  <span className="text-primary-500 bg-primary-50 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                    P{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── EDIT TEAM MODAL ────────────────────────────────────────────────
const EditTeamModal = ({ team, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    teamName: team?.teamName || '',
    category: team?.category || 'Boys 5x5',
    city: team?.city || '',
    status: team?.status || 'pending',
    captain: {
      name: team?.captain?.name || '',
      phone: team?.captain?.phone || '',
      email: team?.captain?.email || '',
    },
    coach: {
      name: team?.coach?.name || '',
      phone: team?.coach?.phone || '',
    },
    payment: {
      method: team?.payment?.method || 'eSewa',
      status: team?.payment?.status || 'pending',
      transactionId: team?.payment?.transactionId || '',
    },
    players: team?.players && team.players.length === 5 
      ? [...team.players] 
      : [
          { name: '', jerseyNumber: '', dob: '', position: 'Point Guard' },
          { name: '', jerseyNumber: '', dob: '', position: 'Shooting Guard' },
          { name: '', jerseyNumber: '', dob: '', position: 'Small Forward' },
          { name: '', jerseyNumber: '', dob: '', position: 'Power Forward' },
          { name: '', jerseyNumber: '', dob: '', position: 'Center' },
        ],
  });
  const [saving, setSaving] = useState(false);

  const handlePlayerChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.players];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, players: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTeam(team.id, formData);
      toast.success('Team details updated successfully!');
      onSave();
      onClose();
    } catch (err) {
      console.error('Update team error:', err);
      toast.error('Failed to update team: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="font-heading font-bold text-dark text-lg flex items-center gap-2">
              <Pencil className="text-primary-500" size={18} /> Edit Team: {team.teamName}
            </h2>
            <p className="text-gray-400 text-xs font-mono">ID: {team.registrationId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-dark rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-3">1. Team Information</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="form-label text-xs">Team Name *</label>
                <input
                  required
                  value={formData.teamName}
                  onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="form-label text-xs">Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="form-input text-sm"
                >
                  {TOURNAMENT.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label text-xs">City / School / Club *</label>
                <input
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="form-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Status & Payment */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-3">2. Status & Payment</h3>
            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="form-label text-xs">Approval Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="form-input text-sm font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Payment Method</label>
                <select
                  value={formData.payment.method}
                  onChange={e => setFormData({ ...formData, payment: { ...formData.payment, method: e.target.value } })}
                  className="form-input text-sm"
                >
                  <option value="eSewa">eSewa</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Payment Status</label>
                <select
                  value={formData.payment.status}
                  onChange={e => setFormData({ ...formData, payment: { ...formData.payment, status: e.target.value } })}
                  className="form-input text-sm font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Transaction ID</label>
                <input
                  value={formData.payment.transactionId}
                  onChange={e => setFormData({ ...formData, payment: { ...formData.payment, transactionId: e.target.value } })}
                  className="form-input text-sm font-mono"
                  placeholder="Txn ID"
                />
              </div>
            </div>
          </div>

          {/* Captain & Coach */}
          <div>
            <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-3">3. Captain & Coach Details</h3>
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="form-label text-xs">Captain Name *</label>
                <input
                  required
                  value={formData.captain.name}
                  onChange={e => setFormData({ ...formData, captain: { ...formData.captain, name: e.target.value } })}
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="form-label text-xs">Captain Phone *</label>
                <input
                  required
                  value={formData.captain.phone}
                  onChange={e => setFormData({ ...formData, captain: { ...formData.captain, phone: e.target.value } })}
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="form-label text-xs">Captain Email *</label>
                <input
                  required
                  type="email"
                  value={formData.captain.email}
                  onChange={e => setFormData({ ...formData, captain: { ...formData.captain, email: e.target.value } })}
                  className="form-input text-sm"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Coach Name (Optional)</label>
                <input
                  value={formData.coach.name}
                  onChange={e => setFormData({ ...formData, coach: { ...formData.coach, name: e.target.value } })}
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="form-label text-xs">Coach Phone (Optional)</label>
                <input
                  value={formData.coach.phone}
                  onChange={e => setFormData({ ...formData, coach: { ...formData.coach, phone: e.target.value } })}
                  className="form-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* 5 Players */}
          <div>
            <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users size={16} className="text-primary-500" /> 4. Players (5 Required)
            </h3>
            <div className="space-y-3">
              {formData.players.map((p, i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-xl bg-gray-50/70">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-primary-500 text-white font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">Player {i + 1}</span>
                  </div>
                  <div className="grid sm:grid-cols-4 gap-2">
                    <div>
                      <input
                        required
                        value={p.name}
                        onChange={e => handlePlayerChange(i, 'name', e.target.value)}
                        placeholder="Full Name *"
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <input
                        required
                        type="number"
                        min="0"
                        max="99"
                        value={p.jerseyNumber}
                        onChange={e => handlePlayerChange(i, 'jerseyNumber', e.target.value)}
                        placeholder="Jersey # *"
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <input
                        required
                        type="date"
                        value={p.dob}
                        onChange={e => handlePlayerChange(i, 'dob', e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <select
                        value={p.position}
                        onChange={e => handlePlayerChange(i, 'position', e.target.value)}
                        className="form-input text-xs"
                      >
                        {['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'].map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm py-2 px-6 flex items-center gap-2"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MAIN ADMIN TEAMS PAGE ──────────────────────────────────────────
export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    const unsub = getAllTeams((data) => {
      setTeams(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = teams
    .filter(t => {
      const s = search.toLowerCase();
      const matchSearch = !s || t.teamName?.toLowerCase().includes(s) || t.registrationId?.toLowerCase().includes(s) || t.captain?.name?.toLowerCase().includes(s);
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === 'createdAt') { av = av?.toMillis?.() || 0; bv = bv?.toMillis?.() || 0; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const handleApprove = async (id) => {
    try { 
      await updateTeamStatus(id, 'approved'); 
      toast.success('Team approved! Now visible on public website.'); 
    } catch (err) { 
      toast.error('Failed to approve team: ' + (err.message || 'Error')); 
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this team registration?')) return;
    try { 
      await updateTeamStatus(id, 'rejected'); 
      toast.success('Team marked as rejected'); 
    } catch (err) { 
      toast.error('Failed to reject team: ' + (err.message || 'Error')); 
    }
  };

  const handleMarkPaid = async (id) => {
    try { 
      await markPaymentPaid(id); 
      toast.success('Payment marked as paid!'); 
    } catch (err) { 
      toast.error('Failed to update payment: ' + (err.message || 'Error')); 
    }
  };

  const handleDelete = async (team) => {
    const teamId = team.id;
    if (!teamId) {
      toast.error('Missing team ID');
      return;
    }
    if (!confirm(`Delete team "${team.teamName}" (${team.registrationId}) permanently? This cannot be undone.`)) {
      return;
    }
    const tId = toast.loading(`Deleting team "${team.teamName}"...`);
    try {
      await deleteTeam(teamId);
      toast.dismiss(tId);
      toast.success('Team deleted permanently!');
      if (selected?.id === teamId) setSelected(null);
      if (editingTeam?.id === teamId) setEditingTeam(null);
    } catch (err) {
      console.error('Delete team error:', err);
      toast.dismiss(tId);
      toast.error('Failed to delete team: ' + (err.message || 'Permission denied'));
    }
  };

  const SortIcon = ({ field }) => (
    sortField === field
      ? (sortDir === 'asc' ? <ChevronUp size={14} className="text-primary-500" /> : <ChevronDown size={14} className="text-primary-500" />)
      : <ChevronDown size={14} className="text-gray-300" />
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark">Teams Management</h1>
          <p className="text-gray-500 text-sm">{filtered.length} of {teams.length} teams registered</p>
        </div>
        <button
          onClick={() => exportToCSV(filtered)}
          className="btn-secondary text-sm py-2 flex items-center gap-1.5"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by team name, ID, captain..."
            className="form-input pl-9 text-sm"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input text-sm sm:w-44">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="form-input text-sm sm:w-44">
          <option value="all">All Categories</option>
          {TOURNAMENT.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading registered teams...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Users className="mx-auto mb-2 text-gray-300" size={36} />
              <p className="font-semibold text-gray-600">No teams found</p>
              <p className="text-xs text-gray-400 mt-1">Teams registered by users will appear here</p>
            </div>
          ) : (
            <table className="w-full admin-table text-sm">
              <thead>
                <tr>
                  <th><button className="flex items-center gap-1 font-bold" onClick={() => handleSort('registrationId')}>ID <SortIcon field="registrationId" /></button></th>
                  <th><button className="flex items-center gap-1 font-bold" onClick={() => handleSort('teamName')}>Team <SortIcon field="teamName" /></button></th>
                  <th>Category</th>
                  <th>Captain</th>
                  <th className="text-center">Players</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th><button className="flex items-center gap-1 font-bold" onClick={() => handleSort('createdAt')}>Date <SortIcon field="createdAt" /></button></th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="font-mono text-xs text-primary-600 font-bold whitespace-nowrap">{t.registrationId}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={t.logoUrl} 
                          alt={t.teamName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-primary-300"
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.teamName)}&background=F57C00&color=fff&size=32`; }}
                        />
                        <div>
                          <span className="font-bold text-dark block leading-snug">{t.teamName}</span>
                          <span className="text-[11px] text-gray-400 block">{t.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-xs text-gray-600">{t.category}</td>
                    <td className="whitespace-nowrap">
                      <p className="font-medium text-dark text-xs">{t.captain?.name}</p>
                      <p className="text-[11px] text-gray-400">{t.captain?.phone}</p>
                    </td>
                    <td className="text-center font-semibold text-xs text-gray-700">{t.players?.length || 0}</td>
                    <td>
                      <span className={`badge ${t.status === 'approved' ? 'badge-approved' : t.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${t.payment?.status === 'paid' ? 'badge-approved' : 'badge-pending'}`}>
                        {t.payment?.status || 'pending'}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400 whitespace-nowrap">{formatDate(t.createdAt)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View */}
                        <button
                          onClick={() => setSelected(t)}
                          title="View Details"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditingTeam(t)}
                          title="Edit Team"
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Approve */}
                        {t.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(t.id)}
                            title="Approve Team"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {/* Reject */}
                        {t.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(t.id)}
                            title="Reject Team"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}

                        {/* Mark Paid */}
                        {t.payment?.status !== 'paid' && (
                          <button
                            onClick={() => handleMarkPaid(t.id)}
                            title="Mark as Paid"
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <DollarSign size={16} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(t)}
                          title="Delete Team Permanently"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      {selected && (
        <TeamModal 
          team={selected} 
          onClose={() => setSelected(null)} 
          onEdit={(t) => setEditingTeam(t)}
        />
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onSave={() => {}}
        />
      )}
    </div>
  );
}
