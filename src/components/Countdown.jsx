import React, { useState, useEffect } from 'react';
import { getCountdown } from '../utils/helpers';
import { TOURNAMENT } from '../utils/constants';
import { onSettingsChange } from '../services/firestore';

const Block = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-primary-500 text-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg border border-primary-400/30">
      <span className="text-2xl sm:text-3xl font-bold font-heading">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-xs sm:text-sm text-gray-300 mt-2 uppercase tracking-wider font-medium">{label}</span>
  </div>
);

export default function Countdown({ targetDate: initialTargetDate }) {
  const [activeTarget, setActiveTarget] = useState(initialTargetDate || TOURNAMENT.eventDate);
  const [time, setTime] = useState(() => getCountdown(activeTarget));

  // Listen to admin panel settings in real-time
  useEffect(() => {
    if (initialTargetDate) {
      setActiveTarget(initialTargetDate);
      return;
    }

    const unsub = onSettingsChange((settings) => {
      if (settings?.countdownTarget) {
        const parsed = new Date(settings.countdownTarget);
        if (!isNaN(parsed.getTime())) {
          setActiveTarget(parsed);
          setTime(getCountdown(parsed));
        }
      }
    });

    return unsub;
  }, [initialTargetDate]);

  useEffect(() => {
    setTime(getCountdown(activeTarget));
    const id = setInterval(() => {
      setTime(getCountdown(activeTarget));
    }, 1000);
    return () => clearInterval(id);
  }, [activeTarget]);

  if (time.expired) {
    return (
      <div className="text-center py-4 bg-primary-500/10 border border-primary-500/30 rounded-2xl px-6">
        <span className="text-xl sm:text-2xl font-bold text-primary-500 animate-pulse">
          🏀 TOURNAMENT IS LIVE!
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Block value={time.days} label="Days" />
      <span className="text-white text-2xl sm:text-3xl font-bold pb-6 text-primary-400">:</span>
      <Block value={time.hours} label="Hours" />
      <span className="text-white text-2xl sm:text-3xl font-bold pb-6 text-primary-400">:</span>
      <Block value={time.minutes} label="Mins" />
      <span className="text-white text-2xl sm:text-3xl font-bold pb-6 text-primary-400">:</span>
      <Block value={time.seconds} label="Secs" />
    </div>
  );
}
