import { useEffect, useState } from 'react';
import { getSettings } from '../services/firestore';

export const TOURNAMENT = {
  name: 'HUSLER CUP',
  dates: '30 Ashwin 2083',
  venue: 'GLORIOUS ACADEMY CHITWAN',
  fee: 500,
  deadline: '28 Ashwin 2083',
  registrationOpen: true,
  contact: 'utsavparajuli035@gmail.com',
  categories: ['Boys 5x5'],
  prizes: [
    { place: '1st', label: 'Champion Trophy + Prize' },
    { place: '2nd', label: 'Runner-up Trophy + Prize' },
  ],
  // Event date in AD: approx Oct 16, 2026 (30 Ashwin 2083 BS)
  eventDate: new Date('2026-10-16T09:00:00+05:45'),
  deadlineDate: new Date('2026-10-14T23:59:59+05:45'),
  logoUrl: 'https://i.ibb.co/gMctSmqj/logo-hc-Photoroom.png',
  designerUrl: 'https://i.ibb.co/pr95pS5h/aashishgraphics.png',
};

export const useTournamentSettings = () => {
  const [settings, setSettings] = useState(TOURNAMENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
};
