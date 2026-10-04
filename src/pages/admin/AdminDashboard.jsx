import React, { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, DollarSign, Trophy } from 'lucide-react';
import { getAllTeams } from '../../services/firestore';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className={`text-3xl font-heading font-bold mt-1 ${color}`}>{value}</p>
        {subtext && <p className="text-gray-400 text-xs mt-1">{subtext}</p>}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        color === 'text-primary-600' ? 'bg-primary-100' :
        color === 'text-yellow-600' ? 'bg-yellow-100' :
        color === 'text-green-600' ? 'bg-green-100' :
        color === 'text-red-600' ? 'bg-red-100' :
        'bg-blue-100'
      }`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = getAllTeams((data) => {
      setTeams(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const pending = teams.filter(t => t.status === 'pending').length;
  const approved = teams.filter(t => t.status === 'approved').length;
  const rejected = teams.filter(t => t.status === 'rejected').length;
  const paid = teams.filter(t => t.payment?.status === 'paid').length;
  const totalRevenue = paid * 500;

  const recentTeams = [...teams].slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-dark">Dashboard</h1>
        <p className="text-gray-500 text-sm">Husler Cup 2083 overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={Trophy} label="Total Teams" value={teams.length} color="text-primary-600" />
        <StatCard icon={Clock} label="Pending" value={pending} color="text-yellow-600" subtext="Needs review" />
        <StatCard icon={CheckCircle} label="Approved" value={approved} color="text-green-600" />
        <StatCard icon={XCircle} label="Rejected" value={rejected} color="text-red-600" />
        <StatCard icon={DollarSign} label="Revenue" value={`₹${totalRevenue}`} color="text-blue-600" subtext={`${paid} paid`} />
      </div>

      {/* Recent registrations */}
      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-dark">Recent Registrations</h2>
          <Link to="/admin/teams" className="text-primary-500 text-sm hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : recentTeams.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Trophy className="mx-auto mb-2" size={32} />
            <p>No registrations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>Reg. ID</th>
                  <th>Team Name</th>
                  <th>Category</th>
                  <th>Captain</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentTeams.map(t => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs text-primary-600 font-bold">{t.registrationId}</td>
                    <td className="font-medium">{t.teamName}</td>
                    <td>{t.category}</td>
                    <td className="text-gray-500">{t.captain?.name}</td>
                    <td>
                      <span className={`badge ${
                        t.status === 'approved' ? 'badge-approved' :
                        t.status === 'rejected' ? 'badge-rejected' :
                        'badge-pending'
                      }`}>{t.status}</span>
                    </td>
                    <td>
                      <span className={`badge ${t.payment?.status === 'paid' ? 'badge-approved' : 'badge-pending'}`}>
                        {t.payment?.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/teams?filter=pending', label: 'Review Pending Teams', count: pending, color: 'bg-yellow-500' },
          { to: '/admin/matches', label: 'Add Match Fixtures', count: null, color: 'bg-blue-500' },
          { to: '/admin/gallery', label: 'Upload Gallery Photos', count: null, color: 'bg-green-500' },
        ].map(({ to, label, count, color }) => (
          <Link
            key={to}
            to={to}
            className="card p-4 hover:shadow-lg transition-all group"
          >
            <div className={`w-8 h-1 ${color} rounded-full mb-3`} />
            <p className="font-semibold text-dark text-sm group-hover:text-primary-600 transition-colors">{label}</p>
            {count !== null && (
              <p className="text-2xl font-bold text-gray-300 mt-1">{count}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
