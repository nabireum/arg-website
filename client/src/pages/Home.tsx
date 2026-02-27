import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useInspectComment } from '@/hooks/useInspectComment';

const TARGET_DATE = new Date('2026-03-01T19:00:00-03:00').getTime();
const INSPECT_MESSAGE = "Você achou mesmo que eu iria esconder algo aqui agora? Eu não sou estupida, acho que já deve ter percebido. Se quiser mesmo saber meu segredo, então aguarde mais um pouco. Acho que vamos nos encontrar aqui muito em breve...";

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
  const [, navigate] = useLocation();
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useInspectComment(homeRef, INSPECT_MESSAGE);

  const countdown = useMemo(() => {
    if (timeLeft.diff === 0) {
      return '00:00:00:00';
    }
    return `${formatUnit(timeLeft.days)}:${formatUnit(timeLeft.hours)}:${formatUnit(timeLeft.minutes)}:${formatUnit(timeLeft.seconds)}`;
  }, [timeLeft]);

  return (
    <div ref={homeRef} className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      {/* Timer section - positioned higher */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center">
        <h1
          className="text-4xl md:text-6xl font-bold tracking-[0.15em]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {countdown}
        </h1>
        <p
          className="mt-3 text-xs md:text-sm tracking-[0.2em] text-white/60"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          DOMINGO • 01/03/2026 • 19H
        </p>
      </div>

      {/* Main content - centered */}
      <div className="text-center flex-1 flex flex-col items-center justify-center gap-12">
        {/* Clickable computer image - larger */}
        <button
          onClick={() => navigate('/room')}
          className="focus:outline-none cursor-pointer"
          title=""
        >
          <img
            src="/old-computer.png"
            alt="Computador antigo"
            className="w-96 md:w-[500px] h-auto"
          />
        </button>

        {/* "* Desligado" text - pixelated font with proper spacing */}
        <p
          className="text-3xl md:text-5xl font-bold tracking-[0.15em]"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            letterSpacing: '0.08em'
          }}
        >
          * Desligado
        </p>
      </div>
    </div>
  );
}
