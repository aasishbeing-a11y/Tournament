import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, Star, ChevronRight, Zap, Shield, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import Countdown from '../components/Countdown';
import { TOURNAMENT } from '../utils/constants';

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="glass rounded-2xl p-4 text-center">
    <Icon className="text-primary-400 mx-auto mb-2" size={24} />
    <div className="text-2xl font-bold font-heading text-white">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

const PrizeCard = ({ place, label, icon }) => (
  <div className={`card p-6 text-center border-2 ${
    place === '1st' ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 to-white' 
    : place === '2nd' ? 'border-gray-300 bg-gradient-to-b from-gray-50 to-white'
    : 'border-amber-700 bg-gradient-to-b from-amber-50 to-white'
  }`}>
    <div className="text-5xl mb-3">{icon}</div>
    <div className={`text-2xl font-bold font-heading mb-1 ${
      place === '1st' ? 'text-yellow-600' : place === '2nd' ? 'text-gray-500' : 'text-amber-700'
    }`}>{place} Place</div>
    <p className="text-gray-600 text-sm">{label}</p>
  </div>
);

const HighlightCard = ({ icon: Icon, title, desc }) => (
  <div className="card p-6 group">
    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
      <Icon className="text-primary-500 group-hover:text-white transition-colors" size={24} />
    </div>
    <h3 className="font-heading font-bold text-dark mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-white text-[200px] font-bold select-none pointer-events-none">🏀</div>
          <div className="absolute bottom-10 right-10 text-white text-[150px] font-bold select-none pointer-events-none rotate-12">🏀</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/40 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-primary-400 text-sm font-medium">Registration Open!</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black mb-4 leading-none">
                HUSLER
                <span className="block text-primary-500">CUP</span>
                <span className="block text-2xl sm:text-3xl font-semibold text-gray-300 mt-2">2083</span>
              </h1>

              <div className="space-y-2 mb-8 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary-500" />
                  <span className="text-sm sm:text-base">{TOURNAMENT.dates}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary-500" />
                  <span className="text-sm sm:text-base">{TOURNAMENT.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary-500" />
                  <span className="text-sm sm:text-base">Categories: {TOURNAMENT.categories.join(', ')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary text-base">
                  <Trophy size={18} /> Register Your Team
                </Link>
                <Link to="/info" className="btn-secondary text-base">
                  Learn More <ChevronRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right content — logo + countdown */}
            <div className="flex flex-col items-center gap-8 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-3xl scale-110" />
                <img
                  src={TOURNAMENT.logoUrl}
                  alt="Husler Cup Logo"
                  className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full object-contain ring-4 ring-primary-500 shadow-2xl hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23F57C00"/><text y=".9em" font-size="60" x="50%" text-anchor="middle" dominant-baseline="middle" fill="white">🏀</text></svg>';
                  }}
                />
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4 uppercase tracking-widest">Event Starts In</p>
                <Countdown />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                <StatCard icon={Trophy} value="₹500" label="Reg. Fee" />
                <StatCard icon={Users} value="5v5" label="Format" />
                <StatCard icon={Star} value="2" label="Prizes" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-2">About the Tournament</p>
            <h2 className="section-title">The Premier Basketball<br />Event in Chitwan</h2>
            <div className="w-16 h-1 bg-primary-500 rounded-full mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <HighlightCard
              icon={Zap}
              title="Competitive Action"
              desc="Experience high-energy basketball at its finest. Teams compete in the Boys 5x5 category for ultimate glory."
            />
            <HighlightCard
              icon={Shield}
              title="Fair Play"
              desc="Professional referees, clear rulebooks, and a commitment to sportsmanship make every game fair and exciting."
            />
            <HighlightCard
              icon={Clock}
              title="Registration Open"
              desc={`Register before ${TOURNAMENT.deadline} with a fee of ₹${TOURNAMENT.fee}. Spots are limited — don't miss out!`}
            />
          </div>
        </div>
      </section>

      {/* Registration Deadline Banner */}
      <section className="py-6 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white text-center sm:text-left">
              <p className="font-bold text-lg">⏰ Registration Deadline: {TOURNAMENT.deadline}</p>
              <p className="text-primary-100 text-sm">Registration fee: ₹{TOURNAMENT.fee} | Don't miss your chance!</p>
            </div>
            <Link to="/register" className="bg-white text-primary-600 hover:bg-primary-50 font-bold px-6 py-3 rounded-xl transition-all shrink-0">
              Register Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-2">Prizes</p>
            <h2 className="section-title">Win Big at Husler Cup</h2>
            <div className="w-16 h-1 bg-primary-500 rounded-full mx-auto mt-4" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PrizeCard place="1st" label="Champion Trophy + Cash Prize" icon="🥇" />
            <PrizeCard place="2nd" label="Runner-up Trophy + Cash Prize" icon="🥈" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-2">Competition</p>
            <h2 className="section-title">Tournament Categories</h2>
            <div className="w-16 h-1 bg-primary-500 rounded-full mx-auto mt-4" />
          </div>
          <div className="flex justify-center">
            <div className="card p-8 text-center max-w-sm w-full border-2 border-primary-100 hover:border-primary-500 transition-colors">
              <div className="text-6xl mb-4">🏀</div>
              <h3 className="font-heading font-bold text-2xl text-dark mb-2">Boys 5×5</h3>
              <p className="text-gray-500">Full court basketball — 5 players per side. The classic format for teams that want to showcase their full game.</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Players per team</span>
                  <span className="font-semibold text-dark">5–10</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Registration fee</span>
                  <span className="font-semibold text-primary-500">₹{TOURNAMENT.fee}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center text-white select-none">🏆</div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-heading font-black mb-4">
            Ready to compete?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Register your team before {TOURNAMENT.deadline} and take your shot at the Husler Cup championship!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg py-4 px-8">
              <Trophy size={20} /> Register Your Team
            </Link>
            <Link to="/contact" className="btn-secondary text-lg py-4 px-8 border-white text-white hover:bg-white hover:text-dark">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
