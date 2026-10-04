import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ChevronDown, ChevronUp, AlertCircle, BookOpen, Clock, Award } from 'lucide-react';

const faqData = [
  { q: 'Who can participate in the tournament?', a: 'Boys team (ages 12–25) can participate in the 5×5 category. Each team must have 5–10 registered players.' },
  { q: 'What is the registration fee and deadline?', a: 'The registration fee is ₹500 per team. Deadline for registration is 28 Ashwin 2083.' },
  { q: 'What documents are required during registration?', a: 'You need the team logo, team photo, player details (name, jersey number, age, position), captain contact info, and payment proof (screenshot).' },
  { q: 'Can a player play for more than one team?', a: 'No. Each player can only be registered under one team. Playing for multiple teams will lead to disqualification.' },
  { q: 'What happens if our payment is not confirmed?', a: 'Teams whose payment is not confirmed will be listed as "pending" and will not appear on the approved teams list until admin verifies the payment.' },
  { q: 'Can we make changes to the team after registration?', a: 'Minor changes can be requested by contacting the organizers before the deadline. No changes will be accepted after 28 Ashwin 2083.' },
  { q: 'How will the tournament format work?', a: 'Teams will play in group stages followed by knockout rounds. The final schedule and bracket will be announced after team registration closes.' },
  { q: 'What if a match is tied?', a: 'In knockout rounds, tied matches will proceed to overtime and then free throws if necessary.' },
];

const rules = [
  { category: 'Team Rules', items: [
    'Each team must have 5 to 10 registered players.',
    'A minimum of 5 players must be present to start a match.',
    'All players must wear matching jerseys with visible numbers.',
    'Each team must have a captain who acts as the spokesperson.',
    'Late arrivals (more than 10 minutes) will result in a walkover.',
  ]},
  { category: 'Game Rules', items: [
    'All matches will follow standard FIBA basketball rules.',
    'Match duration: 4 quarters × 10 minutes (stop clock).',
    'Each team gets 2 timeouts per half.',
    'A player with 5 fouls is disqualified from the game.',
    'Three-point line and free-throw rules per FIBA regulations.',
  ]},
  { category: 'Conduct Rules', items: [
    'Unsportsmanlike conduct, violence, or abusive language will result in immediate disqualification.',
    'Coaches and managers must remain in the designated area.',
    'Spectators must maintain decorum; the organizers may remove disruptive spectators.',
    'Any dispute must be raised through the captain to the referee.',
    'Referee decisions are final during the game.',
  ]},
  { category: 'Payment & Registration', items: [
    'Registration fee of ₹500 must be paid before the deadline.',
    'Payment of ₹500 is accepted via eSewa only (scan the QR code on the registration form).',
    'Provide a valid transaction ID or payment screenshot.',
    'Registration is confirmed only after payment verification by the admin.',
    'Fees are non-refundable once confirmed.',
  ]},
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-primary-400' : 'border-gray-200'}`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-primary-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-dark text-sm sm:text-base pr-4">{question}</span>
        {open ? <ChevronUp className="text-primary-500 shrink-0" size={20} /> : <ChevronDown className="text-gray-400 shrink-0" size={20} />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed animate-fade-in border-t border-gray-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function InfoRules() {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark via-[#1a1200] to-dark py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/40 rounded-full px-4 py-1.5 mb-4">
            <BookOpen size={14} className="text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">Tournament Info</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black mb-3">
            Info & <span className="text-primary-500">Rules</span>
          </h1>
          <p className="text-gray-300 text-lg">Everything you need to know about the Husler Cup 2083</p>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Clock className="text-primary-500" size={20} />
            </div>
            <h2 className="text-2xl font-heading font-bold text-dark">Tournament Schedule</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { date: '28 Ashwin 2083', event: 'Registration Deadline', note: 'Last day to register your team', color: 'bg-red-500' },
              { date: '30 Ashwin 2083', event: 'Tournament Day', note: 'Glorious Academy, Chitwan', color: 'bg-primary-500' },
              { date: 'Opening Ceremony', event: 'Welcome & Inaugural Match', note: 'Morning session', color: 'bg-blue-500' },
              { date: 'Award Ceremony', event: 'Prize Distribution', note: 'Evening closing', color: 'bg-yellow-500' },
            ].map((item, i) => (
              <div key={i} className="card p-4 flex items-start gap-4">
                <div className={`${item.color} text-white rounded-xl px-3 py-2 text-xs font-bold shrink-0`}>
                  {item.date}
                </div>
                <div>
                  <p className="font-semibold text-dark">{item.event}</p>
                  <p className="text-gray-500 text-sm">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Award className="text-primary-500" size={20} />
            </div>
            <h2 className="text-2xl font-heading font-bold text-dark">Rules & Regulations</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {rules.map((section) => (
              <div key={section.category} className="card p-6">
                <h3 className="font-heading font-bold text-dark mb-4 text-lg border-b border-primary-100 pb-2">
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary-500 font-bold mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Warning */}
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-orange-800 text-sm">Important Notice</p>
              <p className="text-orange-700 text-sm mt-1">
                Violation of any rules may result in disqualification without refund. All participating teams are required to sign the consent form and agree to the risk acknowledgement during registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-dark mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500">Can't find an answer? <a href="mailto:utsavparajuli035@gmail.com" className="text-primary-500 hover:underline">Contact us</a></p>
          </div>
          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
