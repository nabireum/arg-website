import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';

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

  useEffect(() => {
    if (!homeRef.current) return;

    const commentNode = document.createComment(` ${INSPECT_MESSAGE} `);
    homeRef.current.prepend(commentNode);

    return () => {
      if (homeRef.current?.contains(commentNode)) {
        homeRef.current.removeChild(commentNode);
      }
    };
  }, []);

  const countdown = useMemo(() => {
    if (timeLeft.diff === 0) {
      return '00:00:00:00';
    }
    return `${formatUnit(timeLeft.days)}:${formatUnit(timeLeft.hours)}:${formatUnit(timeLeft.minutes)}:${formatUnit(timeLeft.seconds)}`;
  }, [timeLeft]);

  return (
    <div ref={homeRef} className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      {/* Timer at the top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <h1
          className="text-3xl md:text-5xl font-bold tracking-[0.2em]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {countdown}
        </h1>
        <p
          className="mt-2 text-xs md:text-sm tracking-[0.2em] text-white/60"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          DOMINGO • 01/03/2026 • 19H
        </p>
      </div>

      {/* Main content */}
      <div className="text-center flex-1 flex flex-col items-center justify-center">
        <p
          className="mb-12 text-xs md:text-sm tracking-[0.3em] text-white/70"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Nos encontraremos de novo :).
        </p>

        {/* Clickable computer image */}
        <button
          onClick={() => navigate('/room')}
          className="mb-8 hover:opacity-80 transition-opacity duration-200 cursor-pointer focus:outline-none"
          title="Clique para entrar"
        >
          <img
            src="/old-computer.png"
            alt="Computador antigo"
            className="w-64 md:w-80 h-auto"
          />
        </button>

        {/* "* Desligado" text */}
        <p
          className="text-2xl md:text-4xl font-bold tracking-[0.2em]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          * Desligado
        </p>
      </div>

      {/* Background watermark */}
      <p
        className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl md:text-6xl font-bold tracking-[0.3em] text-white pointer-events-none"
        style={{ fontFamily: "'IBM Plex Mono', monospace", opacity: 0.06 }}
      >
        ZEYT OEHT NOCIQ
      </p>
    </div>
  );
}
