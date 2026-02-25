import { useGame } from '@/contexts/GameContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function Room1() {
  const { startGame, mode } = useGame();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (mode) {
      navigate('/room1/cofre');
    }
  }, [mode, navigate]);

  const handleModeSelect = (selectedMode: 'normal' | 'hard') => {
    startGame(selectedMode);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)',
          animation: 'scan 8s linear infinite'
        }} />
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.8; }
        }
        .flicker {
          animation: flicker 0.15s infinite;
        }
      `}</style>
      <div className="relative z-10 max-w-2xl w-full">
        <div className="mb-16 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tighter" style={{
            fontFamily: "'IBM Plex Mono', monospace",
            textShadow: '2px 2px 0px rgba(255,255,255,0.1)',
            letterSpacing: '-0.02em',
            minHeight: '4rem'
          }}>
          </h1>
          <div className="h-px bg-white my-8 mx-auto w-32" />

          <p className="text-sm md:text-base tracking-widest mb-12" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.1em'
          }}>
            A PRIMEIRA ESCOLHA.
          </p>
        </div>
        <div className="flex flex-col gap-6 md:gap-8">
          <button
            onClick={() => handleModeSelect('normal')}
            className="group relative px-8 py-6 border-2 border-white bg-black text-white transition-all duration-100 hover:bg-white hover:text-black active:scale-95"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            <span className="relative z-10 block">
              DEVENEMENTIEL
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100" style={{
              boxShadow: '0 0 20px rgba(255,255,255,0.5), inset 0 0 20px rgba(255,255,255,0.1)'
            }} />
          </button>
          <div className="text-center text-xs md:text-sm" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.6)'
          }}>
            RESOLVA NO SEU RITMO
          </div>
          <button
            onClick={() => handleModeSelect('hard')}
            className="group relative px-8 py-6 border-2 border-white bg-black text-white transition-all duration-100 hover:bg-white hover:text-black active:scale-95"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            <span className="relative z-10 block">
              GOLDREAMZ
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100" style={{
              boxShadow: '0 0 20px rgba(255,255,255,0.5), inset 0 0 20px rgba(255,255,255,0.1)'
            }} />
          </button>
          <div className="text-center text-xs md:text-sm" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.6)'
          }}>
            RESOLVA TUDO ANTES DO TEMPO ACABAR (e ganhe um BÔNUS)
          </div>
        </div>
        <div className="mt-16 text-center text-xs" style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.4)'
        }}>
          <p>AVISO: ALGUMAS VERDADES SÃO PERIGOSAS</p>
          <p className="mt-2">PROSSIGA POR SUA CONTA E RISCO</p>
        </div>
      </div>
    </div>
  );
}
