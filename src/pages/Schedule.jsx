import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getMatches } from '../services/firestore';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { formatDate, formatTime } from '../utils/helpers';
import { PageSkeleton } from '../components/Skeletons';

const MatchCard = ({ match }) => {
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  return (
    <div className={`card p-5 border-l-4 ${
      isLive ? 'border-red-500 bg-red-50' :
      isCompleted ? 'border-green-500' :
      'border-primary-300'
    }`}>
      {isLive && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-600 text-xs font-bold uppercase">Live Now</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <span className={`badge ${
          isCompleted ? 'bg-green-100 text-green-700' :
          isLive ? 'bg-red-100 text-red-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {match.round || 'Group Stage'}
        </span>
        <span className="text-gray-400 text-xs">{match.court || 'Court 1'}</span>
      </div>

      {/* Teams and score */}
      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <p className="font-heading font-bold text-dark text-base sm:text-lg">{match.teamA || 'TBD'}</p>
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-xl text-center min-w-[80px]">
          {isCompleted ? (
            <p className="font-bold font-heading text-xl text-dark">
              {match.scoreA ?? 0} – {match.scoreB ?? 0}
            </p>
          ) : (
            <p className="font-bold text-gray-400 text-sm">VS</p>
          )}
        </div>
        <div className="flex-1">
          <p className="font-heading font-bold text-dark text-base sm:text-lg">{match.teamB || 'TBD'}</p>
        </div>
      </div>

      {isCompleted && match.scoreA !== match.scoreB && (
        <p className="text-center text-xs text-green-600 font-semibold mt-2">
          🏆 Winner: {match.scoreA > match.scoreB ? match.teamA : match.teamB}
        </p>
      )}

      {/* Info row */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Calendar size={12} />
          <span>{match.scheduledAt ? formatDate(match.scheduledAt) : 'TBD'}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock size={12} />
          <span>{match.scheduledAt ? formatTime(match.scheduledAt) : 'TBD'}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <MapPin size={12} />
          <span>{match.venue || 'Glorious Academy'}</span>
        </div>
      </div>
    </div>
  );
};

export default function Schedule() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = getMatches((data) => {
      setMatches(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <Layout><PageSkeleton /></Layout>;

  const upcoming = matches.filter(m => m.status !== 'completed');
  const completed = matches.filter(m => m.status === 'completed');

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark via-[#1a1200] to-dark py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-black mb-2">
            Schedule & <span className="text-primary-500">Results</span>
          </h1>
          <p className="text-gray-300">Fixtures, scores and live updates</p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {matches.length === 0 ? (
            <div className="text-center py-20 card p-10">
              <Calendar className="mx-auto text-gray-300 mb-4" size={56} />
              <h3 className="text-xl font-heading font-bold text-dark mb-2">Schedule Coming Soon</h3>
              <p className="text-gray-500">Match fixtures will be published after team registration closes.</p>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-heading font-bold text-dark mb-4 flex items-center gap-2">
                    <Clock className="text-primary-500" size={20} /> Upcoming Matches ({upcoming.length})
                  </h2>
                  <div className="space-y-4">
                    {upcoming.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </div>
              )}

              {completed.length > 0 && (
                <div>
                  <h2 className="text-lg font-heading font-bold text-dark mb-4 flex items-center gap-2">
                    <Trophy className="text-green-500" size={20} /> Completed Matches ({completed.length})
                  </h2>
                  <div className="space-y-4">
                    {completed.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
