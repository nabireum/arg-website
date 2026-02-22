import { useGame } from '@/contexts/GameContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

/**
 * Home Page - ARG Cyberpunk Dystopian Style
 * 
 * Design Philosophy: Minimalismo Cibernético Distópico
 * - Tipografia: IBM Plex Mono (títulos) + Space Mono (corpo)
 * - Cores: Preto absoluto + branco puro
 * - Efeitos: Glitch, tremor, contraste extremo
 * - Layout: Centralizado verticalmente, assimétrico horizontalmente
 * 
 * Contexto: Danica Balian escondeu emails com informações sobre seu desaparecimento.
 * O jogador precisa provar que é de confiança resolvendo enigmas para acessar a verdade.
 */

export default function Home() {
  const { startGame, mode } = useGame();
  const [, navigate] = useLocation();

  // Se o jogo já começou, redireciona para o primeiro enigma
  useEffect(() => {
    if (mode) {
      navigate('/cofre');
    }
  }, [mode, navigate]);

  const handleModeSelect = (selectedMode: 'normal' | 'hard') => {
    startGame(selectedMode);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Background effect - horizontal scan lines */}
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

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Title - Empty for mystery */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tighter" style={{
            fontFamily: "'IBM Plex Mono', monospace",
            textShadow: '2px 2px 0px rgba(255,255,255,0.1)',
            letterSpacing: '-0.02em',
            minHeight: '4rem'
          }}>
            {/* Empty - mystery element */}
          </h1>
          
          {/* Divider line */}
          <div className="h-px bg-white my-8 mx-auto w-32" />
          
          <p className="text-sm md:text-base tracking-widest mb-12" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.1em'
          }}>
            ESCOLHA SEU CAMINHO
          </p>
        </div>

        {/* Mode selection buttons */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Normal Mode Button */}
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
              Modo: Normal
            </span>
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100" style={{
              boxShadow: '0 0 20px rgba(255,255,255,0.5), inset 0 0 20px rgba(255,255,255,0.1)'
            }} />
          </button>

          {/* Difficulty indicator */}
          <div className="text-center text-xs md:text-sm" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.6)'
          }}>
            SEM LIMITE DE TEMPO • RESOLVA NO SEU RITMO
          </div>

          {/* Hard Mode Button */}
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
              Modo: Difícil
            </span>
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100" style={{
              boxShadow: '0 0 20px rgba(255,255,255,0.5), inset 0 0 20px rgba(255,255,255,0.1)'
            }} />
          </button>

          {/* Hard mode warning */}
          <div className="text-center text-xs md:text-sm" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.6)'
          }}>
            CRONÔMETRO DE 15 MINUTOS • RESOLVA TODOS OS ENIGMAS ANTES DO TEMPO ACABAR
          </div>
        </div>

        {/* Footer message */}
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
