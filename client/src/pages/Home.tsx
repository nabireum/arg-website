import { useEffect, useMemo, useState } from 'react';

const TARGET_DATE = new Date('2026-02-28T20:00:00-03:00').getTime();

function formatUnit(value: number) {
  return value.toString().padStart(2, '0');
}

function getTimeLeft() {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { diff, days, hours, minutes, seconds };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    if (timeLeft.diff === 0) {
      return '00:00:00:00';
    }

    return `${formatUnit(timeLeft.days)}:${formatUnit(timeLeft.hours)}:${formatUnit(timeLeft.minutes)}:${formatUnit(timeLeft.seconds)}`;
  }, [timeLeft]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center">
        <p
          className="mb-4 text-xs md:text-sm tracking-[0.3em] text-white/70"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          CONTAGEM REGRESSIVA
        </p>
        <h1
          className="text-4xl md:text-7xl font-bold tracking-wider"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {countdown}
        </h1>
        <p
          className="mt-4 text-xs md:text-sm tracking-[0.2em] text-white/60"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          SÁBADO • 28/02/2026 • 20H
        </p>
      </div>
    </div>
  );
}
