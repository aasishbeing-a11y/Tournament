import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import { getApprovedTeams } from '../services/firestore';
import { TeamCardSkeleton } from '../components/Skeletons';
import { TOURNAMENT } from '../utils/constants';

const TeamCard = ({ team }) => (
  <div className="card p-4 hover:-translate-y-1 transition-transform duration-300 group">
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-3">
        <img
          src={team.logoUrl}
          alt={team.teamName}
          className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 group-hover:border-primary-400 transition-colors"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.teamName)}&background=F57C00&color=fff&size=80`;
          }}
        />
      </div>
      <h3 className="font-heading font-bold text-dark text-base mb-1 line-clamp-2">{team.teamName}</h3>
      <span className="badge bg-primary-100 text-primary-700 mb-1">{team.category}</span>
      <p className="text-gray-500 text-xs">{team.city}</p>
      {team.photoUrl && (
        <div className="mt-3 w-full">
          <img
            src={team.photoUrl}
            alt={`${team.teamName} photo`}
            className="w-full h-24 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}
    </div>
  </div>
);

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const unsub = getApprovedTeams((data) => {
      setTeams(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = teams.filter(t => {
    const matchSearch = t.teamName.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark via-[#1a1200] to-dark py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-black mb-2">
            Registered <span className="text-primary-500">Teams</span>
          </h1>
          <p className="text-gray-300">
            {loading ? 'Loading...' : `${teams.length} approved team${teams.length !== 1 ? 's' : ''} so far`}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search teams or city..."
                className="form-input pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="form-input pl-10 pr-8"
              >
                <option value="All">All Categories</option>
                {TOURNAMENT.categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Teams grid */}
      <section className="py-10 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => <TeamCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏀</div>
              <h3 className="text-xl font-heading font-bold text-dark mb-2">
                {teams.length === 0 ? 'No teams yet' : 'No teams match your search'}
              </h3>
              <p className="text-gray-500">
                {teams.length === 0
                  ? 'Be the first to register your team!'
                  : 'Try a different search term or category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(team => <TeamCard key={team.id} team={team} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
